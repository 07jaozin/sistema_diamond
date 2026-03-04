from repositories.ordem_servico_query import OrdemServicoRepository as OSQuery
from repositories.obras_querys import ObrasRepository as ObraQuery

class RelatoriosDTOs:
    CAMPOS_OBRIGATORIOS = [
        "id_obra",
        "numero_os",
        "data_execucao",
        "cidade_id",
        "servico_executado",
        "status",
        "precisa_retornar",
        "data_hoje",
    ]
    def __init__(self, form_data: dict):
        self.form_data = form_data
        self.validar()

    def validar(self):
        if not self.form_data:
            raise ValueError("Formulario inexistente!")
        
        for campo in self.CAMPOS_OBRIGATORIOS:
            if campo not in self.form_data:
                raise ValueError(f"Campo obrigatório ausente: {campo}")
            
            valor = self.form_data.get(campo)

            if not valor or ((isinstance(valor, str)) and valor.strip() == ""):
                raise ValueError(f"Campo obrigatório vazio: {campo}")
        
        if not ObraQuery.buscar_obrar_id(self.form_data.get("obra_id")):
            raise ValueError("O ID da obra esta incorreto, verifique-o na ordem de serviço!")
        
        if not OSQuery.buscar_OS_id(self.form_data.get("numero_os")):
            raise ValueError("O ID da OS esta incorreto, verifique-o na ordem de serviço!")
        
        
    def build(self):
        return {
            "cliente": self.form_data.get("cliente"),
            "equipe": self.form_data.get("equipe", []),
            "data_execucao": self.form_data.get("data_execucao"),
            "cidade": self.form_data.get("cidade"),
            "servico_executado": self.form_data.get("servico_executado"),
            "pendencias": self.form_data.get("pendencias"),
            "status": self.form_data.get("status"),
            "precisa_retornar": self.form_data.get("precisa_retornar"),
            "data_hoje": self.form_data.get("data_hoje")
        }