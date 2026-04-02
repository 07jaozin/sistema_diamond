from repositories.facade import Repositories as Repo
from models.facade import Models
from typing import Dict, Any, List

class FuncionariosTelService:

    @staticmethod
    def adicionar_telefone_service(funcionario_id: int, dados: Dict[str, Any]) -> Any:

        novo_telefone = Repo.telefone_funcionario.query_adicionar_telefone(Models.telefone_funcionario(funcionario_id, **dados))

        return novo_telefone