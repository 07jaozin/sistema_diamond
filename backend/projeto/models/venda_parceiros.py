from extensions.extensoes import db
from sqlalchemy.sql import func

class VendaParceiros(db.Model):

    __tablename__ = 'venda_parceiros'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    venda_id = db.Column(db.Integer, db.ForeignKey('vendas.id'), nullable=False)
    parceiro_id = db.Column(db.Integer, db.ForeignKey('parceiros.id'), nullable=False)
    papel = db.Column(db.String(100))
    comissao_percentual = db.Column(db.Numeric(5, 2))
    comissao_valor = db.Column(db.Numeric(12, 2))
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=func.now()
    )

    # Relationships
    venda = db.relationship('Vendas', back_populates='venda_parceiros')
    parceiro = db.relationship('Parceiros', back_populates='venda_parceiros')

    def to_dict(self):
        return {
            "id": self.id,
            "venda_id": self.venda_id,
            "parceiro_id": self.parceiro_id,
            "papel": self.papel,
            "comissao_percentual": float(self.comissao_percentual) if self.comissao_percentual else None,
            "comissao_valor": float(self.comissao_valor) if self.comissao_valor else None,
            "created_at": self.created_at
        }
