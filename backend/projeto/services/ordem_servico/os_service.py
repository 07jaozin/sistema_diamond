from repositories.facade import Repositories as Repo
from models.facade import Models
from services.utilits_services import UtilitsServices
from services.ordem_servico.equipe_service import EquipeService
from services.ordem_servico.itens_service import ItensService
from services.ordem_servico.historico_service import HistoricoService
from DTOs.ordemServicoDTO.ordemServicoResponse import OSResponseDTO
from DTOs.ordemServicoDTO.telefonesResponse import TelefonesEquipeOSResponseDTO
from extensions.extensoes import db
from datetime import datetime
from typing import Dict, Any, List
from tasks.os_tasks import enviar_cancelamento
#from infra.queue import fila_eventos


class OrdemServicoServices:

    @staticmethod
    def gerar_numero_os() -> str:
        
        numero = Repo.sequencias.query_numero_os()
        ano = datetime.now().year
        return f"OS-{ano}-{numero:04d}"

    @staticmethod
    def criar_os_service(dados: Dict[str, Any]) -> Dict[str, Any]:
       
        equipamentos_dict = dados.pop("equipamentos", None)
        equipe_dict = dados.pop("equipe", None)

        with db.session.begin():
            # Validações de dependências
            cliente = Repo.clientes.query_buscar_cliente_id(dados.get('cliente_id'))
            if cliente is None:
                raise ValueError("O ID do cliente esta ausente!")

            obra = Repo.obras.query_buscar_obras_id(dados.get('obra_id'))
            if obra is None:
                raise ValueError("O ID da obra esta ausente!")

            carro = Repo.carros.query_buscar_carro_id(dados.get('carro_id')) if dados.get('carro_id') else None
            if dados.get('carro_id') and carro is None:
                raise ValueError("O ID do carro esta ausente!")

            # Gera e atribui número OS
            dados['numero_os'] = OrdemServicoServices.gerar_numero_os()

            # Cria OS principal
            os = Repo.os.query_criar_os(Models.os(**dados))
            db.session.flush()

            # Registra historico inicial
            HistoricoService.registrar_evento(
                os.id, os.responsavel_tecnico_id, "Criação da OS", "OS Criada"
            )

            # Cria itens se fornecidos
            equipamentos = []
            if equipamentos_dict:
                equipamentos = ItensService.criar_itens(os.id, equipamentos_dict)

            # Cria equipe se fornecida
            equipe_os = []
            if equipe_dict:
                equipe_os = EquipeService.criar_equipe(os.id, equipe_dict)

        return {
            "os": os.to_dict(),
            "equipamentos": [item.to_dict() for item in equipamentos],
            "historico": True  # Último historico já criado
        }

    @staticmethod
    def atualizar_os_service(os_id: int, dados: Dict[str, Any]) -> Dict[str, Any]:
        equipamentos_dict = dados.pop("equipamentos", None)
        equipe_dict = dados.pop("equipe", None)

        with db.session.begin():
            Repo.os.query_atualizar_os(os_id, dados)
            EquipeService.atualizar_equipe(os_id, equipe_dict)
            HistoricoService.registrar_evento(os_id, dados.get('responsavel_tecnico_id'), "Atualização", f"A OS foi editada com sucesso")

        return {"message": "OS atualizada"}

    @staticmethod
    def listar_os_services() -> Any:
       
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
    def buscar_os_id_service(os_id: int) -> Any:
       
        ordens = Repo.os.query_listar_os_id(os_id)
        equipes = Repo.equipe.query_listar_equipe_os_id(os_id)
        equipamentos = Repo.os.query_listar_os_id_itens(os_id)
        responsaveis = Repo.funcionarios.query_listar_responsavel_os_id(os_id)
        historico = Repo.historico.query_buscar_historico_os_id(os_id)

        ordens = [dict(os) for os in ordens]
        equipes = [dict(e) for e in equipes]
        equipamentos = [dict(eq) for eq in equipamentos]
        historico = [h.to_dict() for h in historico]
        responsaveis = [dict(r) for r in responsaveis]

        return OSResponseDTO.montar(ordens, equipes, equipamentos, responsaveis, historico)

    @staticmethod
    def buscar_os_N8N_service(os_id: int) -> Dict[str, Any]:
     
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

        os_montada = OSResponseDTO.montar(ordens, equipes, equipamentos, responsavel, [])

        for os_item in os_montada:
            endereco = ", ".join(filter(None, [
                os_item.get("endereco"),
                os_item.get("cidade"),
                os_item.get("estado")
            ]))
            os_item["link_endereco"] = UtilitsServices.gerar_link_endereço(endereco)

        telefones_montada = TelefonesEquipeOSResponseDTO.montar(os_id, telefones)
        
        return {
            "os": os_montada,
            "telefones": telefones_montada
        }

    @staticmethod
    def cancelar_os_service(os_id: int, dados: Dict[str, Any]) -> Any:
        with db.session.begin():
            ordens = Repo.os.query_listar_os_id(os_id)
            if not ordens:
                raise ValueError("O id da OS está inválido!")
            
            ordens_to_dict = [dict(os) for os in ordens]
            
            Repo.os.query_atualizar_os(os_id, {"status": "Cancelada"})
            
            HistoricoService.registrar_evento(os_id, dados.get('funcionario_id'), "Cancelamento", dados.get('descricao', 'OS cancelada'))
           
        print("aqui")
        print(ordens_to_dict)
        foi_emitida = ordens_to_dict[0].get("status") == "Emitida"
      

        if foi_emitida:
            telefones = Repo.os.query_telefones_equipe_por_os(os_id)
            telefones = [dict(t) for t in telefones]
            enviar_cancelamento(ordens_to_dict, telefones)

            #fila_eventos.enqueue("tasks.os_tasks.py.enviar_cancelamento", os_antiga, telefones) tentar depois
                    
        return {"status": "Cancelada", "Emitida": False, "dados_os": ordens_to_dict, "telefone_equipe": []}

        
        
        

    @staticmethod
    def emitir_os_service(dados: Dict[str, Any]) -> Any:
     
        with db.session.begin():
            Repo.os.query_atualizar_os(dados.get('ordem_servico_id'), {"status": "Emitida"})
            HistoricoService.registrar_evento(dados.get('ordem_servico_id'), dados.get('funcionario_id'), "Emissão", dados.get('descricao', 'OS emitida'))
        return {"status": "Emitida"}

    @staticmethod
    def adicionar_observacao_os_service(dados: Dict[str, Any]) -> Any:
        
        with db.session.begin():
            HistoricoService.registrar_evento(dados.get('ordem_servico_id'), dados.get('funcionario_id'), "Observação", dados.get('descricao'))
        return {"historico_registrado": True}
    

