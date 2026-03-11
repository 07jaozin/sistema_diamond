from extensions.extensoes import db
from sqlalchemy.sql import func


class AuditoriaOrdemServico(db.Model):

    __tablename__ = "auditoria_ordens_servico"

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

    campo = db.Column(db.String(100))
    valor_antigo = db.Column(db.Text)
    valor_novo = db.Column(db.Text)

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=func.now()
    )

    # relationships
    ordem_servico = db.relationship(
        "OrdensServico",
        back_populates="auditorias"
    )

    funcionario = db.relationship(
        "Funcionarios"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "ordem_servico_id": self.ordem_servico_id,
            "funcionario_id": self.funcionario_id,
            "campo": self.campo,
            "valor_antigo": self.valor_antigo,
            "valor_novo": self.valor_novo,
            "created_at": self.created_at
        }