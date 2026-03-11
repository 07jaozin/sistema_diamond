from extensions.extensoes import db
from sqlalchemy import text

class SequenciasRepository:

    @staticmethod
    def query_numero_os():

        db.session.execute(
            text("""
                UPDATE sequencias
                SET valor = LAST_INSERT_ID(valor + 1)
                WHERE nome = 'numero_os'
            """)
        )

        numero = db.session.execute(
            text("SELECT LAST_INSERT_ID()")
        ).scalar()

        return numero