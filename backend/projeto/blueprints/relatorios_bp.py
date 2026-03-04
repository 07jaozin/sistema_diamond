from flask import jsonify, request, Blueprint
from DTOs.relatorios_DTO import RelatoriosDTOs
import requests
from datetime import date

relatorios_bp = Blueprint("relatorios", __name__)

rota_n8n = "http://localhost:5678/webhook-test/9345ef9e-ebd0-4b1c-98ef-777bd762321d"

@relatorios_bp.route('/', methods=['POST'])
def registrar():
    pass

@relatorios_bp.route('/n8n', methods=['POST'])
def registrar_n8n():
    try:
        form_dict = request.form.to_dict(flat= False)
        print(form_dict)
        form_dict["data_hoje"] = date.today().strftime("%d/%m/%Y")
        print("OS:", form_dict['numero_os'])
        
        dto = RelatoriosDTOs(form_data= form_dict)
        anexos = request.files.getlist("anexos")
        files = [
            ("anexos", (file.filename, file.stream, file.content_type))
            for file in anexos
        ]

        response = requests.post(
            rota_n8n,
            data=dto.build(),
            files=files
        )

        return jsonify({"sucesso": True}), 200
    except Exception as e:
        print(str(e))
        return jsonify({"erro": str(e)}), 400