class EquipeTecnicaResponse:

    def __init__(self, data):
        self.data = data
        
    def build(self):

        equipe = []

        for funcionarios_id, funcionarios_nome, funcao_nome in self.data:
            equipe.append({
                "id":funcionarios_id,
                "nome": funcionarios_nome,
                "funcao": funcao_nome
            })
        
        return equipe