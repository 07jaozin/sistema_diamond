from repositories.carros_querys import CarrosRepository 

class CarrosServices:

    @staticmethod
    def listar_veiculos_service():
        lista_carros = CarrosRepository.listar_carros()

        lista_to_dict = [
            {
                "id": r.id,
                "modelo": r.modelo,
                "cor": r.cor,
                "descricao": r.descricao,
            }
            for r in lista_carros
        ]

        return lista_to_dict
