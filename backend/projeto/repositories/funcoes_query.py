from models.funcoes import Funcoes
from extensions.extensoes import db

class FuncoesRepository:

    @staticmethod
    def query_listar_funcoes():
        funcoes = Funcoes.query.all()
        
        return funcoes