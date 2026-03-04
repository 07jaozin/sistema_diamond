from flask import jsonify, request, Blueprint
from controllers.carros_controller import CarrosController

carro_bp = Blueprint("carro_bp", __name__)

@carro_bp.route('', methods=['GET'])
def listar_carros():
    try:
        lista_carros = CarrosController.listar_carros()
        return jsonify(lista_carros), 200
    
    except RuntimeError:
        return jsonify({
            "success": False,
            "erro": "Erro interno ao buscar os carros"
        })