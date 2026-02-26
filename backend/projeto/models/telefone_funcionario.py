from extensions.extensoes import db
from sqlalchemy.sql import func

class TelefoneFuncionario(db.Model):

    __tablename__ = 'telefone_funcionario'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    funcionario_id = db.Column(db.Integer, db.ForeignKey('funcionarios.id'), nullable=False)
    telefone = db.Column(db.String(20), nullable=False)
    tipo = db.Column(db.String(50))
    principal = db.Column(db.Boolean, default=False)
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=func.now()
    )

    # Relationships
    funcionario = db.relationship('Funcionarios', back_populates='telefones')

    def to_dict(self):
        return {
            "id": self.id,
            "funcionario_id": self.funcionario_id,
            "telefone": self.telefone,
            "tipo": self.tipo,
            "principal": self.principal,
            "created_at": self.created_at
        }
