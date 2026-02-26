from extensions.extensoes import db
from sqlalchemy.sql import func

class Enderecos(db.Model):

    __tablename__ = 'enderecos'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    obra_id = db.Column(db.Integer, db.ForeignKey('obras.id'), nullable=False)
    endereco = db.Column(db.String(255))
    condominio = db.Column(db.String(150))
    cidade = db.Column(db.String(150))
    estado = db.Column(db.String(100))
    cep = db.Column(db.String(20))

    # Relationships
    obra = db.relationship('Obras', back_populates='enderecos')

    def to_dict(self):
        return {
            "id": self.id,
            "obra_id": self.obra_id,
            "endereco": self.endereco,
            "condominio": self.condominio,
            "cidade": self.cidade,
            "estado": self.estado,
            "cep": self.cep
        }
