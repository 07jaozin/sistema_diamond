from models.funcionarios import Funcionarios
from models.funcoes import Funcoes
from models.funcionario_funcoes import FuncionarioFuncoes
from extensions.extensoes import db
from sqlalchemy import select

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
    