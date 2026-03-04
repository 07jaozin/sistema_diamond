import { useData } from "@/contexts/DataContext";
import { Link } from "react-router-dom";
import { Building2, ClipboardList, Clock, AlertCircle, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const { clients, works, serviceOrders } = useData();
  const [search, setSearch] = useState("");

  const activeWorks = works.filter(w => w.status === "Em execução" || w.status === "Aprovada");
  const openOS = serviceOrders.filter(os => os.status === "Aberta");
  const pendingOS = serviceOrders.filter(os => os.status === "Aberta" || os.status === "Em execução");
  const upcomingOS = serviceOrders
    .filter(os => os.status === "Aberta" && new Date(os.executionDate) >= new Date())
    .sort((a, b) => new Date(a.executionDate).getTime() - new Date(b.executionDate).getTime())
    .slice(0, 5);

  const filteredClients = useMemo(() => {
    if (!search.trim()) return [];
    return clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).slice(0, 5);
  }, [clients, search]);

  const stats = [
    { label: "Obras Ativas", value: activeWorks.length, icon: Building2, color: "text-diamond-info" },
    { label: "OS Abertas", value: openOS.length, icon: ClipboardList, color: "text-diamond-success" },
    { label: "OS Pendentes", value: pendingOS.length, icon: AlertCircle, color: "text-diamond-warning" },
    { label: "Clientes", value: clients.length, icon: Users, color: "text-foreground" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="page-header">Dashboard</h1>
          <p className="page-subtitle mt-1">Visão geral operacional da Diamond</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
          {filteredClients.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-popover border border-border rounded-lg shadow-lg z-10 overflow-hidden">
              {filteredClients.map(c => (
                <Link
                  key={c.id}
                  to={`/clientes/${c.id}`}
                  className="block px-4 py-3 hover:bg-accent transition-colors text-sm"
                  onClick={() => setSearch("")}
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="text-muted-foreground ml-2">· {c.city}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming services */}
        <div className="diamond-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold">Próximos Serviços</h2>
          </div>
          {upcomingOS.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">Nenhum serviço agendado</p>
          ) : (
            <div className="space-y-3">
              {upcomingOS.map(os => (
                <div key={os.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">OS #{String(os.number).padStart(4, "0")}</p>
                    <p className="text-xs text-muted-foreground">{os.clientName} · {os.city}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(os.executionDate), "dd MMM", { locale: ptBR })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent works */}
        <div className="diamond-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold">Obras Recentes</h2>
            </div>
            <Link to="/obras" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Ver todas →
            </Link>
          </div>
          {works.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">Nenhuma obra cadastrada</p>
          ) : (
            <div className="space-y-3">
              {works.slice(-5).reverse().map(w => (
                <div key={w.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{w.clientName}</p>
                    <p className="text-xs text-muted-foreground">{w.address} · {w.city}</p>
                  </div>
                  <StatusBadge status={w.status} />
                </div>
              ))}
            </div>
          )}
        </div>
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
