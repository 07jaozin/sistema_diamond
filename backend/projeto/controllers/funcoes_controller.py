from services.funcoes_services import FuncoesService

class FuncoesController:
    def listar_funcoes_controlller():
        try:
            funcoes = FuncionariosService.listar_funcoes_services()

            return jsonify(funcoes)

        except ValueError as e:
            print("valueError: ", str(e))
            return jsonify({
                "success": False,
                "message": str(e)
            }), 400