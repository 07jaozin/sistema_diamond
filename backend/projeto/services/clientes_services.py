from repositories.clientes_querys import ClientesRepository as ClientesQuery

class ClientesServices:

    @staticmethod
    def listar_clientes_service():
        clientes = ClientesQuery.listar_clientes_query()

        return clientes