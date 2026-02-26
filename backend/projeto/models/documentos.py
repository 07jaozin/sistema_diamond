from extensions.extensoes import db
from sqlalchemy.sql import func

class Documentos(db.Model):

    __tablename__ = 'documentos'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    obra_id = db.Column(db.Integer, db.ForeignKey('obras.id'), nullable=True)
    venda_id = db.Column(db.Integer, db.ForeignKey('vendas.id'), nullable=True)
    ordem_servico_id = db.Column(db.Integer, db.ForeignKey('ordens_servico.id'), nullable=True)
    relatorio_id = db.Column(db.Integer, db.ForeignKey('relatorios_tecnicos.id'), nullable=True)
    tipo_documento = db.Column(db.String(100), nullable=False)
    nome_arquivo = db.Column(db.String(255), nullable=False)
    url_arquivo = db.Column(db.String(500), nullable=False)
    mime_type = db.Column(db.String(100))
    tamanho_bytes = db.Column(db.BigInteger)
    versao = db.Column(db.Integer, default=1)
    ativo = db.Column(db.Boolean, default=True)
    criado_por = db.Column(db.Integer, db.ForeignKey('funcionarios.id'), nullable=False)
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=func.now()
    )

    # Relationships
    obra = db.relationship('Obras', foreign_keys=[obra_id], back_populates='documentos')
    venda = db.relationship('Vendas', foreign_keys=[venda_id], back_populates='documentos')
    ordem_servico = db.relationship('OrdensServico', foreign_keys=[ordem_servico_id], back_populates='documentos')
    relatorio = db.relationship('RelatoriosTecnicos', foreign_keys=[relatorio_id], back_populates='documentos')
    criado_por_funcionario = db.relationship('Funcionarios')

    def to_dict(self):
        return {
            "id": self.id,
            "obra_id": self.obra_id,
            "venda_id": self.venda_id,
            "ordem_servico_id": self.ordem_servico_id,
            "relatorio_id": self.relatorio_id,
            "tipo_documento": self.tipo_documento,
            "nome_arquivo": self.nome_arquivo,
            "url_arquivo": self.url_arquivo,
            "mime_type": self.mime_type,
            "tamanho_bytes": self.tamanho_bytes,
            "versao": self.versao,
            "ativo": self.ativo,
            "criado_por": self.criado_por,
            "created_at": self.created_at
        }
