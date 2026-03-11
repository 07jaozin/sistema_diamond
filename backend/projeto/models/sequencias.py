from extensions.extensoes import db

class Sequencia(db.Model):
    __tablename__ = "sequencias"

    nome = db.Column(db.String(50), primary_key=True)
    valor = db.Column(db.Integer, nullable=False)