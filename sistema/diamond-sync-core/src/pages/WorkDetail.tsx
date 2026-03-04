import { useParams, Link } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { ArrowLeft, Building2, CheckCircle2, Circle, ClipboardList, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { motion } from "framer-motion";
import { PHASE_LABELS, TEAM_MEMBERS, type TechnicalReport, type TeamMember, type ServiceOrder, type OSStatus } from "@/types";

export default function WorkDetail() {
  const { id } = useParams();
  const { getWorkById, getOSByWork, getReportsByWork, getReportByOS, updateWork, updateServiceOrderStatus, addReport } = useData();
  const work = getWorkById(id || "");
  const workOS = getOSByWork(id || "");
  const workReports = getReportsByWork(id || "");

  const [selectedOS, setSelectedOS] = useState<ServiceOrder | null>(null);
  const [selectedReport, setSelectedReport] = useState<TechnicalReport | null>(null);
  const [showReportForm, setShowReportForm] = useState<ServiceOrder | null>(null);
  const [reportTeam, setReportTeam] = useState<TeamMember[]>([]);

  if (!work) {
    return (
      <div className="space-y-6">
        <Link to="/obras" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <div className="diamond-card p-12 text-center">
          <Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Obra não encontrada</p>
        </div>
      </div>
    );
  }

  const phases = [
    { key: "phase1" as const, done: work.phase1 },
    { key: "phase2" as const, done: work.phase2 },
    { key: "phase3" as const, done: work.phase3 },
    { key: "phase4" as const, done: work.phase4 },
  ];
  const completedPhases = phases.filter(p => p.done).length;
  const progressPercent = (completedPhases / 4) * 100;
  const isFinalized = completedPhases === 4;

  const togglePhase = (phaseKey: "phase1" | "phase2" | "phase3" | "phase4") => {
    const newValue = !work[phaseKey];
    updateWork(work.id, { [phaseKey]: newValue });
    toast.success(newValue ? "Fase concluída" : "Fase reaberta");
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
      workId: work.id,
      clientName: work.clientName,
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

  const osReport = selectedOS ? getReportByOS(selectedOS.id) : undefined;

  return (
    <div className="space-y-6">
      <Link to="/obras" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar para Obras
      </Link>

      {/* Header */}
      <div className="diamond-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">{work.clientName}</h1>
            <p className="text-sm text-muted-foreground mt-1">{work.address} · {work.city}</p>
            <p className="text-sm text-muted-foreground mt-1">{work.description}</p>
          </div>
          <StatusBadge status={work.status} large />
        </div>
        {isFinalized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 flex items-center gap-3 p-4 rounded-lg bg-diamond-success/10 border border-diamond-success/20"
          >
            <CheckCircle2 className="h-6 w-6 text-diamond-success" />
            <div>
              <p className="font-semibold text-diamond-success">Obra Finalizada</p>
              <p className="text-xs text-muted-foreground">Todas as fases foram concluídas{work.endDate ? ` em ${work.endDate}` : ""}</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Phases */}
      <div className="diamond-card p-6">
        <h2 className="font-semibold mb-4">Progresso da Obra</h2>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progresso geral</span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2.5" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {phases.map(({ key, done }) => (
            <motion.button
              key={key}
              onClick={() => togglePhase(key)}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 text-left w-full
                ${done
                  ? "bg-diamond-success/10 border-diamond-success/30"
                  : "bg-muted/30 border-border hover:border-foreground/20"
                }`}
            >
              {done ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                  <CheckCircle2 className="h-6 w-6 text-diamond-success flex-shrink-0" />
                </motion.div>
              ) : (
                <Circle className="h-6 w-6 text-muted-foreground flex-shrink-0" />
              )}
              <div>
                <p className={`text-sm font-medium ${done ? "text-diamond-success" : "text-foreground"}`}>
                  {PHASE_LABELS[key]}
                </p>
                <p className="text-xs text-muted-foreground">{done ? "Concluída" : "Pendente"}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Work info grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-xs text-muted-foreground">Ordens de Serviço</p>
          <p className="text-2xl font-bold mt-1">{workOS.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground">Relatórios Técnicos</p>
          <p className="text-2xl font-bold mt-1">{workReports.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground">Início</p>
          <p className="text-sm font-medium mt-1">{work.startDate || "—"}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground">Finalização</p>
          <p className="text-sm font-medium mt-1">{work.endDate || "—"}</p>
        </div>
      </div>

      {/* OS Table */}
      <div className="diamond-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold">Ordens de Serviço da Obra</h2>
        </div>
        {workOS.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">Nenhuma OS vinculada a esta obra.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 font-medium text-muted-foreground">Nº OS</th>
                  <th className="pb-2 font-medium text-muted-foreground">Descrição</th>
                  <th className="pb-2 font-medium text-muted-foreground">Data</th>
                  <th className="pb-2 font-medium text-muted-foreground">Status</th>
                  <th className="pb-2 font-medium text-muted-foreground">Relatório</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {workOS.map(os => {
                  const report = getReportByOS(os.id);
                  return (
                    <tr key={os.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-mono text-xs">#{String(os.number).padStart(4, "0")}</td>
                      <td className="py-3 max-w-[200px] truncate">{os.description}</td>
                      <td className="py-3 text-muted-foreground">{format(new Date(os.executionDate), "dd/MM/yyyy")}</td>
                      <td className="py-3"><OSStatusBadge status={os.status} /></td>
                      <td className="py-3">
                        {report ? (
                          <span className="text-xs text-diamond-success font-medium">✓ Vinculado</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-3 text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedOS(os)}>Ver OS</Button>
                        {!report && os.status !== "Cancelada" && (
                          <Button variant="outline" size="sm" onClick={() => { setShowReportForm(os); setReportTeam([...os.team]); }}>
                            <FileText className="h-3 w-3 mr-1" /> Criar Relatório
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reports list */}
      <div className="diamond-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold">Relatórios Técnicos da Obra</h2>
        </div>
        {workReports.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">Nenhum relatório técnico registrado para esta obra.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 font-medium text-muted-foreground">OS Vinculada</th>
                  <th className="pb-2 font-medium text-muted-foreground">Data Execução</th>
                  <th className="pb-2 font-medium text-muted-foreground">Equipe</th>
                  <th className="pb-2 font-medium text-muted-foreground">Status</th>
                  <th className="pb-2 font-medium text-muted-foreground">Retorno</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {workReports.map(report => {
                  const linkedOS = workOS.find(os => os.id === report.osId);
                  return (
                    <tr key={report.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-mono text-xs">#{linkedOS ? String(linkedOS.number).padStart(4, "0") : "—"}</td>
                      <td className="py-3 text-muted-foreground">{report.executionDate}</td>
                      <td className="py-3 text-muted-foreground text-xs">{report.team.join(", ")}</td>
                      <td className="py-3"><ReportStatusBadge status={report.status} /></td>
                      <td className="py-3">
                        {report.needsReturn ? (
                          <span className="text-xs text-diamond-warning flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Sim</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Não</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedReport(report)}>Visualizar</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* OS Detail Dialog */}
      <Dialog open={!!selectedOS} onOpenChange={() => setSelectedOS(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>OS #{selectedOS ? String(selectedOS.number).padStart(4, "0") : ""}</DialogTitle></DialogHeader>
          {selectedOS && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Cliente:</span> {selectedOS.clientName}</div>
                <div><span className="text-muted-foreground">Cidade:</span> {selectedOS.city}</div>
                <div><span className="text-muted-foreground">Data:</span> {format(new Date(selectedOS.executionDate), "dd/MM/yyyy")}</div>
                <div><span className="text-muted-foreground">Endereço:</span> {selectedOS.address}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Descrição:</span> {selectedOS.description}</div>
                {selectedOS.considerations && <div className="col-span-2"><span className="text-muted-foreground">Considerações:</span> {selectedOS.considerations}</div>}
                {selectedOS.equipment.length > 0 && <div className="col-span-2"><span className="text-muted-foreground">Equipamentos:</span> {selectedOS.equipment.join(", ")}</div>}
                <div className="col-span-2"><span className="text-muted-foreground">Equipe:</span> {selectedOS.team.join(", ")}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Status:</span> <OSStatusBadge status={selectedOS.status} /></div>
              </div>

              {/* Report section */}
              <div className="border-t border-border pt-4">
                <h3 className="font-medium text-sm mb-3 flex items-center gap-2"><FileText className="h-4 w-4" /> Relatório Técnico</h3>
                {osReport ? (
                  <div className="space-y-3 text-sm bg-muted/30 p-4 rounded-lg">
                    <div><span className="text-muted-foreground">Data:</span> {osReport.executionDate}</div>
                    <div><span className="text-muted-foreground">Equipe:</span> {osReport.team.join(", ")}</div>
                    <div><span className="text-muted-foreground">Serviço Executado:</span> {osReport.servicePerformed}</div>
                    <div><span className="text-muted-foreground">Pendências:</span> {osReport.pendencies || "Nenhuma"}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Status:</span> <ReportStatusBadge status={osReport.status} />
                    </div>
                    {osReport.needsReturn && (
                      <div className="flex items-center gap-2 text-diamond-warning text-xs">
                        <AlertTriangle className="h-3 w-3" /> Necessita retorno ao local
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg text-center">
                    Nenhum relatório técnico registrado para esta OS.
                  </div>
                )}
              </div>

              {selectedOS.history.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-medium mb-2">Histórico</h3>
                  <div className="space-y-2">
                    {selectedOS.history.map((h, i) => (
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

      {/* Report Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Relatório Técnico</DialogTitle></DialogHeader>
          {selectedReport && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground">Cliente:</span> {selectedReport.clientName}</div>
                <div><span className="text-muted-foreground">Data Execução:</span> {selectedReport.executionDate}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Equipe:</span> {selectedReport.team.join(", ")}</div>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Serviço Executado:</p>
                <p className="bg-muted/30 p-3 rounded-lg">{selectedReport.servicePerformed}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Pendências:</p>
                <p className="bg-muted/30 p-3 rounded-lg">{selectedReport.pendencies || "Nenhuma"}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2"><span className="text-muted-foreground">Status:</span> <ReportStatusBadge status={selectedReport.status} /></div>
                {selectedReport.needsReturn && (
                  <span className="text-xs text-diamond-warning flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Necessita retorno</span>
                )}
              </div>
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
                <Checkbox id="needsReturn" name="needsReturn" />
                <Label htmlFor="needsReturn" className="text-sm">Precisa retornar ao local</Label>
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

function StatusBadge({ status, large }: { status: string; large?: boolean }) {
  const colors: Record<string, string> = {
    "Orçamento": "bg-secondary text-secondary-foreground",
    "Aprovada": "bg-diamond-info/10 text-diamond-info",
    "Em execução": "bg-diamond-warning/10 text-diamond-warning",
    "Finalizada": "bg-diamond-success/10 text-diamond-success",
  };
  return (
    <span className={`${large ? "text-sm px-3 py-1.5" : "text-xs px-2.5 py-1"} rounded-full font-medium ${colors[status] || "bg-secondary text-secondary-foreground"}`}>
      {status}
    </span>
  );
}

function OSStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    "Aberta": "bg-diamond-info/10 text-diamond-info",
    "Em execução": "bg-diamond-warning/10 text-diamond-warning",
    "Finalizada": "bg-diamond-success/10 text-diamond-success",
    "Cancelada": "bg-destructive/10 text-destructive",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${colors[status] || "bg-secondary text-secondary-foreground"}`}>
      {status}
    </span>
  );
}

function ReportStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    "Pendente": "bg-diamond-warning/10 text-diamond-warning",
    "Concluído": "bg-diamond-success/10 text-diamond-success",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${colors[status] || "bg-secondary text-secondary-foreground"}`}>
      {status}
    </span>
  );
}
