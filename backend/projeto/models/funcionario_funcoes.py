from extensions.extensoes import db
from sqlalchemy.sql import func

class FuncionarioFuncoes(db.Model):

    __tablename__ = 'funcionario_funcoes'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    funcionario_id = db.Column(db.Integer, db.ForeignKey('funcionarios.id'), nullable=False)
    funcao_id = db.Column(db.Integer, db.ForeignKey('funcoes.id'), nullable=False)
    data_inicio = db.Column(db.Date, nullable=False)
    data_fim = db.Column(db.Date, nullable=True)
    observacao = db.Column(db.Text)

    # Relationships
    funcionario = db.relationship('Funcionarios', back_populates='funcoes')
    funcao = db.relationship('Funcoes', back_populates='funcionarios')

    def to_dict(self):
        return {
            "id": self.id,
            "funcionario_id": self.funcionario_id,
            "funcao_id": self.funcao_id,
            "data_inicio": self.data_inicio,
            "data_fim": self.data_fim,
            "observacao": self.observacao
        }
