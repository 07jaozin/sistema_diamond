from extensions.extensoes import db
from sqlalchemy.sql import func

class FuncionarioEnderecos(db.Model):

    __tablename__ = 'funcionario_enderecos'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    funcionario_id = db.Column(db.Integer, db.ForeignKey('funcionarios.id'), nullable=False)
    tipo = db.Column(db.String(50), default='residencial')
    cep = db.Column(db.String(15))
    rua = db.Column(db.String(150), nullable=False)
    numero = db.Column(db.String(20))
    complemento = db.Column(db.String(100))
    bairro = db.Column(db.String(100))
    cidade = db.Column(db.String(100), nullable=False)
    estado = db.Column(db.String(50), nullable=False)
    pais = db.Column(db.String(50), default='Brasil')
    principal = db.Column(db.Boolean, default=True)
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=func.now()
    )

    # Relationships
    funcionario = db.relationship('Funcionarios', back_populates='enderecos')

    def to_dict(self):
        return {
            "id": self.id,
            "funcionario_id": self.funcionario_id,
            "tipo": self.tipo,
            "cep": self.cep,
            "rua": self.rua,
            "numero": self.numero,
            "complemento": self.complemento,
            "bairro": self.bairro,
            "cidade": self.cidade,
            "estado": self.estado,
            "pais": self.pais,
            "principal": self.principal,
            "created_at": self.created_at
        }
