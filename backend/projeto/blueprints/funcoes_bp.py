from flask import Blueprint, jsonify, request

funcoes_bp = Blueprint("funcoes_bp", __name__)

@funcoes_bp.route('', methods=['GET'])
def listar_funcoes():
    pass 