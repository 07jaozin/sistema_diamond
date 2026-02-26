from extensions.extensoes import db
from sqlalchemy.sql import func

class Funcoes(db.Model):

    __tablename__ = 'funcoes'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text)
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=func.now()
    )

    # Relationships
    funcionarios = db.relationship('FuncionarioFuncoes', back_populates='funcao', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "descricao": self.descricao,
            "created_at": self.created_at
        }
