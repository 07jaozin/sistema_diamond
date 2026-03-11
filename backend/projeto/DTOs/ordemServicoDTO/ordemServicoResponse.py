class OSResponseDTO:

    @staticmethod
    def montar(ordens, equipes, equipamentos):

        equipe_por_os = {}
        equipamentos_por_os = {}

        for e in equipes:
            equipe_por_os.setdefault(e["ordem_servico_id"], []).append(e)

        for eq in equipamentos:
            equipamentos_por_os.setdefault(eq["ordem_servico_id"], []).append(eq)

        resultado = []

        for os in ordens:

            dto = {
                "id": os["id"],
                "numero_os": os["numero_os"],
                "cliente_id": os["cliente_id"],
                "cliente_nome": os["cliente_nome"],
                "obra_id": os["obra_id"],
                "carro_modelo": os["carro_modelo"],
                "carro_cor": os["carro_cor"],
                "data_execucao": os["data_execucao"],
                "descricao_servico": os["descricao_servico"],
                "observacoes_importantes": os["observacoes_importantes"],
                "equipamentos": equipamentos_por_os.get(os["id"], []),
                "equipe": equipe_por_os.get(os["id"], []),
                "cidade": os["cidade"],
                "endereco": os["endereco"],
                "status": os["status"],
                
            }

            resultado.append(dto)

        return resultado