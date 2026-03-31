from models.historico_ordem_servico import HistoricoOrdemServico
from extensions.extensoes import db

class HistoricoOSRepository:

    @staticmethod
    def query_historico_os():
        historico = HistoricoOrdemServico.query.all()

        return historico
    
    @staticmethod
    def query_buscar_historico_os_id(os_id: int):
        historico = HistoricoOrdemServico.query.filter_by(ordem_servico_id = os_id).all()

        return historico
    @staticmethod
    def query_registrar_historico_os(dados: HistoricoOrdemServico):
        db.session.add(dados)

        return dados
