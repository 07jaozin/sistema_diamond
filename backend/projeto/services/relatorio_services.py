from models.relatorios_tecnicos import RelatoriosTecnicos as RT
from models.relatorio_funcionarios import RelatorioFuncionarios 
from models.ordens_servico import OrdensServico
from models.obras import Obras
from repositories.obras_querys import ObrasRepository as ObraQuery
from repositories.relatorio_tecnico_query import RelatorioTecnicoRepository as RTQuery
from repositories.ordem_servico_query import OrdemServicoRepository as OSQuery
from repositories.funcionarios.relatorio_funcionario_query import RelatorioFuncionariosQuery as RTFuncionarioQuery

class RelatorioServices:

    @staticmethod
    def listar_relatorios_service():
        relatorios_tecnicos = RTQuery.query_listar_relatorios()

        relatorios = [r.to_dict() for r in relatorios_tecnicos]

        return relatorios

    @staticmethod
    def adicionar_relatorio_service(relatorio_dict: dict, anexos):
        try:
            relatorio = RT(**relatorio_dict)

            RTQuery.criar_relatorio(relatorio)

            for funcionario_id in relatorio_dict['equipe']:
                funcionario_rt = RelatorioFuncionarios(
                    relatorio_id = relatorio.id,
                    funcionario_id = funcionario_id
                )
                RTFuncionarioQuery.criar_RTFuncionario(funcionario_rt)
            
            return relatorio

        except:
            pass

    @staticmethod
    def normalize_form_data(form):
        normalized = {}

        for key in form.keys():
            values = form.getlist(key)

            if len(values) == 1:
                normalized[key] = values[0]
            else:
                normalized[key] = values

        return normalized
            

