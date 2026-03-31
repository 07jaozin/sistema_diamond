from repositories.facade import Repositories as Repo
from models.facade import Models
from extensions.extensoes import db
import re
import json
from typing import List, Dict, Any, Optional


class ItensService:

    @staticmethod
    def listar_itens(os_id: int) -> List[Dict[str, Any]]:
       
        return Repo.os.query_listar_os_id_itens(os_id)

    @staticmethod
    def criar_itens(os_id: int, equipamentos_json: str) -> List[Any]:
       
        if not equipamentos_json:
            return []

        lista_equipamentos = json.loads(equipamentos_json)
        itens_lista = []
        item_numero = 1

        for item in lista_equipamentos:
            descricao = item
            quantidade: Optional[float] = None
            unidade: Optional[str] = None

            match = re.search(r"\((.*?)\)", item)
            if match:
                conteudo = match.group(1)
                partes = conteudo.split()
                if len(partes) >= 2:
                    quantidade = float(partes[0])
                    unidade = partes[1]
                descricao = item.split("(")[0].strip()

            novo_item = Models.ordem_servico_itens(
                ordem_servico_id=os_id,
                item_numero=item_numero,
                descricao=descricao,
                quantidade=quantidade,
                unidade=unidade
            )
            itens_lista.append(novo_item)
            item_numero += 1
    
        Repo.os.query_deletar_itens_por_os(os_id)
        Repo.os.query_criar_os_itens(itens_lista)

        return itens_lista

