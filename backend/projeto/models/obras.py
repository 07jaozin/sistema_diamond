from extensions.extensoes import db
from sqlalchemy.sql import func

class Obras(db.Model):

    __tablename__ = 'obras'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    venda_id = db.Column(db.Integer, db.ForeignKey('vendas.id'), nullable=True)
    status = db.Column(db.String(50))
    descricao = db.Column(db.Text)
    data_inicio = db.Column(db.Date)
    data_previsao = db.Column(db.Date)
    data_conclusao = db.Column(db.Date)
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=func.now()
    )

    # Relationships
    cliente = db.relationship('Clientes', back_populates='obras')
    venda = db.relationship('Vendas', back_populates='obras')
    enderecos = db.relationship('Enderecos', back_populates='obra', cascade='all, delete-orphan')
    ordens_servico = db.relationship('OrdensServico', back_populates='obra', cascade='all, delete-orphan')
    relatorios_tecnicos = db.relationship('RelatoriosTecnicos', back_populates='obra', cascade='all, delete-orphan')
    documentos = db.relationship('Documentos', back_populates='obra', cascade='all, delete-orphan')
    obra_parceiros = db.relationship('ObraParceiros', back_populates='obra', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            "id": self.id,
            "cliente_id": self.cliente_id,
            "venda_id": self.venda_id,
            "status": self.status,
            "descricao": self.descricao,
            "data_inicio": self.data_inicio,
            "data_previsao": self.data_previsao,
            "data_conclusao": self.data_conclusao,
            "created_at": self.created_at
        }
