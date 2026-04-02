from repositories.facade import Repositories as Repo
from models.facade import Models
from typing import Dict, Any, List

class FuncionarioService:

    @staticmethod
    def adicionar_funcionario_service(dados: Dict[str, Any]) -> Dict[str, Any]:

        novo_funcionario = Repo.funcionarios.query_adicionar_funcionario(Models.funcionarios(**dados))

        return {
            "id": novo_funcionario.id,
            "email": novo_funcionario.email
            }
    


