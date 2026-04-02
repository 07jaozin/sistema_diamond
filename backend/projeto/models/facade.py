from .ordens_servico import OrdensServico
from .clientes import Clientes
from .obras import Obras
from .carros import Carro, TipoCarro
from .funcionarios import Funcionarios
from .funcoes import Funcoes
from .historico_ordem_servico import HistoricoOrdemServico
from .sequencias import Sequencia
from .relatorios_tecnicos import RelatoriosTecnicos
from .relatorio_funcionarios import RelatorioFuncionarios
from .parceiros import Parceiros
from .parceiro_contatos import ParceiroContatos
from .obra_parceiros import ObraParceiros
from .vendas import Vendas
from .venda_parceiros import VendaParceiros
from .cidade import Cidade
from .enderecos import Enderecos
from .contatos_cliente import ContatosCliente
from .documentos import Documentos
from .funcionario_enderecos import FuncionarioEnderecos
from .funcionario_funcoes import FuncionarioFuncoes
from .ordem_servico_funcionario import OrdemServicoFuncionario
from .ordem_servico_itens import OrdemServicoItens
from .telefone_funcionario import TelefoneFuncionario
from .usuarios import Usuarios
from .permissoes import Permissoes
from .funcao_permissoes import FuncaoPermissoes
from .logs_sistema import LogsSistema


class Models:
    os = OrdensServico
    clientes = Clientes
    obras = Obras
    carros = Carro
    tipos_carro = TipoCarro
    funcionarios = Funcionarios
    funcoes = Funcoes
    historico_os = HistoricoOrdemServico
    sequencias = Sequencia
    relatorios_tecnicos = RelatoriosTecnicos
    relatorio_funcionarios = RelatorioFuncionarios
    parceiros = Parceiros
    parceiro_contatos = ParceiroContatos
    obra_parceiros = ObraParceiros
    vendas = Vendas
    venda_parceiros = VendaParceiros
    cidades = Cidade
    enderecos = Enderecos
    contatos_cliente = ContatosCliente
    documentos = Documentos
    funcionario_enderecos = FuncionarioEnderecos
    funcionario_funcoes = FuncionarioFuncoes
    ordem_servico_funcionario = OrdemServicoFuncionario
    ordem_servico_itens = OrdemServicoItens
    telefone_funcionario = TelefoneFuncionario
    usuarios = Usuarios
    permissoes = Permissoes
    funcao_permissoes = FuncaoPermissoes
    logs_sistema = LogsSistema

