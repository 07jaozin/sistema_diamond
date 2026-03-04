export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string; // CPF/CNPJ
  address: string;
  city: string;
  notes: string;
  createdAt: string;
}

export interface Work {
  id: string;
  clientId: string;
  clientName: string;
  address: string;
  city: string;
  status: "Orçamento" | "Aprovada" | "Em execução" | "Finalizada";
  description: string;
  phase1: boolean;
  phase2: boolean;
  phase3: boolean;
  phase4: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export type OSStatus = "Aberta" | "Em execução" | "Finalizada" | "Cancelada";

export const TEAM_MEMBERS = [
  "João",
  "Patrick",
  "Vinicius",
  "Raimundo",
  "Mauricio",
  "Gabriel",
] as const;

export type TeamMember = (typeof TEAM_MEMBERS)[number];

export interface ServiceOrder {
  id: string;
  number: number;
  clientId: string;
  clientName: string;
  workId: string;
  carroId: string;
  executionDate: string;
  description: string;
  considerations: string;
  equipment: string[];
  team: TeamMember[];
  city: string;
  address: string;
  status: OSStatus;
  createdAt: string;
  updatedAt: string;
  history: { date: string; action: string }[];
}

export type ReportStatus = "Pendente" | "Concluído";

export interface TechnicalReport {
  id: string;
  osId: string;
  workId: string;
  clientName: string;
  team: TeamMember[];
  executionDate: string;
  servicePerformed: string;
  pendencies: string;
  status: ReportStatus;
  needsReturn: boolean;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CarroList {
  id: number;
  modelo: string;
  cor: string;
  tipo: string;
}

export interface ClientList {
  id: number;
  nome: string;
}

export interface CreateServiceOrderDTO {
    clientId: number;
    clientName: string;
    workId: number;
    carroId: number | null;
    executionDate: string;
    description: string;
    considerations?: string;
    equipment?: string[];
    team: TeamMember[];
    status: OSStatus;
}

export const PHASE_LABELS: Record<string, string> = {
  phase1: "Fase 1 — Preparação",
  phase2: "Fase 2 — Execução",
  phase3: "Fase 3 — Acabamento",
  phase4: "Fase 4 — Entrega",
};
