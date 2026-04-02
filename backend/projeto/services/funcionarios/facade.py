from .funcionario_service import FuncionarioService
from .funcionario_telefone_service import FuncionariosTelService
from .funcionario_ende_service import FuncionarioEnderecoService
from .funcionarios_funcoes_query import FuncionariosFuncoesService

class FuncionarioServices:

    funcionario = FuncionarioService
    telefone = FuncionariosTelService
    endereco = FuncionarioEnderecoService
    funcao = FuncionariosFuncoesService