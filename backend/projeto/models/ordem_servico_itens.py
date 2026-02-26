from extensions.extensoes import db
from sqlalchemy.sql import func

class OrdemServicoItens(db.Model):

    __tablename__ = 'ordem_servico_itens'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ordem_servico_id = db.Column(db.Integer, db.ForeignKey('ordens_servico.id'), nullable=False)
    item_numero = db.Column(db.Integer, nullable=False)
    descricao = db.Column(db.String(255), nullable=False)
    quantidade = db.Column(db.Numeric(10, 2))
    unidade = db.Column(db.String(20))
    observacao = db.Column(db.Text)

    # Relationships
    ordem_servico = db.relationship('OrdensServico', back_populates='itens')

    def to_dict(self):
        return {
            "id": self.id,
            "ordem_servico_id": self.ordem_servico_id,
            "item_numero": self.item_numero,
            "descricao": self.descricao,
            "quantidade": float(self.quantidade) if self.quantidade else None,
            "unidade": self.unidade,
            "observacao": self.observacao
        }
