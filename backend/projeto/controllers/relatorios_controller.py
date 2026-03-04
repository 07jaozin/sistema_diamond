from services.relatorio_services import RelatorioServices 

class RelatoriosController:

    @staticmethod
    def armazenar_relatorios(form_dict, anexos):
        form_data_normalizado = RelatorioServices.normalize_form_data(form_dict)
        
    