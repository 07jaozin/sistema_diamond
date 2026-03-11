from services.obras_services import ObrasServices
from DTOs.obrasDTOs.obraResponseDTO import ObraResponseDTO

class ObrasController:

    @staticmethod
    def listar_obras_controller():
        try:
            resultados = ObrasServices.listar_obras_services()
            obras = [
                ObraResponseDTO(obra).build()
                for obra in resultados
            ]

            return {
                "success": True,
                "message": "Obras buscadas com sucesso!",
                "data": obras
            }
        except Exception as e:
            print(str(e))
            raise ValueError("Erro interno ao buscar as obras")