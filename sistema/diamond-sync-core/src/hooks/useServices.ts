import { useQuery } from "@tanstack/react-query";
import { listarOS } from "@/services/auth.services";

export function useServiceOrders() {
  return useQuery({
    queryKey: ["ordens_servico"],
    queryFn: listarOS,
  });
}