from repositories.facade import Repositories as Repo
from models.facade import Models
from typing import Dict, Any, List

class UsuarioService:

    @staticmethod
    def criar_usuario_service(funcionario_id: int, dados: Dict[str, Any]) -> Any:
        novo_usuario = Repo.usuario.query_cadastrar_usuario(Models.usuarios(funcionario_id, **dados))

        return novo_usuario