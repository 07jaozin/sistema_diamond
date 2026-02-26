from extensions.extensoes import db
from sqlalchemy.sql import func

class RelatoriosTecnicos(db.Model):

    __tablename__ = 'relatorios_tecnicos'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    obra_id = db.Column(db.Integer, db.ForeignKey('obras.id'), nullable=False)
    ordem_servico_id = db.Column(db.Integer, db.ForeignKey('ordens_servico.id'), nullable=False)
    data_execucao = db.Column(db.Date, nullable=False)
    cidade = db.Column(db.String(150))
    descricao_servico = db.Column(db.Text)
    pendencias = db.Column(db.Text)
    avaliacao_ia = db.Column(db.Text)
    status_obra = db.Column(db.String(50))
    precisa_retorno = db.Column(db.Boolean, default=False)
    data_sugestao_retorno = db.Column(db.Date)
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=func.now()
    )

    # Relationships
    obra = db.relationship('Obras', back_populates='relatorios_tecnicos')
    ordem_servico = db.relationship('OrdensServico', back_populates='relatorios_tecnicos')
    documentos = db.relationship('Documentos', back_populates='relatorio', cascade='all, delete-orphan')
    relatorio_funcionarios = db.relationship('RelatorioFuncionarios', back_populates='relatorio', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            "id": self.id,
            "obra_id": self.obra_id,
            "ordem_servico_id": self.ordem_servico_id,
            "data_execucao": self.data_execucao,
            "cidade": self.cidade,
            "descricao_servico": self.descricao_servico,
            "pendencias": self.pendencias,
            "avaliacao_ia": self.avaliacao_ia,
            "status_obra": self.status_obra,
            "precisa_retorno": self.precisa_retorno,
            "data_sugestao_retorno": self.data_sugestao_retorno,
            "created_at": self.created_at
        }
