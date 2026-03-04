from extensions.extensoes import db
from models.carros import TipoCarro, Carro

class CarrosRepository:

    @staticmethod
    def listar_carros():
        carros = (
            db.session.query(
                Carro.id,
                Carro.modelo,
                Carro.cor,
                TipoCarro.descricao
            )
            .join(TipoCarro)
            .all()  
        )

        return carros