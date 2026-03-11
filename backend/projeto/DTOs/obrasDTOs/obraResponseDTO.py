from models.obras import Obras

class ObraResponseDTO:

    def __init__(self, data: Obras):
        self.id = data.id
        self.cliente_id = data.cliente_id
        self.status = data.status
        self.descricao = data.descricao
        self.data_inicio = data.data_inicio

    def build(self):
        return{
            "id": self.id,
            "cliente_id": self.cliente_id,
            "status": self.status,
            "descricao": self.descricao,
            "data_inicio": self.data_inicio
        }
    