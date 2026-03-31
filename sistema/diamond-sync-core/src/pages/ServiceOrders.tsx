import { useState, useMemo } from "react";
import { useData } from "@/contexts/DataContext";
import { Link } from "react-router-dom";
import { ClipboardList, Plus, Search, FileText, AlertTriangle, MessageCircle, XIcon, PenBoxIcon, AlertTriangleIcon, SlidersHorizontal} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { format } from "date-fns";
import type { ServiceOrder, OSStatus, TechnicalReport, TeamMember, OrdemServico } from "@/types";
import { useServiceOrders, useEquipeTecnica, useCancelarServiceOrders, useObservacaoServiceOrders, useEnviarOS, useCarros } from "@/hooks/useServices";
import { resourceUsage } from "process";
import { ActionDialog } from "./ActionDialog";
import { useNavigate } from "react-router-dom";
import { id } from "date-fns/locale";
import {PHASE_LABELS } from "@/types";


export default function ServiceOrders() {
  const {getReportByOS, addReport } = useData();
  const { data: ordensServico = [], isLoading, error } = useServiceOrders();
  const { data: carros = [], isError: IsErrorCarros } = useCarros();
  const cancelarOSMutation = useCancelarServiceOrders();
  const observacaoOSMutation = useObservacaoServiceOrders();
  const enviarOSMutation = useEnviarOS();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  // novos filtros
  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [etapaFilter, setEtapaFilter] = useState("all");

  // controle do modal
  const [openFilters, setOpenFilters] = useState(false);

  const [detail, setDetail] = useState<OrdemServico | null>(null);
  const [showReportForm, setShowReportForm] = useState<ServiceOrder | null>(null);
  const [reportTeam, setReportTeam] = useState<number[]>([]);
  const { data: equipeTecnica = [], isLoading: IsLoadingET, isError: IsErrorET } = useEquipeTecnica();
  const [cancelModal, setCancelModal] = useState<OrdemServico | null>(null);
  const [observationModal, setObservationModal] = useState<OrdemServico | null>(null);
  const [cancelReason, setCancelReason] = useState("");



  const statuses: OSStatus[] = ["Aberta", "Em execução", "Finalizada", "Cancelada", "Emitida"];

  const handleCancelOS = (motivo: string) => {
    if (!cancelModal) return;

    if (!motivo.trim()) {
      toast.error("Informe o motivo do cancelamento");
      return;
    }
    cancelarOSMutation.mutate(
      {
        id: Number(cancelModal.id),
        motivo: motivo,
      },
      {
        onSuccess: () => {
          toast.success("Ordem de serviço cancelada");

          setCancelModal(null);
          setCancelReason("");
        },
        onError: () => {
          toast.error("Erro ao cancelar OS");
        }
      }
    )
  };

  const handleObservacaoOS = (motivo: string) => {
    if (!observationModal) return;

    if (!motivo.trim()) {
      toast.error("Informe o motivo do cancelamento");
      return;
    }

    observacaoOSMutation.mutate(
      {
        id: Number(observationModal.id),
        observacao: motivo,
      },
      {
        onSuccess: () => {
          toast.success(`Observação adicionada ao historico da ${observationModal.numero_os}`);

          setCancelModal(null);
          setCancelReason("");
        },
        onError: () => {
          toast.error("Erro ao cancelar OS");
        }
      }
    )
  };

  const handleEnviarOS = (os_id: number) => {
    if (!os_id) return;

    enviarOSMutation.mutate(
      os_id,
      {
        onSuccess: () => {
          toast.success(`OS ${os_id} enviada com sucesso`);
        },
        onError: () => {
          toast.error("Erro ao enviar OS");
        }
      }
    );
  };

const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-");
  return format(new Date(Number(year), Number(month) - 1, Number(day)), "dd/MM/yyyy");
};

  const filtered = useMemo(() => {
    return ordensServico.filter(os => {

      const descricao = (os.descricao_servico || "").toLowerCase();
      const cliente = (os.cliente_nome || "").toLowerCase();

      
      const matchSearch =
        cliente.includes(search.toLowerCase()) ||
        String(os.numero_os).includes(search);

    
      const matchStatus =
        statusFilter === "all" || os.status === statusFilter;

      
      const matchTeam =
        teamFilter === "all" ||
        (os.equipe || []).some(e => e.id === Number(teamFilter));

      const matchEtapa =
        etapaFilter === "all" ||
        os.etapa === etapaFilter;

      console.log("os_etapa", os.etapa)
      console.log("etapa Filter", etapaFilter)

     
      const matchVehicle =
        vehicleFilter === "all" ||
        String(os.carro_id) === String(vehicleFilter);

     
      const osDate = os.data_execucao
        ? new Date(os.data_execucao)
        : null;

      const matchDate =
        (!dateStart || (osDate && osDate >= new Date(dateStart))) &&
        (!dateEnd || (osDate && osDate <= new Date(dateEnd)));

      return (
        matchSearch &&
        matchStatus &&
        matchTeam &&
        matchVehicle &&
        matchDate &&
        matchEtapa
      );
    });
  }, [
    ordensServico,
    search,
    statusFilter,
    teamFilter,
    vehicleFilter,
    dateStart,
    dateEnd,
    etapaFilter
  ]);

  const detailReport = detail ? getReportByOS(detail.id) : undefined;



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
          <p className="page-subtitle mt-1">{ordensServico.length} ordens cadastradas</p>
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
        <Button variant="outline" onClick={() => setOpenFilters(true)}>
          <SlidersHorizontal />
          
        </Button>
      </div>

      {isLoading || error ? (
        <div className="diamond-card p-12 text-center">
          {isLoading && (
            <>
              <ClipboardList className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Carregando...</p>
            </>
          )}
          {error && (
            <>
              <AlertTriangleIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Erro ao listar as OS</p>
            </>
          )}
          
        </div>
      ) : (
        <>
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
                  <>
                  <div key={os.id} className="diamond-card p-4 cursor-pointer" onClick={() => setDetail(os)}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-muted-foreground">#{String(os.numero_os).padStart(4, "0")}</span>
                          <p className="font-medium text-sm truncate">{os.cliente_nome}</p>
                          {hasReport && <FileText className="h-3.5 w-3.5 text-diamond-success flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 truncate">{os.descricao_servico}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(os.data_execucao)}
                          </span>
                          <span className="text-xs text-muted-foreground">· {os.cidade}</span>
                          <span className="text-xs text-muted-foreground">· {os.equipe.map(e => e.nome).join(", ")}</span>
                        </div>
                      </div>
                      <StatusBadge status={os.status} />
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                    className="max-w-28 bg-green-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEnviarOS(Number(os.id))
                    }}
                    ><MessageCircle />Enviar</Button>
                    <Button 
                    className="max-w-28 bg-blue-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setObservationModal(os);
                    }}
                    >
                      <PenBoxIcon />Observação
                    </Button>
                    <Button 
                    className="max-w-28 bg-yellow-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/ordens-servico/${os.id}`)
                    }}
                    >
                      <PenBoxIcon />Editar
                    </Button>
                    <Button 
                    className="max-w-28 bg-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCancelModal(os);
                    }}
                    >
                      <XIcon />Cancelar
                    </Button>
                    
                  </div>
                  </>
                );
              })}
            </div>
          )}
        </>
      )}

      
      {/* Detail dialog */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>OS #{detail ? String(detail.numero_os).padStart(4, "0") : ""}</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Cliente:</span> {detail.cliente_nome}</div>
                <div><span className="text-muted-foreground">Cidade:</span> {detail.cidade}</div>
                <div><span className="text-muted-foreground">Data de Execução:</span> {formatDate(detail.data_execucao)}</div>
                <div><span className="text-muted-foreground">Endereço:</span> {detail.endereco}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Descrição:</span> {detail.descricao_servico}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Etapa:</span> {detail.etapa}</div>
                {detail.observacoes_importantes && <div className="col-span-2"><span className="text-muted-foreground">Considerações:</span> {detail.observacoes_importantes}</div>}
                {detail.equipamentos.length > 0 && <div className="col-span-2"><span className="text-muted-foreground">Equipamentos:</span> {detail.equipamentos.map(e => `#${e.item_numero} - ${e.descricao} - ${e.quantidade} ${e.unidade}`).join(", ")}</div>}
                <div className="col-span-2"><span className="text-muted-foreground">Equipe:</span> {detail.equipe.map(e => e.nome).join(", ")}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Veiculo:</span> {detail.carro_modelo} - {detail.carro_cor}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Status:</span> {detail.status}</div>
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
                      //<Button variant="outline" size="sm" onClick={() => { setShowReportForm(detail); setReportTeam([...detail.equipe]); setDetail(null); }}>
                       // <FileText className="h-3 w-3 mr-1" /> Criar Relatório
                     // </Button>
                     <p>Teste</p>
                    )}
                  </div>
                )}
                
              </div>
                {detail.historico.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-medium mb-2">Histórico</h3>
                  <div className="space-y-2">
                    {detail.historico.map(h => (
                      <div key={h.id} className="flex items-start gap-3 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
                        <div>
                          <span className="text-muted-foreground">{format(new Date(h.created_at), "dd/MM HH:mm")}</span>
                          <span className="ml-2">{h.evento} - {h.descricao} - {h.funcionario_nome}</span>
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
                  {equipeTecnica.map(member => (
                    <label key={member.id} className="flex items-center gap-2 cursor-pointer text-sm">
                      <Checkbox
                        checked={reportTeam.includes(member.id)}
                        onCheckedChange={() =>
                          setReportTeam(prev =>
                            prev.includes(member.id)
                              ? prev.filter(id => id !== member.id)
                              : [...prev, member.id]
                          )
                        }
                      />
                      {member.nome}
                    </label>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full">Criar Relatório</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openFilters} onOpenChange={setOpenFilters}>
  <DialogContent className="max-w-lg">
    <DialogHeader>
      <DialogTitle>Filtros avançados</DialogTitle>
    </DialogHeader>

    <div className="grid gap-4">

      {/* STATUS */}
      <div>
        <Label>Status</Label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {statuses.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* EQUIPE */}
      <div>
        <Label>Técnico / Equipe</Label>
        <Select value={teamFilter} onValueChange={setTeamFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Equipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {equipeTecnica.map(m => (
              <SelectItem key={m.id} value={String(m.id)}>
                {m.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Etapa</Label>
        <Select value={etapaFilter} onValueChange={setEtapaFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a etapa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>

            {Object.entries(PHASE_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={label}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* VEÍCULO */}
      <div>
        <Label>Veículo</Label>
        <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Veículo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {carros.map(v => (
              <SelectItem key={v.id} value={String(v.id)}>
                {v.modelo} - {v.cor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* DATA */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Data inicial</Label>
          <br />
          <Input
            type="date"
            value={dateStart}
            onChange={e => setDateStart(e.target.value)}
          />
        </div>

        <div>
          <Label>Data final</Label>
          <Input
            type="date"
            value={dateEnd}
            onChange={e => setDateEnd(e.target.value)}
          />
        </div>
      </div>

        {/* AÇÕES */}
        <div className="flex justify-between mt-4">
          <Button
            variant="ghost"
            onClick={() => {
              setStatusFilter("all");
              setTeamFilter("all");
              setVehicleFilter("all");
              setDateStart("");
              setDateEnd("");
            }}
          >
            Limpar filtros
          </Button>

          <Button onClick={() => setOpenFilters(false)}>
            Aplicar
          </Button>
        </div>

      </div>
    </DialogContent>
  </Dialog>

      <ActionDialog
        open={!!cancelModal}
        title="Cancelar Ordem de Serviço"
        description={`Você está cancelando a OS #${cancelModal?.numero_os}`}
        label="Motivo do cancelamento"
        placeholder="Descreva o motivo..."
        confirmLabel="Confirmar cancelamento"
        confirmVariant="destructive"
        onConfirm={(motivo) => handleCancelOS(motivo)}
        onClose={() => setCancelModal(null)}
        
      />

      <ActionDialog
        open={!!observationModal}
        title="Adicionar observação"
        label={`Observação para a ${observationModal?.numero_os}`}
        placeholder="Digite a observação..."
        confirmLabel="Salvar"
        confirmVariant="default"
        onConfirm={(motivo) => handleObservacaoOS(motivo)}
        onClose={() => setObservationModal(null)}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    "Aberta": "bg-diamond-info/10 text-diamond-info",
    "Em execução": "bg-diamond-warning/10 text-diamond-warning",
    "Finalizada": "bg-diamond-success/10 text-diamond-success",
    "Cancelada": "bg-destructive/10 text-destructive",
    "Emitida": "bg-diamond-warning/10 text-diamond-warning",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${colors[status] || "bg-secondary text-secondary-foreground"}`}>
      {status}
    </span>
  );
}
