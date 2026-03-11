import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { ArrowLeft } from "lucide-react";
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

export default function CreateServiceOrder() {
  const navigate = useNavigate();
  const { clients, works, addServiceOrder } = useData();
  const [clientId, setClientId] = useState("");
  const [workId, setWorkId] = useState("");
  const [team, setTeam] = useState<number[]>([]);
  const [equipmentInput, setEquipmentInput] = useState("");
  const [loadingCarros, setLoadingCarros] = useState(false);
  const [carroId, setCarroId] = useState<string>("");
  const [openClient, setOpenClient] = useState(false);
  const [etapa, setEtapa] = useState("")

  useEffect(() => {
    console.log(Number(workId))
  }, [workId])

  // Configurando o React Query
  const queryClient = useQueryClient();

  // Mutation para o envio dp formulario para o servidor
  const mutation = useMutation({
    mutationFn: createServiceOrder,
    onSuccess: () => {
      toast.success("Ordem de Serviço criada com sucesso");
      queryClient.invalidateQueries({ queryKey: ['ordens-servico'] });
      navigate("/ordens-servico");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao criar ordem de serviço");
    }
  });

  const {
    data: carros = [],
    isLoading: IsLoadingCarros,
    isError: IsErrorCarros
  } = useQuery({
    queryKey: ["carros"],
    queryFn: listarCarros,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const {
    data: obras = [],
    isLoading: IsLoadingObras,
    isError: IsErrorObras
  } = useQuery({
    queryKey: ["Obras"],
    queryFn: listarObras,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const {
    data: cliente = [],
    isLoading: IsLoadingCliente,
    isError: IsErrorCliente
  } = useQuery({
    queryKey: ["clientes"],
    queryFn: listarClientes,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const {
    data: equipeTecnica = [],
    isLoading: IsLoadingET,
    isError: IsErrorET
  } = useQuery({
    queryKey: ["equipe_tecnica"],
    queryFn: listarEquipeTecnica,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

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
    if(IsErrorCliente){
      toast.error("Erro ao carregar os clientes!")
    }
  }, [IsErrorCliente])

  const clientWorks = obras.filter(w => String(w.cliente_id) === clientId);
  const selectedClient = cliente.find(c => String(c.id) === clientId);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (team.length === 0) {
      toast.error("Selecione pelo menos um membro da equipe");
      return;
    }
    const fd = new FormData(e.currentTarget);
    
    const dto: CreateServiceOrderDTO = {
      clientId: Number(clientId),
      clientName: selectedClient?.nome || "",
      workId: Number(workId),
      carroId: carroId ? Number(carroId) : null,
      executionDate: fd.get("executionDate") as string,
      description: fd.get("description") as string,
      considerations: (fd.get("considerations") as string) || undefined,
      equipment: equipmentInput.split(",").map(s => s.trim()).filter(Boolean),
      team,
      status: "Aberta" as OSStatus,
      etapa: etapa,
    };
    mutation.mutate(dto);
  };

  const toggleTeam = (memberId: number) => {
    console.log(equipeTecnica)
    setTeam(prev => prev.includes(memberId) ? prev.filter(m => m !== memberId) : [...prev, memberId]);
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
              <Label>Cliente *</Label>

              <Popover open={openClient} onOpenChange={setOpenClient}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openClient}
                    className="w-full justify-between"
                  >
                    {clientId
                      ? cliente.find((c) => String(c.id) === clientId)?.nome
                      : "Selecione um cliente"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                    
                <PopoverContent className="w-full p-0">
                  <Command>
                    
                    <CommandInput placeholder="Pesquisar cliente..." />
                    
                    <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                    
                    <CommandGroup className="max-h-60 overflow-y-auto">
                      {cliente.map((c) => (
                        <CommandItem
                          key={c.id}
                          value={`${c.id} ${c.nome}`}
                          onSelect={() => {
                            setClientId(String(c.id));
                            setOpenClient(false);
                            setWorkId("");
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              clientId === String(c.id) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {c.id} - {c.nome}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    
                  </Command>
                </PopoverContent>
              </Popover>
             
            </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
              <Label>Obra *</Label>
                <Select value={workId} onValueChange={setWorkId} disabled={!clientId}>
                <SelectTrigger><SelectValue placeholder={clientId ? "Selecione a obra" : "Selecione o cliente primeiro"} /></SelectTrigger>
                <SelectContent>
                  {clientWorks.map((w, index) => <SelectItem key={w.id} value={String(w.id)}>Obra #{index + 1}</SelectItem>)}
                </SelectContent>
              </Select>
          </div>
          <div>
            <Label>Data de Execução *</Label>
            <Input name="executionDate" type="date" required />
          </div>
        </div>

        <div>
          <Label>Carro</Label>
          <Select value={carroId} onValueChange={setCarroId}>
            <SelectTrigger>
              <SelectValue placeholder={loadingCarros ? "Carregando..." : "Selecione um carro"} />
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
          <Select value={etapa} onValueChange={setEtapa}>
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
          <Textarea name="description" required rows={3} />
        </div>

        <div>
          <Label>Pontos a Considerar</Label>
          <Textarea name="considerations" rows={2} />
        </div>

        <div>
          <Label>Equipamentos (separados por vírgula)</Label>
          <Input value={equipmentInput} onChange={e => setEquipmentInput(e.target.value)} placeholder="Ex: Multiroom ( 1 unidade), CAT6 ( 270 metros)..." />
        </div>

        <div>
          <Label className="mb-3 block">Equipe *</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {equipeTecnica.map(member => (
              <label key={member.id} className="flex items-center gap-2 cursor-pointer text-sm">
                <Checkbox checked={team.includes(member.id)} onCheckedChange={() => toggleTeam(member.id)} />
                {member.nome}
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={!clientId || !workId}>
          Criar Ordem de Serviço
        </Button>
      </form>
    </div>
  );
}
