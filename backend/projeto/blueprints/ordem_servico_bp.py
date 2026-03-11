from flask import Blueprint, jsonify, request
from controllers.ordem_servico_controller import OrdemServicosController as OSController 
from DTOs.ordemServicoDTO.ordemServicoDTO import OrdemServicoDTO 

os_bp = Blueprint("ordem_servico", __name__)


@os_bp.route("", methods=["POST"])
def registrar_os():

    try:
        data = request.form.to_dict()
        print("Data: ", data, "\n")

        dto = OrdemServicoDTO(data).build()

        print("OS: ", dto)

        os = OSController.criar_OS_controller(dto)


        return jsonify(os), 201

    except ValueError as e:
        print("valueError: ", str(e))
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400

    except Exception as e:

        print(e)

        return jsonify({
            "success": False,
            "message": f"Erro: {str(e)}"
        }), 500
    
@os_bp.route('', methods=['GET'])
def listar_os():
    try:
        lista_os = OSController.listar_os_controller()

        return jsonify(lista_os), 201
    
    except ValueError as e:
        print("valueError: ", str(e))
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400
    
    except Exception as e:
        print(e)
        return jsonify({
            "success": False,
            "message": f"Erro: {str(e)}"
        }), 500


