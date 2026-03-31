from models.ordem_servico_funcionario import OrdemServicoFuncionario
from extensions.extensoes import db
from sqlalchemy import select, text

class OrdemServicoEquipeRepository:

    @staticmethod
    def query_adicionar_os_equipe(dados):
        db.session.add_all(dados)

        return dados
    
    @staticmethod
    def query_listar_equipe_os():
        equipe = db.session.execute(
            text(
                f"""
                    select funcionarios.id, ordem_servico_funcionarios.ordem_servico_id, funcionarios.nome from funcionarios 
                    inner join ordem_servico_funcionarios on
                    funcionarios.id = ordem_servico_funcionarios.funcionario_id;
                """
            )
        ).mappings()

        return equipe.all()
    @staticmethod
    def query_listar_equipe_os_id(os_id: int):
        query = text(
                f"""
                    select funcionarios.id, ordem_servico_funcionarios.ordem_servico_id, funcionarios.nome from funcionarios 
                    inner join ordem_servico_funcionarios on
                    funcionarios.id = ordem_servico_funcionarios.funcionario_id
                    where ordem_servico_funcionarios.ordem_servico_id = :os_id;
                """
            )
        
        equipe = db.session.execute(query, {"os_id": os_id}).mappings()

        return equipe.all()
    @staticmethod
    def query_remover_funcionarios_os(os_id: int, lista_ids: list[int]):

        query = text(
                f"""
                    DELETE FROM ordem_servico_funcionarios WHERE ordem_servico_id = :os_id
                    AND funcionario_id IN :ids
                """
        )
        
        resultado = db.session.execute(query, {"os_id": os_id, "ids": tuple(lista_ids)})

        return resultado.rowcount