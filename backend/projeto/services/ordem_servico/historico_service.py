from repositories.facade import Repositories as Repo
from models.facade import Models
from typing import Optional, Any
from datetime import datetime, timezone


class HistoricoService:

    @staticmethod
    def registrar_evento(
        ordem_servico_id: int,
        funcionario_id: Optional[int],
        evento: str,
        descricao: str,
        created_at: Optional[datetime] = None
    ) -> Any:
       
        historico = Models.historico_os(
            ordem_servico_id=ordem_servico_id,
            funcionario_id=funcionario_id,
            evento=evento,
            descricao=descricao,
            created_at=created_at or datetime.now(timezone.utc)
        )

        return Repo.historico.query_registrar_historico_os(historico)