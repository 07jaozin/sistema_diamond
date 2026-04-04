import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { listarOS, listarEquipeTecnica, CancelarOS, ObservacaoOS, enviarOS, CreateServiceOrder, UpdateServiceOrder, listarCarros, listarObras, listarClientes, buscarOSId, listarFuncoes } from "@/services/auth.services";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { serviceOrderKeys, equipeKeys, carrosKeys, obrasKeys, clientesKeys, funcoesKeys } from "@/services/keys";
import { number } from "framer-motion";

export function useServiceOrders() {
  return useQuery({
    queryKey: serviceOrderKeys.lists(),
    queryFn: listarOS,
    staleTime: 0
  });
}
export function useServiceOrdersID(os_id: number | null) {
  return useQuery({
    queryKey: serviceOrderKeys.details(),
    queryFn: () => buscarOSId(os_id!),
    enabled: !!os_id,
    staleTime: 0
  });
}

export function useCarros() {
  return useQuery({
    queryKey: carrosKeys.all,
    queryFn: listarCarros,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

export function useObras() {
  return useQuery({
    queryKey: obrasKeys.all,
    queryFn: listarObras,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

export function useClientes() {
  return useQuery({
    queryKey: clientesKeys.all,
    queryFn: listarClientes,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}


export function useFuncoes() {
  return useQuery({
    queryKey: ['funcoes'],
    queryFn: listarFuncoes,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

export function useEquipeTecnica(){
  return useQuery({
    queryKey: equipeKeys.all,
    queryFn: listarEquipeTecnica,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

export function useCreateServiceOrder() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: CreateServiceOrder,

    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: serviceOrderKeys.lists(),});

      toast.success("Ordem de Serviço criada com sucesso");
      navigate("/ordens-servico");
    },

    onError: (error: any) => {
      toast.error(error?.message || "Erro ao criar ordem de serviço");
    }
  });
}

export function useUpdateServiceOrder(){
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({os_id, data}: {os_id: number; data: any}) =>
      UpdateServiceOrder(os_id, data),

    onSuccess: (_, variables) => {

      console.log("CHEGUEI NO SUCCESS");

      queryClient.invalidateQueries({
        queryKey: serviceOrderKeys.detail(variables.os_id),
      });
      queryClient.invalidateQueries({
        queryKey: serviceOrderKeys.lists(),
      });

      toast.success("Ordem de Serviço atualizada com sucesso");
      navigate("/ordens-servico");    
    }, 

    onError: (error: any) => {
      console.log("CHEGUEI NO ERROR");
      toast.error(error?.message || "Erro ao editar ordem de serviço");
    }
  });
}
export function useCancelarServiceOrders(){
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({id, motivo}: {id: number, motivo: string}) =>
      CancelarOS(id, motivo),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: serviceOrderKeys.all,
      });
    },
  });
}
export function useObservacaoServiceOrders(){
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({id, observacao}: {id: number, observacao: string}) =>
      ObservacaoOS(id, observacao),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: serviceOrderKeys.all,
      });
    },
  });
}


export function useEnviarOS() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id:number) => 
      enviarOS(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: serviceOrderKeys.all,
      });
    },
  });
}
