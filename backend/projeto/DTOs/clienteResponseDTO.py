from models.clientes import Clientes

class ClienteResponseDTO:

    def __init__(self, data: Clientes):
        self.id = data.id 
        self.nome = data.nome 

    def build(self):
        return {
            "id": self.id,
            "nome": self.nome
        }