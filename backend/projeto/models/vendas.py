from extensions.extensoes import db
from sqlalchemy.sql import func

class Vendas(db.Model):

    __tablename__ = 'vendas'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    vendedor_id = db.Column(db.Integer, db.ForeignKey('funcionarios.id'), nullable=False)
    responsavel_pos_venda_id = db.Column(db.Integer, db.ForeignKey('funcionarios.id'), nullable=True)
    data_fechamento = db.Column(db.Date)
    valor_fechado = db.Column(db.Numeric(12, 2))
    descricao_venda = db.Column(db.Text)
    status = db.Column(db.String(50), default='fechado')
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=func.now()
    )

    # Relationships
    cliente = db.relationship('Clientes', back_populates='vendas')
    vendedor = db.relationship('Funcionarios', foreign_keys=[vendedor_id])
    responsavel_pos_venda = db.relationship('Funcionarios', foreign_keys=[responsavel_pos_venda_id])
    obras = db.relationship('Obras', back_populates='venda', cascade='all, delete-orphan')
    documentos = db.relationship('Documentos', back_populates='venda', cascade='all, delete-orphan')
    venda_parceiros = db.relationship('VendaParceiros', back_populates='venda', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            "id": self.id,
            "cliente_id": self.cliente_id,
            "vendedor_id": self.vendedor_id,
            "responsavel_pos_venda_id": self.responsavel_pos_venda_id,
            "data_fechamento": self.data_fechamento,
            "valor_fechado": float(self.valor_fechado) if self.valor_fechado else None,
            "descricao_venda": self.descricao_venda,
            "status": self.status,
            "created_at": self.created_at
        }
