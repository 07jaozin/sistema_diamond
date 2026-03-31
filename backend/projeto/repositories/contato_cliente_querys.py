from extensions.extensoes import db
from sqlalchemy import text

class ContatoClienteRepository:

    @staticmethod
    def query_listar_telefone_cliente(client_id: int):
        query = text(
            """
                select telefone from contatos_cliente
                where cliente_id = :client_id and tipo = 'principal';
            """
        )

        telefone = db.session.execute(query, {"client_id": client_id}).mappings()

        return telefone.all()
