from extensions.extensoes import db
from sqlalchemy.sql import func

class ParceiroContatos(db.Model):

    __tablename__ = 'parceiro_contatos'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    parceiro_id = db.Column(db.Integer, db.ForeignKey('parceiros.id'), nullable=False)
    nome = db.Column(db.String(150), nullable=False)
    cargo = db.Column(db.String(100))
    telefone = db.Column(db.String(20))
    email = db.Column(db.String(150))
    principal = db.Column(db.Boolean, default=False)

    # Relationships
    parceiro = db.relationship('Parceiros', back_populates='contatos')

    def to_dict(self):
        return {
            "id": self.id,
            "parceiro_id": self.parceiro_id,
            "nome": self.nome,
            "cargo": self.cargo,
            "telefone": self.telefone,
            "email": self.email,
            "principal": self.principal
        }
