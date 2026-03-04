from models.obras import Obras
class ObrasRepository:

    @staticmethod
    def buscar_obrar_id(id: int):
        obra = Obras.query.get(id)

        return obra