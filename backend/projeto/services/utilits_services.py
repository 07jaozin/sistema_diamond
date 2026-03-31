import urllib.parse
import datetime

class UtilitsServices:

    @staticmethod
    def gerar_link_endereço(endereco: str):
        endereco_codificado = urllib.parse.quote(endereco)
        
        print(endereco_codificado)
        return f"https://www.google.com/maps/search/?api=1&query={endereco_codificado}"
    
    @staticmethod
    def serialize_datas(obj):
        for k, v in obj.items():
            if isinstance(v, (datetime.date, datetime.datetime)):
                obj[k] = v.isoformat()
        return obj
