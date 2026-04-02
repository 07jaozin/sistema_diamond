from models.usuarios import Usuarios
from extensions.extensoes import db

class UsuarioRepository:

    @staticmethod
    def query_cadastrar_usuario(dados: Usuarios):
        db.session.add(dados)

        return dados
    
    @staticmethod
    def query_listar_usuarios():
        usuarios = Usuarios.query.all()

        return usuarios
    
    @staticmethod
    def query_listar_usuario_id(id: int):
        usuario = Usuarios.query.get(id)

        return usuario
    
    @staticmethod
    def query_atualizar_dados(user_id: int, campos: dict):
        usuario = Usuarios.query.get(user_id)

        for key, valor in campos.items():
            if hasattr(usuario, key):
                setattr(usuario, key, valor)

        return



