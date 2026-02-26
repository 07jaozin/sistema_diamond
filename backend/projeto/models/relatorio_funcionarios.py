from extensions.extensoes import db
from sqlalchemy.sql import func

class RelatorioFuncionarios(db.Model):

    __tablename__ = 'relatorio_funcionarios'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    relatorio_id = db.Column(db.Integer, db.ForeignKey('relatorios_tecnicos.id'), nullable=False)
    funcionario_id = db.Column(db.Integer, db.ForeignKey('funcionarios.id'), nullable=False)
    funcao_no_servico = db.Column(db.String(100))

    # Relationships
    relatorio = db.relationship('RelatoriosTecnicos', back_populates='relatorio_funcionarios')
    funcionario = db.relationship('Funcionarios')

    def to_dict(self):
        return {
            "id": self.id,
            "relatorio_id": self.relatorio_id,
            "funcionario_id": self.funcionario_id,
            "funcao_no_servico": self.funcao_no_servico
        }
