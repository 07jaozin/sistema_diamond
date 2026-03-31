from repositories.facade import Repositories as Repo
from models.facade import Models
from extensions.extensoes import db
from typing import List, Dict, Any
import json


class EquipeService:

    @staticmethod
    def listar_equipe(os_id: int) -> List[Dict[str, Any]]:
      
        return Repo.equipe.query_listar_equipe_os_id(os_id)

    @staticmethod
    def criar_equipe(os_id: int, funcionarios_json: str) -> List[Any]:
      
        equipe_ids = json.loads(funcionarios_json)
        equipe_list = []

        for funcionario_id in equipe_ids:
            funcionario_os = Models.ordem_servico_funcionario(
                ordem_servico_id=os_id,
                funcionario_id=funcionario_id
            )
            equipe_list.append(funcionario_os)

        Repo.equipe.query_adicionar_os_equipe(equipe_list)
        db.session.flush()
        return equipe_list

    @staticmethod
    def atualizar_equipe(os_id: int, novos_funcionarios_ids: List[int]) -> Dict[str, Any]:

        atuais_funcionarios = {
            row['id']
            for row in Repo.equipe.query_listar_equipe_os_id(os_id)
        }

        to_remove = atuais_funcionarios - set(novos_funcionarios_ids)
        to_add = set(novos_funcionarios_ids) - atuais_funcionarios

        if to_remove:
            Repo.equipe.query_remover_funcionarios_os(
                os_id,
                list(to_remove)
            )
        if to_add:
            novos_itens = [
                Models.ordem_servico_funcionario(
                    ordem_servico_id=os_id,
                    funcionario_id=func_id
                )
                for func_id in to_add
            ]
            Repo.equipe.query_adicionar_os_equipe(novos_itens)

        return {
            "removidos": len(to_remove),
            "adicionados": len(to_add),
            "total": len(novos_funcionarios_ids)
        }