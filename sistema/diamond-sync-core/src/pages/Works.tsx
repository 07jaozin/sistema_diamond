import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useNavigate } from "react-router-dom";
import { Building2, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import type { Work } from "@/types";

export default function Works() {
  const { works, clients, addWork } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);

  const filtered = works.filter(w => {
    const matchesSearch = w.clientName.toLowerCase().includes(search.toLowerCase()) || w.address.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["Orçamento", "Aprovada", "Em execução", "Finalizada"] as const;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const clientId = fd.get("clientId") as string;
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    addWork({
      clientId,
      clientName: client.name,
      address: fd.get("address") as string,
      city: fd.get("city") as string,
      status: fd.get("status") as Work["status"],
      description: fd.get("description") as string,
      phase1: false,
      phase2: false,
      phase3: false,
      phase4: false,
      startDate: fd.get("startDate") as string || "",
      endDate: "",
    });
    toast.success("Obra cadastrada com sucesso");
    setOpen(false);
  };

  const getProgress = (w: Work) => {
    const count = [w.phase1, w.phase2, w.phase3, w.phase4].filter(Boolean).length;
    return (count / 4) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="page-header">Obras</h1>
          <p className="page-subtitle mt-1">{works.length} obras cadastradas</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Nova Obra</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Cadastrar Obra</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Cliente *</Label>
                <Select name="clientId" required>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Endereço *</Label><Input name="address" required /></div>
              <div><Label>Cidade *</Label><Input name="city" required /></div>
              <div>
                <Label>Status</Label>
                <Select name="status" defaultValue="Orçamento">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Data de Início</Label><Input name="startDate" type="date" /></div>
              <div><Label>Descrição</Label><Input name="description" /></div>
              <Button type="submit" className="w-full">Cadastrar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setStatusFilter("all")} className={`filter-badge ${statusFilter === "all" ? "filter-badge-active" : "filter-badge-inactive"}`}>Todos</button>
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`filter-badge ${statusFilter === s ? "filter-badge-active" : "filter-badge-inactive"}`}>{s}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="diamond-card p-12 text-center">
          <Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhuma obra encontrada</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(w => {
            const progress = getProgress(w);
            return (
              <div key={w.id} className="diamond-card p-4 cursor-pointer" onClick={() => navigate(`/obras/${w.id}`)}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm">{w.clientName}</p>
                    <p className="text-xs text-muted-foreground">{w.address} · {w.city}</p>
                  </div>
                  <StatusBadge status={w.status} />
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={progress} className="h-1.5 flex-1" />
                  <span className="text-xs text-muted-foreground font-medium">{progress}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    "Orçamento": "bg-secondary text-secondary-foreground",
    "Aprovada": "bg-diamond-info/10 text-diamond-info",
    "Em execução": "bg-diamond-warning/10 text-diamond-warning",
    "Finalizada": "bg-diamond-success/10 text-diamond-success",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${colors[status] || "bg-secondary text-secondary-foreground"}`}>
      {status}
    </span>
  );
}
