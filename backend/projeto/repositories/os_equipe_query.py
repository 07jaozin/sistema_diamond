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