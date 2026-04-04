from flask import Blueprint, jsonify, request
import requests
from controllers.ordem_servico_controller import OrdemServicosController as OSController 
from DTOs.ordemServicoDTO.ordemServicoDTO import OrdemServicoDTO 
from DTOs.historicoOSDTO.historicoOSRequest import HistoricoOSRequest
from DTOs.ordemServicoDTO.arquivoOSDTO import ArquivosOSDTO

os_bp = Blueprint("ordem_servico", __name__)

rota_n8n = "http://localhost:5678/webhook-test/305c6710-5aa3-4668-90ae-35f0b173426d"

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
@os_bp.route("/<int:os_id>", methods=["PUT"])
def editar_os(os_id):

    try:
        data = request.get_json(silent=True)

        dto = OrdemServicoDTO(data).build()

        os = OSController.atualizar_os_controller(dto, os_id)

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
    
@os_bp.route('/buscar_os_id/<int:os_id>', methods=['GET'])
def buscar_os_id(os_id):
    try:
        os = OSController.buscar_os_id_controller(os_id)

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

@os_bp.route('/detalhes', methods=['GET'])
def detalhes_os():
    try:
        dados = request.get_json(silent=True)
        id = dados.get('id') if dados else None


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


@os_bp.route('/observacao', methods=['POST'])
def observacao_os():
    try:
        dados = request.get_json(silent=True)
        dto = HistoricoOSRequest(dados, 10).to_dict()

        observacao_controller = OSController.observacao_os_controller(dto)

        return jsonify(observacao_controller), 200

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

@os_bp.route('/cancelar', methods=['PUT'])
def cancelar_os():
    try:
        dados = request.get_json(silent=True)
        dto = HistoricoOSRequest(dados, 10).to_dict()

        data_os_atualizada = OSController.cancelar_os_controller(dto)

        return jsonify(data_os_atualizada), 200

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
@os_bp.route('/status_enviar', methods=['PUT'])
def status_enviar_os():
    try:
        dados = request.get_json(silent=True)
        dto = HistoricoOSRequest(dados, 10).to_dict()

        data_os_atualizada = OSController.enviar_status_os_controller(dto)

        return jsonify(data_os_atualizada), 200

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

@os_bp.route('/enviar_os', methods=['POST'])
def enviar_os():
    try:
        os_id = request.get_json(silent=True)
        if not os_id:
            raise ValueError("O ID da os esta ausente!")
        
        os = OSController.buscar_os_N8N_controller(os_id)

        requests.post(
            rota_n8n,
            json=os,
            timeout=120
        )


        return jsonify(os), 200

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

@os_bp.route('/upload_os', methods=['POST'])
def upload_os():
    try:
        file = request.files.get("file")

        dto = ArquivosOSDTO(file).validar()

        response = OSController.uploado_os_controller(file)

        return jsonify(response), 200

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
