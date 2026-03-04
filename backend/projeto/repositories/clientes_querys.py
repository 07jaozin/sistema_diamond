from extensions.extensoes import db
from models.clientes import Clientes

class ClientesRepository:

    @staticmethod
    def listar_clientes_query():
        clientes = Clientes.query.all()

        return clientes