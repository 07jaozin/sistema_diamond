from models.relatorio_funcionarios import RelatorioFuncionarios
from extensions.extensoes import db

class RelatorioFuncionariosQuery:

    @staticmethod
    def criar_RTFuncionario(dados: RelatorioFuncionarios):
        db.session.add(dados)
        
        return dados