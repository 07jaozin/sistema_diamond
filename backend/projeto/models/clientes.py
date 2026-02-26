from extensions.extensoes import db
from sqlalchemy.sql import func

class Clientes(db.Model):

    __tablename__ = 'clientes'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(50))
    vendedor_id = db.Column(db.Integer, db.ForeignKey('funcionarios.id'), nullable=True)
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=func.now()
    )

    # Relationships
    vendedor = db.relationship('Funcionarios', foreign_keys=[vendedor_id])
    vendas = db.relationship('Vendas', back_populates='cliente', cascade='all, delete-orphan')
    contatos = db.relationship('ContatosCliente', back_populates='cliente', cascade='all, delete-orphan')
    obras = db.relationship('Obras', back_populates='cliente', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "status": self.status,
            "vendedor_id": self.vendedor_id,
            "created_at": self.created_at
        }
