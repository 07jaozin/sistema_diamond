from repositories.obras_querys import ObrasRepository


class ObrasServices:

    @staticmethod
    def listar_obras_services():
        obras =  ObrasRepository.query_listar_obras()

        return obras