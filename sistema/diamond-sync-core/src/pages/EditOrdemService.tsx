import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { TEAM_MEMBERS, type TeamMember, type OSStatus, PHASE_LABELS } from "@/types";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { listarCarros, CreateServiceOrder as createServiceOrder } from "@/services/auth.services";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateServiceOrderDTO } from "@/types";
import { listarClientes, listarObras, listarEquipeTecnica } from "@/services/auth.services";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpdateServiceOrder } from "@/hooks/useServices";
import { useCarros, useClientes, useObras, useEquipeTecnica, useServiceOrdersID } from "@/hooks/useServices";
import { stat } from "fs";

export default function EditServiceOrder() {
  
  const updateOrderService = useUpdateServiceOrder();
  const navigate = useNavigate();
  const {os_id} = useParams<{ os_id: string }>();
  const osIdNumber = os_id ? parseInt(os_id, 10) : null;

  const [form, setForm] = useState({
    clientId: "",
    clientName: "",
    workId: "",
    carroId: "",
    etapa: "",
    executionDate: "",
    description: "",
    considerations: "",
    status: "",
    equipmentInput: "",
    team: [] as number[],
    });

  const { data: carros = [], isError: IsErrorCarros } = useCarros();
  const { data: obras = [], isError: IsErrorObras } = useObras();
  const { data: osData, isLoading } = useServiceOrdersID(osIdNumber);
  const { data: equipeTecnica = [], isError: IsErrorET } = useEquipeTecnica();

  useEffect(() => {
    if(IsErrorCarros){
      toast.error("Erro ao carregar os carros!")
    }
  }, [IsErrorCarros])
  useEffect(() => {
    if(IsErrorET){
      toast.error("Erro ao carregar a equipe tecnica!")
    }
  }, [IsErrorET])

 useEffect(() => {
  if (!osData) return;

  const os = osData[0];
  if (!os) return;

  

  setForm({
    clientId: String(os.cliente_id),
    clientName: os.cliente_nome || "",
    workId: String(os.obra_id),
    carroId: os.carro_id ? String(os.carro_id) : "",
    etapa: os.etapa || "",
    executionDate: os.data_execucao || "",
    description: os.descricao_servico || "",
    considerations: os.observacoes_importantes || "",
    status: os.status,
    equipmentInput:
    os.equipamentos?.map((e: any) => `${e.descricao} (${e.quantidade} ${e.unidade})`).join(", ") || "",
    team: os.equipe?.map((e: any) => e.id) || [],
      });
    console.log("status: ", form.status)

    }, [osData, obras]);
    

  const updateField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
  };

  const clientWorks = obras.filter(
        w => String(w.cliente_id) === form.clientId
  );
  useEffect(() => {
  if (form.workId && !clientWorks.find(w => String(w.id) === form.workId)) {
    updateField("workId", "");
  }
}, [form.clientId, obras, form.workId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.team.length === 0) {
        toast.error("Selecione pelo menos um membro da equipe");
        return;
    }
    
    const dto: CreateServiceOrderDTO = {
      clientId: Number(form.clientId),
      clientName: form.clientName,
      workId: Number(form.workId),
      carroId: form.carroId ? Number(form.carroId) : null,
      executionDate: form.executionDate,
      description: form.description,
      considerations: form.considerations,
      equipment: form.equipmentInput
        .split(",")
        .map(s => s.trim())
        .filter(Boolean),
      team: form.team,
      status: form.status,
      etapa: form.etapa,
    };

    updateOrderService.mutate({os_id: osIdNumber, data: dto,});
    };

  const toggleTeam = (memberId: number) => {
    setForm(prev => ({
        ...prev,
        team: prev.team.includes(memberId)
        ? prev.team.filter(id => id !== memberId)
        : [...prev.team, memberId],
    }));
    };

  return (
    <div className="space-y-6 max-w-2xl">
      <Link to="/ordens-servico" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <div>
        <h1 className="page-header">Nova Ordem de Serviço</h1>
        <p className="page-subtitle mt-1">Preencha os dados para criar uma nova OS</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 diamond-card p-6">
        <div>
          <div>
              <Label>Cliente</Label>
                <Input value={form.clientName} disabled={true}  placeholder="Ex: Multiroom ( 1 unidade), CAT6 ( 270 metros)..." />
             
            </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
              <Label>Obra </Label>
            
                <Select
                    value={String(form.workId) ?? ""}
                    onValueChange={(value) => updateField("workId", value)}
                >
                <SelectTrigger><SelectValue placeholder={"Selecione a obra"} /></SelectTrigger>
                <SelectContent>
                  {clientWorks.map((w, index) => <SelectItem key={w.id} value={String(w.id)}>Obra #{index + 1}</SelectItem>)}
                </SelectContent>
              </Select>
             
          </div>
          <div>
            <Label>Data de Execução *</Label>
            <Input
                type="date"
                value={form.executionDate}
                onChange={(e) => updateField("executionDate", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>Carro</Label>
          <Select value={form.carroId} onValueChange={(value) => updateField("carroId", value)}>
            <SelectTrigger>
              <SelectValue placeholder={"Selecione um carro"} />
            </SelectTrigger>
            <SelectContent>
              {carros.map((carro) => (
                <SelectItem key={carro.id} value={String(carro.id)}>
                  {carro.modelo} - {carro.cor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Etapa</Label>
          <Select value={form.etapa} onValueChange={(value) => updateField("etapa", value)}>
            <SelectTrigger>
              <SelectValue placeholder={"Selecione a etapa"} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PHASE_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={label}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Descrição do Serviço *</Label>
          <Textarea
            value={form.description}
            onChange={e => updateField("description", e.target.value)}
            required
             rows={3}
          />
        </div>

        <div>
          <Label>Pontos a Considerar</Label>
          <Textarea
            value={form.considerations}
            onChange={e => updateField("considerations", e.target.value)}
            rows={2}
         />
        </div>

        <div>
          <Label>Equipamentos (separados por vírgula)</Label>
          <Input value={form.equipmentInput} onChange={e => updateField("equipmentInput", e.target.value)} placeholder="Ex: Multiroom ( 1 unidade), CAT6 ( 270 metros)..." />
        </div>

        <div>
          <Label className="mb-3 block">Equipe *</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {equipeTecnica.map(member => (
              <label key={member.id} className="flex items-center gap-2 cursor-pointer text-sm">
                <Checkbox checked={form.team.includes(member.id)} onCheckedChange={() => toggleTeam(member.id)}/>
                {member.nome}
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg">
          Confirmar Edições
        </Button>
      </form>
    </div>
  );
}
