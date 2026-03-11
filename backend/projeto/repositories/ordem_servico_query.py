from models.ordens_servico import OrdensServico
from extensions.extensoes import db
from sqlalchemy import text

class OrdemServicoRepository:

    @staticmethod
    def query_buscar_OS_id(id: int):
        os = OrdensServico.query.get(id)
        
        return os
    
    @staticmethod
    def query_criar_os(dados: OrdensServico):
        db.session.add(dados)

        return dados
    
    @staticmethod
    def query_criar_os_itens(dados):
        db.session.add_all(dados)

        return dados
    
    @staticmethod
    def query_listar_os_itens():
        itens = db.session.execute(
            text(
                f"""
                    select ordem_servico_itens.ordem_servico_id, ordem_servico_itens.item_numero, ordem_servico_itens.descricao, 
                    ordem_servico_itens.quantidade, ordem_servico_itens.unidade 
                    from ordem_servico_itens;
                """
            )
        ).mappings()

        return itens.all()
    
    @staticmethod
    def query_listar_os():
        os = db.session.execute(
            text(
                """
                    SELECT 
                    ordens_servico.id,
                    ordens_servico.numero_os,
                    ordens_servico.cliente_id,
                    clientes.nome AS cliente_nome,
                    obras.id AS obra_id,
                    carros.modelo AS carro_modelo,
                    carros.cor AS carro_cor,
                    ordens_servico.data_execucao,
                    ordens_servico.descricao_servico,
                    ordens_servico.observacoes_importantes,
                    enderecos.cidade,
                    enderecos.endereco,
                    ordens_servico.status

                    FROM ordens_servico

                    INNER JOIN clientes
                        ON ordens_servico.cliente_id = clientes.id

                    INNER JOIN obras
                        ON ordens_servico.obra_id = obras.id

                    LEFT JOIN carros
                        ON ordens_servico.carro_id = carros.id

                    LEFT JOIN enderecos
                        ON obras.id = enderecos.obra_id;
                """
            )
        ).mappings()

        return os.all()

