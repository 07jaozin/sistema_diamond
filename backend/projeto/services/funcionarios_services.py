from repositories.facade import Repositories as Repo
from typing import Dict, Any, List
from .funcionarios.facade import FuncionarioServices as FS
from usuarios.usuario_service import cri
from extensions.extensoes import db
from werkzeug.security import generate_password_hash

class FuncionariosServices:

    @staticmethod
    def listar_equipe_tecnica_services():
        equipe_tecnica = Repo.funcionarios_funcoes.query_listar_equipe_tecnica()

        return equipe_tecnica
        
    @staticmethod
    def adicionar_funcionario_services(dados: Dict[str, Any]) -> Dict[str, Any]:
        funcao = dados.get("funcao")
        telefone = dados.get("telefone")
        endereco = dados.get("endereco")
    
        dados_funcionario = {
            k: v for k, v in dados.items()
            if k not in ["funcao", "telefone", "endereco"]
        }
    
        if not funcao:
            raise ValueError("Função é obrigatória")
    
        with db.session.begin():
            novo_funcionario = FS.funcionario.adicionar_funcionario_service(dados_funcionario)
    
            funcionario_id = novo_funcionario.get("id")
            if not funcionario_id:
                raise Exception("Erro ao criar funcionário")
    
            if telefone:
                FS.telefone.adicionar_telefone_service(funcionario_id, telefone)
    
            if endereco:
                FS.endereco.adicionar_endereco_service(funcionario_id, endereco)
    
            FS.funcao.adicionar_funcionario_funcoes_service(funcionario_id, funcao)
    
        return {
            "id": funcionario_id
        }
        

        