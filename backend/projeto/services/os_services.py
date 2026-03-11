from repositories.clientes_querys import ClientesRepository as ClientesQuery
from repositories.obras_querys import ObrasRepository as ObrasQuery
from repositories.carros_querys import CarrosRepository as CarrosQuery
from repositories.ordem_servico_query import OrdemServicoRepository as OSQuery
from models.ordem_servico_funcionario import OrdemServicoFuncionario as OSFuncionarios
from repositories.os_equipe_query import OrdemServicoEquipeRepository as OSEquipeQuery
from repositories.sequencias_query import SequenciasRepository as SequenciasQuery
from models.ordens_servico import OrdensServico
from DTOs.ordemServicoDTO.ordemServicoResponse import OSResponseDTO
from datetime import datetime
import re
import json
from models.ordem_servico_itens import OrdemServicoItens
from extensions.extensoes import db


class OrdemServicoServices:

    @staticmethod
    def gerar_numero_os():

        numero = SequenciasQuery.query_numero_os()

        ano = datetime.now().year

        return f"OS-{ano}-{numero:04d}"


    @staticmethod
    def criar_os_equipe_service(os_id: int, funcionarios: str):
        equipe_str = json.loads(funcionarios)
        equipe_list = []

        for funcionario_id in equipe_str:
            funcionario_os = OSFuncionarios(
                ordem_servico_id = os_id,
                funcionario_id = funcionario_id
            )

            equipe_list.append(funcionario_os)

        equipe = OSEquipeQuery.query_adicionar_os_equipe(equipe_list)

        return equipe

    @staticmethod
    def criar_os_itens_service(os_id: int, equipamentos: str):

        if not equipamentos:
            return

        lista_equipamentos = json.loads(equipamentos)

        itens_lista = []
        item_numero = 1

        for item in lista_equipamentos:

            descricao = item
            quantidade = None
            unidade = None

            match = re.search(r"\((.*?)\)", item)

            if match:
                conteudo = match.group(1)  

                partes = conteudo.split()

                if len(partes) >= 2:
                    quantidade = float(partes[0])
                    unidade = partes[1]

                descricao = item.split("(")[0].strip()

            novo_item = OrdemServicoItens(
                ordem_servico_id=os_id,
                item_numero=item_numero,
                descricao=descricao,
                quantidade=quantidade,
                unidade=unidade
            )

            itens_lista.append(novo_item)
            item_numero += 1

        itens = OSQuery.query_criar_os_itens(itens_lista)
        
        return itens
        
    @staticmethod
    def criar_os_service(dados: dict):
        equipamentos_dict = dados.pop("equipamentos", None)
        equipe_dict = dados.pop("equipe")

        with db.session.begin():
            cliente = ClientesQuery.query_buscar_cliente_id(dados.get('cliente_id'))
            if cliente is None:
                raise ValueError("O ID do cliente esta ausente!")

            obra = ObrasQuery.query_buscar_obras_id(dados.get('obra_id'))
            if obra is None:
                raise ValueError("O ID da obra esta ausente!")

            carro = CarrosQuery.query_buscar_carro_id(dados.get('carro_id'))
            if carro is None:
                raise ValueError("O ID do carro esta ausente!")
            
            numero_os = OrdemServicoServices.gerar_numero_os()
            dados['numero_os'] = numero_os

            os = OSQuery.query_criar_os(OrdensServico(**dados))
            db.session.flush()

            equipamentos = OrdemServicoServices.criar_os_itens_service(
                os.id,
                equipamentos_dict
            )

            equipe_os = OrdemServicoServices.criar_os_equipe_service(
                os.id,
                equipe_dict
            )

        return {
            "os": os.to_dict(),
            "equipamentos": [item.to_dict() for item in equipamentos],
        }
    
    @staticmethod
    def listar_os_services():
        ordens = OSQuery.query_listar_os()
        equipes = OSEquipeQuery.query_listar_equipe_os()
        equipamentos = OSQuery.query_listar_os_itens()

        ordens = [dict(os) for os in ordens]
        equipes = [dict(e) for e in equipes]
        equipamentos = [dict(eq) for eq in equipamentos]

        

        return OSResponseDTO.montar(ordens, equipes, equipamentos)
    
    

     


        
