from repositories.funcionarios_querys import FuncionariosRepository as FuncionariosQuery

class FuncionariosServices:

    @staticmethod
    def listar_equipe_tecnica_services():
        equipe_tecnica = FuncionariosQuery.query_listar_equipe_tecnica()

        return equipe_tecnica
        