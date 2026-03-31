from datetime import date

class OrdemServicoDTO:
    CAMPOS_OBRIGATORIOS = [
        "client_id",
        "work_id",
        "descricao_servico",
        "status",
        "equipe",
        "data_execucao",
        "carro_id"
    ]
    
    def __init__(self, form_data: dict):
        self.form_data = form_data
        self.validar()

    def validar(self):
        if not self.form_data:
            raise ValueError("Formulario inexistente!")
        
        print(self.form_data)
        
        for campo in self.CAMPOS_OBRIGATORIOS:
            if campo not in self.form_data:
                raise ValueError(f"Campo obrigatório ausente: {campo}")
            
            valor = self.form_data.get(campo)

            if not valor or ((isinstance(valor, str)) and valor.strip() == ""):
                raise ValueError(f"Campo obrigatório vazio: {campo}")
        
        
       
    def build(self):
        print(self.form_data.get("observacoes_importantes"))
        return {
            "cliente_id": int(self.form_data.get("client_id")) if self.form_data.get("client_id") else None,
            "obra_id": int(self.form_data.get("work_id")) if self.form_data.get("work_id") else None,
            "carro_id": int(self.form_data.get("carro_id")) if self.form_data.get("carro_id") else None,
            "data_emissao": date.today(),
            "data_execucao": self.form_data.get("data_execucao"),
            "descricao_servico": self.form_data.get("descricao_servico").strip().capitalize(),
            "observacoes_importantes": self.form_data.get("observacoes_importantes").strip().capitalize() if self.form_data.get("observacoes_importantes") else "Nenhuma",
            "equipamentos": self.form_data.get("equipamentos", []),
            "equipe": self.form_data.get("equipe", []),
            "status": self.form_data.get("status").strip().capitalize(),
            "tipo_servico": self.form_data.get("etapa"),
            "responsavel_tecnico_id": 21 # Mudar depois 
        }
