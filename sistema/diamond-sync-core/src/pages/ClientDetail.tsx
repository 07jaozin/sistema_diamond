import { useParams, Link } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { ArrowLeft, Building2, ClipboardList, User } from "lucide-react";

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const { getClientById, getWorksByClient, getOSByClient } = useData();

  const client = getClientById(id || "");
  if (!client) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Cliente não encontrado</p>
        <Link to="/clientes" className="text-sm underline mt-2 inline-block">Voltar</Link>
      </div>
    );
  }

  const works = getWorksByClient(client.id);
  const orders = getOSByClient(client.id);

  return (
    <div className="space-y-6">
      <Link to="/clientes" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <div className="diamond-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{client.name}</h1>
            <p className="text-sm text-muted-foreground">{client.city}</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          {client.email && <div><span className="text-muted-foreground">E-mail:</span> {client.email}</div>}
          {client.phone && <div><span className="text-muted-foreground">Telefone:</span> {client.phone}</div>}
          {client.document && <div><span className="text-muted-foreground">CPF/CNPJ:</span> {client.document}</div>}
          {client.address && <div><span className="text-muted-foreground">Endereço:</span> {client.address}</div>}
          {client.notes && <div className="sm:col-span-2"><span className="text-muted-foreground">Obs:</span> {client.notes}</div>}
        </div>
      </div>

      {/* Obras */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold">Obras ({works.length})</h2>
        </div>
        {works.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma obra vinculada</p>
        ) : (
          <div className="grid gap-3">
            {works.map(w => (
              <div key={w.id} className="diamond-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{w.address}</p>
                    <p className="text-xs text-muted-foreground">{w.city}</p>
                  </div>
                  <StatusBadge status={w.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* OS */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold">Ordens de Serviço ({orders.length})</h2>
        </div>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma OS vinculada</p>
        ) : (
          <div className="grid gap-3">
            {orders.map(os => (
              <Link key={os.id} to="/ordens-servico" className="diamond-card p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">OS #{String(os.number).padStart(4, "0")}</p>
                  <p className="text-xs text-muted-foreground">{os.description.slice(0, 60)}</p>
                </div>
                <StatusBadge status={os.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    "Orçamento": "bg-secondary text-secondary-foreground",
    "Aprovada": "bg-diamond-info/10 text-diamond-info",
    "Em execução": "bg-diamond-warning/10 text-diamond-warning",
    "Finalizada": "bg-diamond-success/10 text-diamond-success",
    "Aberta": "bg-diamond-info/10 text-diamond-info",
    "Cancelada": "bg-destructive/10 text-destructive",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${colors[status] || "bg-secondary text-secondary-foreground"}`}>
      {status}
    </span>
  );
}
