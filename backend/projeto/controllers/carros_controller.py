from services.carros_services import CarrosServices

class CarrosController:

    @staticmethod
    def listar_carros():
        try:
            carros = CarrosServices.listar_veiculos_service()

            return {
                "success": True,
                "data": carros
            }
        
        except Exception as e:
            raise ValueError ("Erro interno ao listar os veiculos!", str(e))