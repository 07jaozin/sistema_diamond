from services.relatorio_services import RelatorioServices 

class RelatoriosController:

    @staticmethod
    def armazenar_relatorios(form_dict, anexos):
        form_data_normalizado = RelatorioServices.normalize_form_data(form_dict)

    @staticmethod
    def listar_relatorios_controller():
        try:
            relatorios_tecnicos = RelatorioServices.listar_relatorios_service()

            return {
                "success": True,
                "data": relatorios_tecnicos
            }
        
        except Exception as e:
            raise ValueError("Erro ao listar os relatorios tecnicos: ", str(e))
        
    