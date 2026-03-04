from services.clientes_services import ClientesServices
from DTOs.clienteResponseDTO import ClienteResponseDTO
class ClientesController:

    @staticmethod
    def listar_clientes():
        try:
            data_clientes = ClientesServices.listar_clientes_service()

            clientes = [
                ClienteResponseDTO(cliente).build()
                for cliente in data_clientes
            ]


            return {"success": True,
                    "message": "clientes buscados com sucesso!",
                    "data": clientes}
        except Exception as e:
            print("erro:", str(e))
            raise ValueError("Erro interno no sistema")
        