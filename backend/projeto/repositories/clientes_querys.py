from extensions.extensoes import db
from models.clientes import Clientes

class ClientesRepository:

    @staticmethod
    def query_listar_clientes():
        clientes = Clientes.query.all()

        return clientes
    
    @staticmethod
    def query_buscar_cliente_id(id:int):
        clientes = Clientes.query.get(id)

        return clientes