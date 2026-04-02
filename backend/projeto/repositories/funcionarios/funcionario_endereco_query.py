from models.funcionario_enderecos import FuncionarioEnderecos
from extensions.extensoes import db

class FuncionarioEnderecoRepository:

    @staticmethod
    def query_adicionar_endereco(dados: FuncionarioEnderecos):
        db.session.add(dados)

        return dados 