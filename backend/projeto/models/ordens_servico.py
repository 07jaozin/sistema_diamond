from extensions.extensoes import db
from sqlalchemy.sql import func

class OrdensServico(db.Model):

    __tablename__ = 'ordens_servico'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    numero_os = db.Column(db.String(50), nullable=False, unique=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    obra_id = db.Column(db.Integer, db.ForeignKey('obras.id'), nullable=False)
    carro_id = db.Column(db.Integer, db.ForeignKey('carros.id'), nullable=True)
    data_emissao = db.Column(db.Date, nullable=False)
    data_execucao = db.Column(db.Date)
    tipo_servico = db.Column(db.String(100))
    descricao_servico = db.Column(db.Text)
    status = db.Column(db.String(50), default='aberta')
    prioridade = db.Column(db.String(50), default='normal')
    observacoes_importantes = db.Column(db.Text)
    informacoes_adicionais = db.Column(db.Text)
    responsavel_tecnico_id = db.Column(db.Integer, db.ForeignKey('funcionarios.id'), nullable=True)
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=func.now()
    )

    # Relationships
    cliente = db.relationship('Clientes', foreign_keys=[cliente_id])
    obra = db.relationship('Obras', back_populates='ordens_servico')
    responsavel_tecnico = db.relationship('Funcionarios', foreign_keys=[responsavel_tecnico_id])
    relatorios_tecnicos = db.relationship('RelatoriosTecnicos', back_populates='ordem_servico', cascade='all, delete-orphan')
    documentos = db.relationship('Documentos', back_populates='ordem_servico', cascade='all, delete-orphan')
    itens = db.relationship('OrdemServicoItens', back_populates='ordem_servico', cascade='all, delete-orphan')
    carro = db.relationship('Carro', foreign_keys=[carro_id], back_populates='ordens_servico')
    equipe = db.relationship("Funcionarios", secondary="ordem_servico_funcionarios", backref="ordens_servico")
    historico = db.relationship("HistoricoOrdemServico", back_populates="ordem_servico", cascade="all, delete-orphan", order_by="HistoricoOrdemServico.created_at")
    auditorias = db.relationship("AuditoriaOrdemServico", back_populates="ordem_servico", cascade="all, delete-orphan", order_by="AuditoriaOrdemServico.created_at")
    def to_dict(self):
        return {
            "id": self.id,
            "numero_os": self.numero_os,
            "cliente_id": self.cliente_id,
            "obra_id": self.obra_id,
            "data_emissao": self.data_emissao,
            "data_execucao": self.data_execucao,
            "tipo_servico": self.tipo_servico,
            "descricao_servico": self.descricao_servico,
            "status": self.status,
            "prioridade": self.prioridade,
            "observacoes_importantes": self.observacoes_importantes,
            "informacoes_adicionais": self.informacoes_adicionais,
            "responsavel_tecnico_id": self.responsavel_tecnico_id,
            "created_at": self.created_at
        }
