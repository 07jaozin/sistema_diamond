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
    def query_listar_os_id_itens(os_id: int):
        query = text(
                """
                    select ordem_servico_itens.ordem_servico_id, ordem_servico_itens.item_numero, ordem_servico_itens.descricao, 
                    ordem_servico_itens.quantidade, ordem_servico_itens.unidade 
                    from ordem_servico_itens
                    where ordem_servico_itens.ordem_servico_id = :os_id;
                """
            )
        
        itens = db.session.execute(query, {"os_id": os_id}).mappings()

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
                    contatos_cliente.telefone AS cliente_telefone,
                    obras.id AS obra_id,
                    carros.id AS carro_id,
                    carros.modelo AS carro_modelo,
                    carros.cor AS carro_cor,
                    ordens_servico.data_execucao,
                    ordens_servico.tipo_servico,
                    ordens_servico.descricao_servico,
                    ordens_servico.observacoes_importantes,
                    enderecos.cidade,
                    enderecos.endereco,
                    enderecos.estado,
                    enderecos.condominio,
                    enderecos.quadra,
                    enderecos.lote,
                    enderecos.observacoes,
                    ordens_servico.status,
                    ordens_servico.created_at

                    FROM ordens_servico

                    INNER JOIN clientes
                        ON ordens_servico.cliente_id = clientes.id

                    INNER JOIN obras
                        ON ordens_servico.obra_id = obras.id

                    LEFT JOIN carros
                        ON ordens_servico.carro_id = carros.id

                    LEFT JOIN enderecos
                        ON obras.id = enderecos.obra_id
                    
                    LEFT JOIN contatos_cliente
                        ON clientes.id = contatos_cliente.cliente_id
                        AND contatos_cliente.tipo = 'principal'

                    order by ordens_servico.data_execucao;
                """
            )
        ).mappings()

        return os.all()
    
    @staticmethod
    def query_listar_os_id(os_id: int):
        
        query = text(
                f"""
                    SELECT 
                    ordens_servico.id,
                    ordens_servico.numero_os,
                    ordens_servico.cliente_id,
                    clientes.nome AS cliente_nome,
                    contatos_cliente.telefone AS cliente_telefone,
                    obras.id AS obra_id,
                    carros.id AS carro_id,
                    carros.modelo AS carro_modelo,
                    carros.cor AS carro_cor,
                    ordens_servico.data_execucao,
                    ordens_servico.tipo_servico,
                    ordens_servico.descricao_servico,
                    ordens_servico.observacoes_importantes,
                    enderecos.cidade,
                    enderecos.endereco,
                    enderecos.estado,
                    enderecos.condominio,
                    enderecos.quadra,
                    enderecos.lote,
                    enderecos.observacoes,
                    ordens_servico.status,
                    ordens_servico.created_at

                    FROM ordens_servico

                    INNER JOIN clientes
                        ON ordens_servico.cliente_id = clientes.id

                    INNER JOIN obras
                        ON ordens_servico.obra_id = obras.id

                    LEFT JOIN carros
                        ON ordens_servico.carro_id = carros.id

                    LEFT JOIN enderecos
                        ON obras.id = enderecos.obra_id
                    
                    LEFT JOIN contatos_cliente
                        ON clientes.id = contatos_cliente.cliente_id
                        AND contatos_cliente.tipo = 'principal'

                    where ordens_servico.id = :os_id;
                """
            )

        os = db.session.execute(query, {"os_id": os_id}).mappings().all()

        return os
    
    @staticmethod
    def query_atualizar_os(os_id: int, campos: dict):

        os = OrdensServico.query.get(os_id)

        if not os:
            raise ValueError("Ordem de serviço não encontrada!")
        
        for campo, valor in campos.items():
            if hasattr(os, campo):
                setattr(os, campo, valor)

        return 
    
    @staticmethod
    def query_telefones_equipe_por_os(os_id: int):

        query = text("""
            SELECT funcionarios.nome, ordem_servico_funcionarios.ordem_servico_id, telefone_funcionario.telefone
            FROM funcionarios
            INNER JOIN telefone_funcionario 
                ON funcionarios.id = telefone_funcionario.funcionario_id
            LEFT JOIN ordem_servico_funcionarios 
                ON funcionarios.id = ordem_servico_funcionarios.funcionario_id
            WHERE ordem_servico_funcionarios.ordem_servico_id = :os_id;
        """)

        result = db.session.execute(query, {"os_id": os_id}).mappings()

        return result.all()
    @staticmethod
    def query_deletar_itens_por_os(os_id: int):

        query = text("""
            DELETE FROM ordem_servico_itens
            WHERE ordem_servico_id = :os_id
        """)

        result = db.session.execute(query, {"os_id": os_id})

        return result.rowcount
    
    @staticmethod
    def query_buscar_status_os_id(os_id: int):

        status = db.session.query(OrdensServico.status)\
                .filter(OrdensServico.id == os_id)\
                .scalar()
        
        return status



