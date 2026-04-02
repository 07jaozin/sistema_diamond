from models.facade import Models
from extensions.extensoes import db

class TelFuncionariosRepository:

    @staticmethod
    def query_adicionar_telefone(dados: Models.telefone_funcionario):
        db.session.add(dados)

        return dados