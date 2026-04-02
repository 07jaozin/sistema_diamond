from models.usuarios import Usuarios
from extensions.extensoes import db

class UsuarioRepository:

    @staticmethod
    def query_criar_usuario(dados: Usuarios):
        db.session.add(dados)

        return dados