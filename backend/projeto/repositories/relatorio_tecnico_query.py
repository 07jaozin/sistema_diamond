from extensions.extensoes import db
from models.relatorios_tecnicos import RelatoriosTecnicos

class RelatorioTecnicoQuery:

    @staticmethod
    def criar_relatorio(relatorio: RelatoriosTecnicos):
        db.session.add(relatorio)

        return relatorio

    @staticmethod
    def query_listar_relatorios():
        relatorios = RelatoriosTecnicos.query.all()
        
        return relatorios