class TelefonesEquipeOSResponseDTO:

    @staticmethod
    def montar(os_id: int, telefones: list):

        lista = []

        for t in telefones:
            if t.get("telefone"):
                lista.append({
                    "nome": t.get("nome"),
                    "telefone": t.get("telefone"),
                    "ordem_servico_id": t.get("ordem_servico_id")
                })

        return {
            "ordem_servico_id": os_id,
            "total": len(lista),
            "telefones": lista
        }