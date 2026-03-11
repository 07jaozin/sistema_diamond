from flask import Blueprint, jsonify, request
import requests
from controllers.obras_controller import ObrasController

obras_bp = Blueprint("obras_bp", __name__)

@obras_bp.route('', methods=['GET'])
def listar_obras():
    try:
       obras =  ObrasController.listar_obras_controller()

       return jsonify(obras), 200
    except Exception as e:
         return jsonify({"Erro inesperado internamente!": str(e)}), 500
        