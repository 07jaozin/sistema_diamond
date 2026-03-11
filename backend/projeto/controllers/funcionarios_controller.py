from services.funcionarios_services import FuncionariosServices
from DTOs.funcionariosDTOs.EquipeTecnicaResponse import EquipeTecnicaResponse

class FuncionariosController:

    @staticmethod
    def listar_equipe_tecnica_controller():
        try:
            equipe_tecnica = FuncionariosServices.listar_equipe_tecnica_services()

            response = EquipeTecnicaResponse(equipe_tecnica).build()

            return {
                "success": True,
                "message": "Equipe tecnica buscada com exito!",
                "data": response
            }

        except Exception as e:
            raise ValueError("Erro interno ao listar os funcionarios!")