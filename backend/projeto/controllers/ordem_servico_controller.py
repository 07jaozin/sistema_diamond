from services.os_services import OrdemServicoServices as OSServices
from sqlalchemy.exc import IntegrityError
from extensions.extensoes import db
from services.storogeServices import StorageService

class OrdemServicosController:

    @staticmethod
    def criar_OS_controller(data: dict):
        try:

            os = OSServices.criar_os_service(data)
            print(os)
            return {
                "success": True,
                "message": "Ordem de serviço criada com sucesso",
                "data": os
            }

        except IntegrityError as e:
            print(str(e))
            raise ValueError("Erro de integridade ao criar OS")

        except Exception as e:
            print(str(e))
            raise ValueError(f"Erro: {str(e)}")

    @staticmethod   
    def listar_os_controller():
        try:
            lista_os = OSServices.listar_os_services()

            return {
                "success": True,
                "data": lista_os
            }
        
        except Exception as e:
            raise ValueError ("Erro interno ao listar as ordens de serviço", str(e))
        
    @staticmethod
    def cancelar_os_controller(dados: dict):
        try:
            print(dados)
            os_atualizada = OSServices.cancelar_os_services(dados.get('ordem_servico_id'),dados)

            return {
                "success": True,
                "message": "OS cancelada com Sucesso!"
            }
        except Exception as e:
            raise ValueError ("Erro interno ao cancelar a OS!", str(e))
    
    @staticmethod
    def enviar_status_os_controller(dados: dict):
        try:
            os_atualizada = OSServices.enviada_os_status_services(dados)

            return {
                "success": True,
                "message": "OS Emitida com Sucesso!"
            }
        except Exception as e:
            raise ValueError ("Erro interno ao cancelar a OS!", str(e))
    @staticmethod
    def observacao_os_controller(dados: dict):
        try:
            os_atualizada = OSServices.observacao_os_services(dados)

            return {
                "success": True,
                "message": "Observação adicionada com sucesso!"
            }
        except Exception as e:
            raise ValueError ("Erro interno ao adicionar observação a OS!", str(e))
        
    @staticmethod
    def buscar_os_N8N_controller(os_id: int):
        try:
            os_services_n8n = OSServices.buscar_os_N8N_service(os_id)

            telefones = os_services_n8n.get("telefones")
            os = os_services_n8n.get("os")

            return {
                "success": True,
                "message": "OS enviada com sucesso!",
                "os": os,
                "telefones": telefones
            }
        

        except Exception as e:
            raise ValueError ("Erro interno ao enviar a OS!", str(e))
        
    @staticmethod
    def uploado_os_controller(file):

        file_bytes = file.read()
        filename = file.filename 

        storage = StorageService()

        key = storage.upload_file(file_bytes, filename)
        url = storage.generate_url(key, expires=3600)

        return{
            "url": url
        }
    
    @staticmethod
    def buscar_os_id_controller(id: int):
        try:
            os = OSServices.buscar_os_id_services(id)

            return {
                "success": True,
                "data": os
            }
        
        except Exception as e:
            raise ValueError ("Erro interno ao buscar a ordem de serviço", str(e))
        
    @staticmethod
    def atualizar_os_controller(data: dict, os_id: int):
        try:
            os = OSServices.atualizar_os_services(os_id, data)
            print(os)
            return {
                "success": True,
                "message": "Ordem de serviço atualizada com sucesso",
                "data": os
            }

        except IntegrityError as e:
            print(str(e))
            raise ValueError("Erro de integridade ao criar OS")

        except Exception as e:
            print(str(e))
            raise ValueError(f"Erro: {str(e)}")