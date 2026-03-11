from flask import Blueprint, jsonify, request
import requests
from controllers.funcionarios_controller import FuncionariosController

funcionarios_bp = Blueprint("funcionarios_bp", __name__)

@funcionarios_bp.route('/equipe_tecnica', methods=['GET'])
def listar_equipe_tecnica():
    try:
        equipe_tecnica = FuncionariosController.listar_equipe_tecnica_controller()

        return jsonify(equipe_tecnica), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "erro": "Erro interno ao buscar a equipe tecnica!"
        }), 400
    