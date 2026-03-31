from .clientes_querys import ClientesRepository
from .obras_querys import ObrasRepository
from .carros_querys import CarrosRepository
from .ordem_servico_query import OrdemServicoRepository
from .os_equipe_query import OrdemServicoEquipeRepository
from .funcionarios_querys import FuncionariosRepository
from .sequencias_query import SequenciasRepository
from .historico_os_querys import HistoricoOSRepository



class Repositories:
    clientes = ClientesRepository
    obras = ObrasRepository
    carros = CarrosRepository
    os = OrdemServicoRepository
    equipe = OrdemServicoEquipeRepository
    funcionarios = FuncionariosRepository
    sequencias = SequenciasRepository
    historico = HistoricoOSRepository