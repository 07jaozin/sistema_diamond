from extensions.extensoes import db
from sqlalchemy.sql import func

class FuncaoPermissoes(db.Model):
    __tablename__ = 'funcao_permissoes'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    funcao_id = db.Column(db.Integer, db.ForeignKey('funcoes.id'), nullable=False)
    permissao_id = db.Column(db.Integer, db.ForeignKey('permissoes.id'), nullable=False)

    __table_args__ = (db.UniqueConstraint('funcao_id', 'permissao_id'),)

    # Relationships
    funcao = db.relationship('Funcoes', back_populates='funcao_permissoes')
    permissao = db.relationship('Permissoes', back_populates='funcao_permissoes')

    def to_dict(self):
        return {
            "id": self.id,
            "funcao_id": self.funcao_id,
            "permissao_id": self.permissao_id
        }
