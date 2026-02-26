from extensions.extensoes import db
from sqlalchemy.sql import func

class ContatosCliente(db.Model):

    __tablename__ = 'contatos_cliente'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    nome = db.Column(db.String(150), nullable=False)
    tipo = db.Column(db.String(50))
    telefone = db.Column(db.String(20))
    email = db.Column(db.String(150))

    # Relationships
    cliente = db.relationship('Clientes', back_populates='contatos')

    def to_dict(self):
        return {
            "id": self.id,
            "cliente_id": self.cliente_id,
            "nome": self.nome,
            "tipo": self.tipo,
            "telefone": self.telefone,
            "email": self.email
        }
