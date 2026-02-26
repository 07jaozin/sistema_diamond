from extensions.extensoes import db
from sqlalchemy.sql import func

class ObraParceiros(db.Model):

    __tablename__ = 'obra_parceiros'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    obra_id = db.Column(db.Integer, db.ForeignKey('obras.id'), nullable=False)
    parceiro_id = db.Column(db.Integer, db.ForeignKey('parceiros.id'), nullable=False)
    papel = db.Column(db.String(100))
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=func.now()
    )

    # Relationships
    obra = db.relationship('Obras', back_populates='obra_parceiros')
    parceiro = db.relationship('Parceiros', back_populates='obra_parceiros')

    def to_dict(self):
        return {
            "id": self.id,
            "obra_id": self.obra_id,
            "parceiro_id": self.parceiro_id,
            "papel": self.papel,
            "created_at": self.created_at
        }
