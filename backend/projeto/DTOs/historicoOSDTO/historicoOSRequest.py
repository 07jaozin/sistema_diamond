class HistoricoOSRequest:

    def __init__(self, data: dict, funcionario_id):
        self.os_id = data.get("os_id")
        self.funcionario_id = funcionario_id
        self.evento = data.get("evento")
        self.descricao = data.get("observacao")

        self.validar()

    def validar(self):

        if not isinstance(self.os_id, int):
            raise ValueError("O ID da OS não foi enviado corretamente!")

        if not isinstance(self.funcionario_id, int):
            raise ValueError("O ID do funcionário não foi enviado corretamente!")

        if not isinstance(self.evento, str) or not self.evento.strip():
            raise ValueError("O evento não foi enviado corretamente!")

        if not isinstance(self.descricao, str) or not self.descricao.strip():
            raise ValueError("A observação não foi enviado corretamente!")
        
    def to_dict(self):

        return{
            "ordem_servico_id": self.os_id,
            "funcionario_id": self.funcionario_id,
            "evento": self.evento,
            "descricao": self.descricao,
        }
        