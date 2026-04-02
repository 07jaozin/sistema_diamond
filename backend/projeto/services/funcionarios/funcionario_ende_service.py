from repositories.facade import Repositories as Repo
from models.facade import Models
from typing import Dict, Any, List

class FuncionarioEnderecoService:

    @staticmethod
    def adicionar_endereco_service(funcionario_id: int, dados: Dict[str, Any]) -> Any:
        
        novo_endereco = Repo.funcionario_enderecos.query_adicionar_endereco(Models.funcionario_enderecos(funcionario_id, **dados))

        return novo_endereco
    