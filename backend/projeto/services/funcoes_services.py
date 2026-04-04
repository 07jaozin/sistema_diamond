from repositories.facade import Repositories as Repo

class FuncoesService:

    @staticmethod
    def listar_funcoes_services():

        funcoes = Repo.funcoes.query_listar_funcoes()

        funcoes_list = [funcao.to_dict() for funcao in funcoes]
        
        return funcoes_list
        