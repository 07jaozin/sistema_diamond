import { useState, useMemo } from "react";
import { useData } from "@/contexts/DataContext";
import { Link } from "react-router-dom";
import { ClipboardList, Plus, Search, FileText, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { format } from "date-fns";
import type { ServiceOrder, OSStatus, TechnicalReport, TeamMember } from "@/types";
import { TEAM_MEMBERS } from "@/types";
import { useServiceOrders } from "@/hooks/useServices";

export default function ServiceOrders() {
  const {serviceOrders ,updateServiceOrderStatus, getReportByOS, addReport } = useData();
  const { data: serviceOrderss = [], isLoading, error } = useServiceOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [detail, setDetail] = useState<ServiceOrder | null>(null);
  const [showReportForm, setShowReportForm] = useState<ServiceOrder | null>(null);
  const [reportTeam, setReportTeam] = useState<TeamMember[]>([]);



  const statuses: OSStatus[] = ["Aberta", "Em execução", "Finalizada", "Cancelada"];

  const filtered = useMemo(() => {
    return serviceOrders.filter(os => {
      const matchSearch = os.clientName.toLowerCase().includes(search.toLowerCase()) ||
        os.description.toLowerCase().includes(search.toLowerCase()) ||
        String(os.number).includes(search);
      const matchStatus = statusFilter === "all" || os.status === statusFilter;
      const matchTeam = teamFilter === "all" || os.team.includes(teamFilter as any);
      return matchSearch && matchStatus && matchTeam;
    });
  }, [serviceOrders, search, statusFilter, teamFilter]);

  const detailReport = detail ? getReportByOS(detail.id) : undefined;

  const handleStatusChange = (os: ServiceOrder, newStatus: OSStatus) => {
    // Rule: OS can only be finalized if it has a technical report
    if (newStatus === "Finalizada") {
      const report = getReportByOS(os.id);
      if (!report) {
        toast.error("Esta OS não pode ser finalizada sem um relatório técnico vinculado.");
        return;
      }
    }
    updateServiceOrderStatus(os.id, newStatus);
    setDetail({ ...os, status: newStatus });
    toast.success("Status atualizado");
  };

  const handleCreateReport = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!showReportForm) return;
    if (reportTeam.length === 0) {
      toast.error("Selecione pelo menos um membro da equipe");
      return;
    }
    const fd = new FormData(e.currentTarget);
    addReport({
      osId: showReportForm.id,
      workId: showReportForm.workId,
      clientName: showReportForm.clientName,
      team: reportTeam,
      executionDate: fd.get("executionDate") as string,
      servicePerformed: fd.get("servicePerformed") as string,
      pendencies: fd.get("pendencies") as string,
      status: fd.get("status") as TechnicalReport["status"],
      needsReturn: fd.get("needsReturn") === "on",
      attachments: [],
    });
    toast.success("Relatório técnico criado");
    setShowReportForm(null);
    setReportTeam([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="page-header">Ordens de Serviço</h1>
          <p className="page-subtitle mt-1">{serviceOrders.length} ordens cadastradas</p>
        </div>
        <Link to="/ordens-servico/nova">
          <Button><Plus className="h-4 w-4 mr-2" />Nova OS</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por cliente, número..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={teamFilter} onValueChange={setTeamFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Equipe" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toda equipe</SelectItem>
            {TEAM_MEMBERS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="diamond-card p-12 text-center">
          <ClipboardList className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhuma OS encontrada</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(os => {
            const hasReport = !!getReportByOS(os.id);
            return (
              <div key={os.id} className="diamond-card p-4 cursor-pointer" onClick={() => setDetail(os)}>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground">#{String(os.number).padStart(4, "0")}</span>
                      <p className="font-medium text-sm truncate">{os.clientName}</p>
                      {hasReport && <FileText className="h-3.5 w-3.5 text-diamond-success flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{os.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(os.executionDate), "dd/MM/yyyy")}
                      </span>
                      <span className="text-xs text-muted-foreground">· {os.city}</span>
                      <span className="text-xs text-muted-foreground">· {os.team.join(", ")}</span>
                    </div>
                  </div>
                  <StatusBadge status={os.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>OS #{detail ? String(detail.number).padStart(4, "0") : ""}</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Cliente:</span> {detail.clientName}</div>
                <div><span className="text-muted-foreground">Cidade:</span> {detail.city}</div>
                <div><span className="text-muted-foreground">Data:</span> {format(new Date(detail.executionDate), "dd/MM/yyyy")}</div>
                <div><span className="text-muted-foreground">Endereço:</span> {detail.address}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Descrição:</span> {detail.description}</div>
                {detail.considerations && <div className="col-span-2"><span className="text-muted-foreground">Considerações:</span> {detail.considerations}</div>}
                {detail.equipment.length > 0 && <div className="col-span-2"><span className="text-muted-foreground">Equipamentos:</span> {detail.equipment.join(", ")}</div>}
                <div className="col-span-2"><span className="text-muted-foreground">Equipe:</span> {detail.team.join(", ")}</div>
              </div>

              <div>
                <Label className="mb-2 block">Alterar Status</Label>
                <Select value={detail.status} onValueChange={v => handleStatusChange(detail, v as OSStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Report section */}
              <div className="border-t border-border pt-4">
                <h3 className="font-medium text-sm mb-3 flex items-center gap-2"><FileText className="h-4 w-4" /> Relatório Técnico</h3>
                {detailReport ? (
                  <div className="space-y-3 text-sm bg-muted/30 p-4 rounded-lg">
                    <div><span className="text-muted-foreground">Data:</span> {detailReport.executionDate}</div>
                    <div><span className="text-muted-foreground">Equipe:</span> {detailReport.team.join(", ")}</div>
                    <div><span className="text-muted-foreground">Serviço Executado:</span> {detailReport.servicePerformed}</div>
                    <div><span className="text-muted-foreground">Pendências:</span> {detailReport.pendencies || "Nenhuma"}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${detailReport.status === "Concluído" ? "bg-diamond-success/10 text-diamond-success" : "bg-diamond-warning/10 text-diamond-warning"}`}>
                        {detailReport.status}
                      </span>
                    </div>
                    {detailReport.needsReturn && (
                      <div className="flex items-center gap-2 text-diamond-warning text-xs">
                        <AlertTriangle className="h-3 w-3" /> Necessita retorno ao local
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg text-center space-y-3">
                    <p>Nenhum relatório técnico registrado para esta OS.</p>
                    {detail.status !== "Cancelada" && (
                      <Button variant="outline" size="sm" onClick={() => { setShowReportForm(detail); setReportTeam([...detail.team]); setDetail(null); }}>
                        <FileText className="h-3 w-3 mr-1" /> Criar Relatório
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {detail.history.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-medium mb-2">Histórico</h3>
                  <div className="space-y-2">
                    {detail.history.map((h, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
                        <div>
                          <span className="text-muted-foreground">{format(new Date(h.date), "dd/MM HH:mm")}</span>
                          <span className="ml-2">{h.action}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Report Dialog */}
      <Dialog open={!!showReportForm} onOpenChange={() => { setShowReportForm(null); setReportTeam([]); }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Novo Relatório Técnico</DialogTitle></DialogHeader>
          {showReportForm && (
            <form onSubmit={handleCreateReport} className="space-y-4">
              <div className="text-sm text-muted-foreground">
                OS #{String(showReportForm.number).padStart(4, "0")} — {showReportForm.description}
              </div>
              <div>
                <Label>Data de Execução *</Label>
                <Input name="executionDate" type="date" required defaultValue={new Date().toISOString().split("T")[0]} />
              </div>
              <div>
                <Label>Serviço Executado *</Label>
                <Textarea name="servicePerformed" required rows={3} />
              </div>
              <div>
                <Label>Pendências</Label>
                <Textarea name="pendencies" rows={2} />
              </div>
              <div>
                <Label>Status</Label>
                <Select name="status" defaultValue="Concluído">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="needsReturnOS" name="needsReturn" />
                <Label htmlFor="needsReturnOS" className="text-sm">Precisa retornar ao local</Label>
              </div>
              <div>
                <Label className="mb-2 block">Equipe *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {TEAM_MEMBERS.map(member => (
                    <label key={member} className="flex items-center gap-2 cursor-pointer text-sm">
                      <Checkbox
                        checked={reportTeam.includes(member)}
                        onCheckedChange={() => setReportTeam(prev => prev.includes(member) ? prev.filter(m => m !== member) : [...prev, member])}
                      />
                      {member}
                    </label>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full">Criar Relatório</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    "Aberta": "bg-diamond-info/10 text-diamond-info",
    "Em execução": "bg-diamond-warning/10 text-diamond-warning",
    "Finalizada": "bg-diamond-success/10 text-diamond-success",
    "Cancelada": "bg-destructive/10 text-destructive",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${colors[status] || "bg-secondary text-secondary-foreground"}`}>
      {status}
    </span>
  );
}
