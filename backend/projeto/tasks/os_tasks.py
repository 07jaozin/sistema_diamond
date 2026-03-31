import requests
from services.utilits_services import UtilitsServices

def enviar_cancelamento(os: dict, telefones: dict):
    try:
        print("enviar_cancelamento")
        os_serialize = UtilitsServices.serialize_datas(os[0])
        requests.post("http://localhost:5678/webhook-test/8d833275-40b1-4d5d-9d24-1f9f1b8fdbf6", json ={
            "os": os_serialize,
            "telefones": telefones
        })

    
    except Exception as e:
        print("Erro ao enviar:", e)
