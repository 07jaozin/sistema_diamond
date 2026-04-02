from extensions.extensoes import db
from sqlalchemy.sql import func

class Usuarios(db.Model):
    __tablename__ = 'usuarios'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    funcionario_id = db.Column(db.Integer, db.ForeignKey('funcionarios.id'), nullable=False)
    email = db.Column(db.String(150), nullable=False, unique=True)
    senha_hash = db.Column(db.String(255), nullable=False)
    ativo = db.Column(db.Boolean, default=True)
    ultimo_login = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, nullable=False, server_default=func.now())

    # Relationships
    funcionario = db.relationship('Funcionarios', back_populates='usuarios')
    logs = db.relationship('LogsSistema', back_populates='usuario', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            "id": self.id,
            "funcionario_id": self.funcionario_id,
            "email": self.email,
            "ativo": self.ativo,
            "ultimo_login": self.ultimo_login,
            "created_at": self.created_at
        }
