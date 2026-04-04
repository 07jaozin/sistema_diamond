from extensions.extensoes import db
from sqlalchemy.sql import func

class Funcionarios(db.Model):

    __tablename__ = 'funcionarios'

    id = db.Column(db.Integer, primary_key = True, autoincrement = True)
    nome = db.Column(db.String(150), nullable = False)
    email = db.Column(db.String(150))
    data_nascimento = db.Column(db.Date)
    ativo = db.Column(db.Boolean, default = True)
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=func.now()
    )

    # Relationships
    enderecos = db.relationship('FuncionarioEnderecos', back_populates='funcionario', cascade='all, delete-orphan')
    telefones = db.relationship('TelefoneFuncionario', back_populates='funcionario', cascade='all, delete-orphan')
    funcoes = db.relationship('FuncionarioFuncoes', back_populates='funcionario', cascade='all, delete-orphan')
    usuarios = db.relationship("Usuarios", back_populates="funcionario")

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "ativo": self.ativo,
            "created_at": self.created_at
        }