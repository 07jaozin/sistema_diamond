from models.ordens_servico import OrdensServico
from extensions.extensoes import db

class OrdemServicoRepository:

    @staticmethod
    def query_buscar_OS_id(id: int):
        os = OrdensServico.query.get(id)
        
        return os
    
    @staticmethod
    def query_criar_os(dados: OrdensServico):
        db.session.add(dados)

        return dados