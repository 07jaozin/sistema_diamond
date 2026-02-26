from extensions.extensoes import db
from sqlalchemy.sql import func

class Parceiros(db.Model):

    __tablename__ = 'parceiros'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tipo = db.Column(db.String(50), nullable=False)
    nome = db.Column(db.String(200), nullable=False)
    documento = db.Column(db.String(30))
    empresa = db.Column(db.String(200))
    cidade = db.Column(db.String(100))
    estado = db.Column(db.String(50))
    ativo = db.Column(db.Boolean, default=True)
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=func.now()
    )

    # Relationships
    contatos = db.relationship('ParceiroContatos', back_populates='parceiro', cascade='all, delete-orphan')
    venda_parceiros = db.relationship('VendaParceiros', back_populates='parceiro', cascade='all, delete-orphan')
    obra_parceiros = db.relationship('ObraParceiros', back_populates='parceiro', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            "id": self.id,
            "tipo": self.tipo,
            "nome": self.nome,
            "documento": self.documento,
            "empresa": self.empresa,
            "cidade": self.cidade,
            "estado": self.estado,
            "ativo": self.ativo,
            "created_at": self.created_at
        }
