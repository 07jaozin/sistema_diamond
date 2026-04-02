from .clientes_querys import ClientesRepository
from .obras_querys import ObrasRepository
from .carros_querys import CarrosRepository
from .ordem_servico_query import OrdemServicoRepository
from .os_equipe_query import OrdemServicoEquipeRepository
from .funcionarios.funcionarios_querys import FuncionariosRepository
from .sequencias_query import SequenciasRepository
from .historico_os_querys import HistoricoOSRepository
from .funcionarios.usuarios_querys import UsuarioRepository
from funcionarios.funcionarios_funcoes import FuncionariosFuncoesRepository
from .funcionarios.tel_funcionario_query import TelFuncionariosRepository
from .funcionarios.funcionario_endereco_query import FuncionarioEnderecoRepository


class Repositories:
    
    clientes = ClientesRepository
    obras = ObrasRepository
    carros = CarrosRepository
    os = OrdemServicoRepository
    equipe = OrdemServicoEquipeRepository
    funcionarios = FuncionariosRepository
    funcionarios_funcoes = FuncionariosFuncoesRepository
    telefone_funcionario = TelFuncionariosRepository
    funcionario_enderecos = FuncionarioEnderecoRepository
    sequencias = SequenciasRepository
    historico = HistoricoOSRepository
    usuario = UsuarioRepository