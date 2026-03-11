from extensions.extensoes import db
from sqlalchemy.sql import func


class HistoricoOrdemServico(db.Model):

    __tablename__ = "historico_ordens_servico"

    id = db.Column(db.Integer, primary_key=True)

    ordem_servico_id = db.Column(
        db.Integer,
        db.ForeignKey("ordens_servico.id", ondelete="CASCADE"),
        nullable=False
    )

    funcionario_id = db.Column(
        db.Integer,
        db.ForeignKey("funcionarios.id"),
        nullable=True
    )

    evento = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text)

    created_at = db.Column(
        db.DateTime,
        server_default=func.now(),
        nullable=False
    )

    # relationships
    ordem_servico = db.relationship(
        "OrdensServico",
        back_populates="historico"
    )

    funcionario = db.relationship(
        "Funcionarios"
    )