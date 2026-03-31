from repositories.facade import Repositories as Repo
from models.facade import Models
from services.utilits_services import UtilitsServices
from DTOs.ordemServicoDTO.ordemServicoResponse import OSResponseDTO
from DTOs.ordemServicoDTO.telefonesResponse import TelefonesEquipeOSResponseDTO
from datetime import datetime
import re
import json
from extensions.extensoes import db



class OrdemServicoServices:
   
    @staticmethod
    def criar_os_service(*args, **kwargs):
        from services.ordem_servico.os_service import OrdemServicoServices as NewOSS
        return NewOSS.criar_os_service(*args, **kwargs)
    
    @staticmethod
    def atualizar_os_services(*args, **kwargs):
        from services.ordem_servico.os_service import OrdemServicoServices as NewOSS
        return NewOSS.atualizar_os_service(*args, **kwargs)

    @staticmethod
    def listar_os_services(*args, **kwargs):
        from services.ordem_servico.os_service import OrdemServicoServices as NewOSS
        return NewOSS.listar_os_services(*args, **kwargs)
    
    @staticmethod
    def buscar_os_id_services(*args, **kwargs):
        from services.ordem_servico.os_service import OrdemServicoServices as NewOSS
        return NewOSS.buscar_os_id_service(*args, **kwargs)

    # Add other methods forwarding...
    @staticmethod
    def cancelar_os_services(*args, **kwargs):
        from services.ordem_servico.os_service import OrdemServicoServices as NewOSS
        return NewOSS.cancelar_os_service(*args, **kwargs)

    @staticmethod
    def enviada_os_status_services(*args, **kwargs):
        from services.ordem_servico.os_service import OrdemServicoServices as NewOSS
        return NewOSS.emitir_os_service(*args, **kwargs)

    @staticmethod
    def observacao_os_services(*args, **kwargs):
        from services.ordem_servico.os_service import OrdemServicoServices as NewOSS
        return NewOSS.adicionar_observacao_os_service(*args, **kwargs)

    @staticmethod
    def buscar_os_N8N_service(*args, **kwargs):
        from services.ordem_servico.os_service import OrdemServicoServices as NewOSS
        return NewOSS.buscar_os_N8N_service(*args, **kwargs)


    """@staticmethod
    def gerar_numero_os():

        numero = Repo.sequencias.query_numero_os()

        ano = datetime.now().year

        return f"OS-{ano}-{numero:04d}"


    @staticmethod
    def criar_os_equipe_service(os_id: int, funcionarios: str):
        equipe_str = json.loads(funcionarios)
        equipe_list = []

        for funcionario_id in equipe_str:
            funcionario_os = Models.ordem_servico_funcionario(
                ordem_servico_id = os_id,
                funcionario_id = funcionario_id
            )

            equipe_list.append(funcionario_os)

        equipe = Repo.equipe.query_adicionar_os_equipe(equipe_list)

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

            novo_item = Models.ordem_servico_itens(
                ordem_servico_id=os_id,
                item_numero=item_numero,
                descricao=descricao,
                quantidade=quantidade,
                unidade=unidade
            )

            itens_lista.append(novo_item)
            item_numero += 1

        itens = Repo.os.query_criar_os_itens(itens_lista)
        
        return itens
        
    @staticmethod
    def criar_os_service(dados: dict):
        equipamentos_dict = dados.pop("equipamentos", None)
        equipe_dict = dados.pop("equipe", None)

        with db.session.begin():
            cliente = Repo.clientes.query_buscar_cliente_id(dados.get('cliente_id'))
            if cliente is None:
                raise ValueError("O ID do cliente esta ausente!")

            obra = Repo.obras.query_buscar_obras_id(dados.get('obra_id'))
            if obra is None:
                raise ValueError("O ID da obra esta ausente!")

            carro = Repo.carros.query_buscar_carro_id(dados.get('carro_id'))
            if carro is None:
                raise ValueError("O ID do carro esta ausente!")
            
            numero_os = OrdemServicoServices.gerar_numero_os()
            dados['numero_os'] = numero_os

            os = Repo.os.query_criar_os(Models.os(**dados))
            db.session.flush()

            registrar_historico = Repo.historico.query_registrar_historico_os(Models.historico_os(
                ordem_servico_id = os.id,
                funcionario_id = os.responsavel_tecnico_id,
                evento = "Criação da OS",
                descricao = "OS Criada",
                created_at = os.created_at
            ))

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
            "historico": registrar_historico.to_dict()
        }
    
    @staticmethod
    def editar_os_service(dados: dict):
        pass

    
    @staticmethod
    def listar_os_services():
        ordens = Repo.os.query_listar_os()
        equipes = Repo.equipe.query_listar_equipe_os()
        equipamentos = Repo.os.query_listar_os_itens()
        responsaveis = Repo.funcionarios.query_listar_responsavel_os()
        historico = Repo.historico.query_historico_os()

        ordens = [dict(os) for os in ordens]
        equipes = [dict(e) for e in equipes]
        equipamentos = [dict(eq) for eq in equipamentos]
        historico = [h.to_dict() for h in historico]
        responsaveis = [dict(r) for r in responsaveis]

        return OSResponseDTO.montar(ordens, equipes, equipamentos, responsaveis, historico)
    
    @staticmethod
    def cancelar_os_services(dados: dict):

        with db.session.begin():
            os_atualizada = Repo.os.query_atualizar_os(dados.get("ordem_servico_id"), {"status": "Cancelada"})

            historico = Repo.historico.query_registrar_historico_os(Models.historico_os(**dados))

        return os_atualizada
    
    @staticmethod
    def enviada_os_status_services(dados: dict):

        with db.session.begin():
            os_atualizada = Repo.os.query_atualizar_os(dados.get("ordem_servico_id"), {"status": "Emitida"})

            historico = Repo.historico.query_registrar_historico_os(Models.historico_os(**dados))

        return os_atualizada
    @staticmethod
    def observacao_os_services(dados: dict):

        with db.session.begin():
           
            historico = Repo.historico.query_registrar_historico_os(Models.historico_os(**dados))

        return historico
    
    @staticmethod
    def buscar_os_N8N_service(os_id: int):

        ordens = Repo.os.query_listar_os_id(os_id)
        equipes = Repo.equipe.query_listar_equipe_os_id(os_id)
        equipamentos = Repo.os.query_listar_os_id_itens(os_id)
        responsavel = Repo.funcionarios.query_listar_responsavel_os_id(os_id)
        telefones = Repo.os.query_telefones_equipe_por_os(os_id)

        telefones = [dict(t) for t in telefones]
        ordens = [dict(os) for os in ordens]
        equipes = [dict(e) for e in equipes]
        equipamentos = [dict(eq) for eq in equipamentos]
        responsavel = [dict(r) for r in responsavel]

        os_montada = OSResponseDTO.montar(ordens, equipes, equipamentos, responsavel,[])

        for os in os_montada:
            endereco = ", ".join(filter(None, [
                os.get("endereco"),
                os.get("cidade"),
                os.get("estado")

            ]))
            os["link_endereco"] = UtilitsServices.gerar_link_endereço(endereco)
            
        telefones_montada = TelefonesEquipeOSResponseDTO.montar(os_id, telefones)

        return {
            "os": os_montada,
            "telefones": telefones_montada
        }
"""
        


    
    

     


        
