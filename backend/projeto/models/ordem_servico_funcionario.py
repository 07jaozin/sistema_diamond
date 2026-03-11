from extensions.extensoes import db

class OrdemServicoFuncionario(db.Model):
    __tablename__ = "ordem_servico_funcionarios"

    id = db.Column(db.Integer, primary_key=True)

    ordem_servico_id = db.Column(
        db.Integer,
        db.ForeignKey("ordens_servico.id"),
        nullable=False
    )

    funcionario_id = db.Column(
        db.Integer,
        db.ForeignKey("funcionarios.id"),
        nullable=False
    )