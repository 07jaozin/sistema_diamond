from repositories.facade import Repositories as Repo
from models.facade import Models
from typing import Dict, Any, List

class FuncionariosFuncoesService:

    @staticmethod
    def adicionar_funcionario_funcoes_service(funcionario_id: int, dados: Dict[str, Any]) -> Any:

        funcionario_funcao = Repo.funcionarios_funcoes.query_adicionar_funcao(Models.funcionario_funcoes(funcionario_id, **dados))

        return funcionario_funcao