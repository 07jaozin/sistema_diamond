from services.os_services import OrdemServicoServices as OSServices
from sqlalchemy.exc import IntegrityError
from extensions.extensoes import db

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

            print(lista_os)
            return {
                "success": True,
                "data": lista_os
            }
        
        except Exception as e:
            raise ValueError ("Erro interno ao listar as ordens de serviço", str(e))