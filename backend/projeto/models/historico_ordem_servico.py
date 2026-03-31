from extensions.extensoes import db
from sqlalchemy.sql import func
from zoneinfo import ZoneInfo
from datetime import timezone

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

    def to_dict(self):
        created_at = self.created_at

        if created_at:
            if created_at.tzinfo is None:
                created_at = created_at.replace(tzinfo=timezone.utc)

            created_at = created_at.astimezone(ZoneInfo("America/Sao_Paulo"))

        
        return {
            "id": self.id,
            "ordem_servico_id": self.ordem_servico_id,
            "funcionario_id": self.funcionario_id,
            "evento": self.evento,
            "descricao": self.descricao,
            "created_at": created_at if created_at else None,
            "funcionario_nome": self.funcionario.nome if self.funcionario else None
        }