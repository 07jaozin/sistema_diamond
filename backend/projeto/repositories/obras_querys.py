from models.obras import Obras
class ObrasRepository:

    @staticmethod
    def query_buscar_obras_id(id: int):
        obra = Obras.query.get(id)

        return obra

    @staticmethod
    def query_listar_obras():
        obras = Obras.query.all()

        return obras
    
    