from flask import Blueprint, jsonify, request
import requests
from controllers.clientes_controller import ClientesController

clientes_bp = Blueprint("clientes_bp", __name__)

@clientes_bp.route('', methods=['GET'])
def listar_clientes():
    try:
        clientes = ClientesController.listar_clientes()

        return jsonify(clientes), 200
    
    except Exception as e:
        return jsonify({"erro": str(e)}), 400
