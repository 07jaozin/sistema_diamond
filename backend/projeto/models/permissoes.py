from extensions.extensoes import db
from sqlalchemy.sql import func

class Permissoes(db.Model):
    __tablename__ = 'permissoes'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(100), nullable=False, unique=True)
    descricao = db.Column(db.Text)

    # Relationships
    funcao_permissoes = db.relationship('FuncaoPermissoes', back_populates='permissao')

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "descricao": self.descricao
        }
