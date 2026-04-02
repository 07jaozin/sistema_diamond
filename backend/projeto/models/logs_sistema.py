from extensions.extensoes import db
from sqlalchemy.sql import func
from zoneinfo import ZoneInfo
from datetime import timezone

class LogsSistema(db.Model):
    __tablename__ = 'logs_sistema'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'))
    acao = db.Column(db.String(255))
    entidade = db.Column(db.String(100))
    entidade_id = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)

    # Relationships
    usuario = db.relationship('Usuarios', back_populates='logs')

    def to_dict(self):
        created_at = self.created_at
        if created_at:
            if created_at.tzinfo is None:
                created_at = created_at.replace(tzinfo=timezone.utc)
            created_at = created_at.astimezone(ZoneInfo("America/Sao_Paulo"))
        return {
            "id": self.id,
            "usuario_id": self.usuario_id,
            "acao": self.acao,
            "entidade": self.entidade,
            "entidade_id": self.entidade_id,
            "created_at": created_at.isoformat() if created_at else None
        }
