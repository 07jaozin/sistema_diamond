from models.funcionarios import Funcionarios
from models.funcoes import Funcoes
from models.funcionario_funcoes import FuncionarioFuncoes
from extensions.extensoes import db
from sqlalchemy import select, text

class FuncionariosRepository:

    @staticmethod
    def query_listar_equipe_tecnica():
        stmt = (
            select(Funcionarios.id, Funcionarios.nome, Funcoes.nome)
            .join(FuncionarioFuncoes, Funcionarios.id == FuncionarioFuncoes.funcionario_id)
            .join(Funcoes, FuncionarioFuncoes.funcao_id == Funcoes.id)
            .filter(Funcoes.id.in_([2,3]))
        )

        resultado = db.session.execute(stmt).all()

        return resultado
    
    @staticmethod
    def query_buscar_funcionario_id(id: int):
        query = text(
            """
                select funcionarios.nome, funcoes.nome, telefone_funcionario.telefone from funcionarios
                inner join funcionario_funcoes on
                funcionarios.id = funcionario_funcoes.funcionario_id
                inner join funcoes on 
                funcionario_funcoes.funcao_id = funcoes.id
                inner join telefone_funcionario on 
                funcionarios.id = telefone_funcionario.funcionario_id
                where funcionarios.id = :id and data_fim is null;
            """
        )

        funcionario = db.session.execute(query, {"id": id}).mappings()

        return funcionario.first()
    
    @staticmethod
    def query_listar_responsavel_os():

        query = text(
            """
                select ordens_servico.id as ordem_servico_id, funcionarios.nome, funcoes.nome as funcao, telefone_funcionario.telefone from funcionarios
                inner join funcionario_funcoes on
                funcionarios.id = funcionario_funcoes.funcionario_id
                inner join funcoes on 
                funcionario_funcoes.funcao_id = funcoes.id
                inner join telefone_funcionario on 
                funcionarios.id = telefone_funcionario.funcionario_id
                inner join ordens_servico on
                funcionarios.id = ordens_servico.responsavel_tecnico_id;
            """
        )

        responsaveis = db.session.execute(query).mappings()

        return responsaveis.all()
    
    @staticmethod
    def query_listar_responsavel_os_id(os_id: int):

        query = text(
            """
                select ordens_servico.id as ordem_servico_id, funcionarios.nome, funcoes.nome as funcao, telefone_funcionario.telefone from funcionarios
                inner join funcionario_funcoes on
                funcionarios.id = funcionario_funcoes.funcionario_id
                inner join funcoes on 
                funcionario_funcoes.funcao_id = funcoes.id
                inner join telefone_funcionario on 
                funcionarios.id = telefone_funcionario.funcionario_id
                inner join ordens_servico on
                funcionarios.id = ordens_servico.responsavel_tecnico_id
                where ordens_servico.id = :os_id;
            """
        )

        responsaveis = db.session.execute(query, {"os_id": os_id}).mappings()

        return responsaveis.all()