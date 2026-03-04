from flask import Blueprint, jsonify, request
import requests

os_bp = Blueprint("ordem_servico", __name__)

@os_bp.route('', methods = ['POST'])
def registrar_os():
    try:
        form_dict = request.form.to_dict()
        print(form_dict)


    except:
        pass