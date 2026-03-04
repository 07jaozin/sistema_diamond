from extensions.extensoes import db
from datetime import datetime

class TipoCarro(db.Model):
    __tablename__ = "tipos_carro"

    id = db.Column(db.Integer, primary_key=True)
    descricao = db.Column(db.String(50), nullable=False, unique=True)

    carros = db.relationship("Carro", back_populates="tipo")


class Carro(db.Model):
    __tablename__ = "carros"

    id = db.Column(db.Integer, primary_key=True)
    modelo = db.Column(db.String(150), nullable=False)
    cor = db.Column(db.String(150), nullable=False)
    placa = db.Column(db.String(10), nullable=False, unique=True)
    ativo = db.Column(db.Boolean, nullable=False, default=True)

    tipo_id = db.Column(db.Integer, db.ForeignKey("tipos_carro.id"), nullable=False)
    tipo = db.relationship("TipoCarro", back_populates="carros")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    ordens_servico = db.relationship(
        'OrdensServico',
        back_populates='carro',
        cascade='all, delete-orphan'
    )
    def __repr__(self):
        return f"<Carro {self.modelo} - {self.placa}>"