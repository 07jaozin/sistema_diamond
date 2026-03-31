from decimal import Decimal

class OSResponseDTO:

    @staticmethod
    def montar(ordens, equipes, equipamentos, responsavel_tecnico, historico):

        equipe_por_os = {}
        equipamentos_por_os = {}
        historico_por_os = {}
        responsavel_tecnico_por_os = {}

        for e in equipes:
            equipe_por_os.setdefault(e["ordem_servico_id"], []).append(e)

        for eq in equipamentos:
            eq_dict = dict(eq)

            if isinstance(eq_dict.get("quantidade"), Decimal):
                eq_dict["quantidade"] = float(eq_dict["quantidade"])

            equipamentos_por_os.setdefault(eq_dict["ordem_servico_id"], []).append(eq_dict)

        for h in historico:
            historico_por_os.setdefault(h["ordem_servico_id"], []).append(h)

       
        for r in responsavel_tecnico:
            responsavel_tecnico_por_os.setdefault(r["ordem_servico_id"], []).append(r)

        resultado = []

        for os in ordens:

            dto = {
                "id": os["id"],
                "numero_os": os["numero_os"],
                "cliente_id": os["cliente_id"],
                "cliente_nome": os["cliente_nome"],
                "cliente_telefone": os["cliente_telefone"],
                "obra_id": os["obra_id"],
                "carro_id": os["carro_id"],
                "carro_modelo": os["carro_modelo"],
                "carro_cor": os["carro_cor"],
                "data_execucao": os["data_execucao"].isoformat() if os["data_execucao"] else None,
                "etapa": os["tipo_servico"].split('-')[0].strip(),
                "descricao_servico": os["descricao_servico"],
                "observacoes_importantes": os["observacoes_importantes"],
                "equipamentos": equipamentos_por_os.get(os["id"], []),
                "equipe": equipe_por_os.get(os["id"], []),
                "cidade": os["cidade"],
                "endereco": os["endereco"],
                "estado": os["estado"],
                "condominio": os["condominio"],
                "quadra": os["quadra"] if os["quadra"] is None else '',
                "lote": os["lote"] if os["lote"] is None else '',
                "observacoes": os["observacoes"] if os["observacoes"] is None else '',
                "status": os["status"],
                "responsavel_tecnica": responsavel_tecnico_por_os.get(os["id"], []),
                "historico": historico_por_os.get(os["id"], []),
            }

            

            resultado.append(dto)

        
        print('Quantidade de OS: ', len(resultado))
        return resultado