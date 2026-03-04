from extensions.extensoes import db

class Cidade(db.Model):
    __tablename__ = 'cidades'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(150), nullable=False)
    estado = db.Column(db.String(2), nullable=False)
    codigo_ibge = db.Column(db.String(10), unique=True)

    relatorios = db.relationship('RelatoriosTecnicos', back_populates='cidade')