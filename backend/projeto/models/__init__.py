from .funcionarios import Funcionarios
from .funcionario_enderecos import FuncionarioEnderecos
from .telefone_funcionario import TelefoneFuncionario
from .cidade import Cidade
from .carros import Carro, TipoCarro
from .funcoes import Funcoes
from .funcionario_funcoes import FuncionarioFuncoes
from .clientes import Clientes
from .contatos_cliente import ContatosCliente
from .vendas import Vendas
from .obras import Obras
from .enderecos import Enderecos

from .historicoOrdemServico import HistoricoOrdemServico
from .auditoriaOrdemServico import AuditoriaOrdemServico

from .ordens_servico import OrdensServico

from .relatorios_tecnicos import RelatoriosTecnicos
from .relatorio_funcionarios import RelatorioFuncionarios
from .documentos import Documentos
from .ordem_servico_itens import OrdemServicoItens
from .ordem_servico_funcionario import OrdemServicoFuncionario
from .parceiros import Parceiros
from .parceiro_contatos import ParceiroContatos
from .venda_parceiros import VendaParceiros
from .obra_parceiros import ObraParceiros

__all__ = [
    'Funcionarios',
    'FuncionarioEnderecos',
    'TelefoneFuncionario',
    'Funcoes',
    'FuncionarioFuncoes',
    'Clientes',
    'ContatosCliente',
    'Vendas',
    'Obras',
    'Enderecos',
    'OrdensServico',
    'RelatoriosTecnicos',
    'RelatorioFuncionarios',
    'Documentos',
    'OrdemServicoItens',
    'Parceiros',
    'ParceiroContatos',
    'VendaParceiros',
    'ObraParceiros',
    'AuditoriaOrdemServico',
    'HistoricoOrdemServico'
]
