import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Client, Work, ServiceOrder, OSStatus, TechnicalReport, ReportStatus } from "@/types";

interface DataContextType {
  clients: Client[];
  works: Work[];
  serviceOrders: ServiceOrder[];
  reports: TechnicalReport[];
  addClient: (client: Omit<Client, "id" | "createdAt">) => Client;
  updateClient: (id: string, data: Partial<Client>) => void;
  addWork: (work: Omit<Work, "id" | "createdAt" | "updatedAt">) => Work;
  updateWork: (id: string, data: Partial<Work>) => void;
  addServiceOrder: (os: Omit<ServiceOrder, "id" | "number" | "createdAt" | "updatedAt" | "history">) => ServiceOrder;
  updateServiceOrderStatus: (id: string, status: OSStatus) => void;
  addReport: (report: Omit<TechnicalReport, "id" | "createdAt" | "updatedAt">) => TechnicalReport;
  updateReport: (id: string, data: Partial<TechnicalReport>) => void;
  getClientById: (id: string) => Client | undefined;
  getWorkById: (id: string) => Work | undefined;
  getWorksByClient: (clientId: string) => Work[];
  getOSByClient: (clientId: string) => ServiceOrder[];
  getOSByWork: (workId: string) => ServiceOrder[];
  getReportByOS: (osId: string) => TechnicalReport | undefined;
  getReportsByWork: (workId: string) => TechnicalReport[];
}

const DataContext = createContext<DataContextType | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

const SEED_CLIENTS: Client[] = [
  { id: "c1", name: "Construtora Horizonte", email: "contato@horizonte.com", phone: "(11) 99887-6543", document: "12.345.678/0001-90", address: "Av. Paulista, 1500", city: "São Paulo", notes: "Cliente premium", createdAt: "2025-01-10T10:00:00Z" },
  { id: "c2", name: "Engenharia Sólida", email: "eng@solida.com.br", phone: "(21) 98765-4321", document: "98.765.432/0001-10", address: "Rua das Laranjeiras, 250", city: "Rio de Janeiro", notes: "", createdAt: "2025-02-15T14:00:00Z" },
  { id: "c3", name: "Roberto Mendes", email: "roberto@email.com", phone: "(31) 97654-3210", document: "123.456.789-00", address: "Rua Belo Horizonte, 80", city: "Belo Horizonte", notes: "Residencial", createdAt: "2025-03-01T09:00:00Z" },
  { id: "c4", name: "Incorporadora Atlas", email: "atlas@atlas.com", phone: "(41) 91234-5678", document: "55.666.777/0001-88", address: "Av. Sete de Setembro, 3000", city: "Curitiba", notes: "Grande porte", createdAt: "2025-04-20T11:00:00Z" },
];

const SEED_WORKS: Work[] = [
  { id: "w1", clientId: "c1", clientName: "Construtora Horizonte", address: "Av. Paulista, 1500 - Torre A", city: "São Paulo", status: "Em execução", description: "Reforma completa do 15º andar comercial", phase1: true, phase2: true, phase3: false, phase4: false, startDate: "2025-01-15", endDate: "", createdAt: "2025-01-15T10:00:00Z", updatedAt: "2025-06-01T10:00:00Z" },
  { id: "w2", clientId: "c1", clientName: "Construtora Horizonte", address: "Rua Augusta, 800", city: "São Paulo", status: "Orçamento", description: "Instalação de piso industrial no galpão", phase1: false, phase2: false, phase3: false, phase4: false, startDate: "", endDate: "", createdAt: "2025-05-20T10:00:00Z", updatedAt: "2025-05-20T10:00:00Z" },
  { id: "w3", clientId: "c2", clientName: "Engenharia Sólida", address: "Rua das Laranjeiras, 250", city: "Rio de Janeiro", status: "Aprovada", description: "Impermeabilização de laje e terraço", phase1: true, phase2: false, phase3: false, phase4: false, startDate: "2025-03-10", endDate: "", createdAt: "2025-03-10T10:00:00Z", updatedAt: "2025-05-15T10:00:00Z" },
  { id: "w4", clientId: "c3", clientName: "Roberto Mendes", address: "Rua Belo Horizonte, 80", city: "Belo Horizonte", status: "Finalizada", description: "Pintura residencial completa - 3 quartos", phase1: true, phase2: true, phase3: true, phase4: true, startDate: "2025-02-01", endDate: "2025-04-30", createdAt: "2025-02-01T10:00:00Z", updatedAt: "2025-04-30T10:00:00Z" },
  { id: "w5", clientId: "c4", clientName: "Incorporadora Atlas", address: "Av. Sete de Setembro, 3000 - Bloco B", city: "Curitiba", status: "Em execução", description: "Revestimento cerâmico áreas comuns", phase1: true, phase2: true, phase3: false, phase4: false, startDate: "2025-04-25", endDate: "", createdAt: "2025-04-25T10:00:00Z", updatedAt: "2025-06-10T10:00:00Z" },
];

const SEED_OS: ServiceOrder[] = [
  { id: "os1", number: 1, clientId: "c1", clientName: "Construtora Horizonte", workId: "w1", city: "São Paulo", executionDate: "2026-02-25T08:00:00Z", address: "Av. Paulista, 1500 - Torre A", description: "Demolição de divisórias e remoção de entulho do 15º andar", considerations: "Usar escada de serviço. Horário permitido: 8h-17h", equipment: ["Martelete", "Carrinho de mão", "EPI completo"], team: ["João", "Patrick", "Raimundo"], status: "Finalizada", createdAt: "2026-02-18T10:00:00Z", updatedAt: "2026-02-26T10:00:00Z", history: [{ date: "2026-02-18T10:00:00Z", action: "OS criada" }, { date: "2026-02-25T08:00:00Z", action: "Status alterado para Em execução" }, { date: "2026-02-26T10:00:00Z", action: "Status alterado para Finalizada" }] },
  { id: "os2", number: 2, clientId: "c1", clientName: "Construtora Horizonte", workId: "w1", city: "São Paulo", executionDate: "2026-02-28T08:00:00Z", address: "Av. Paulista, 1500 - Torre A", description: "Instalação de drywall e acabamento", considerations: "Material já no local. Verificar medidas antes", equipment: ["Parafusadeira", "Nível a laser", "Serra mármore"], team: ["Vinicius", "Gabriel"], status: "Aberta", createdAt: "2026-02-19T10:00:00Z", updatedAt: "2026-02-19T10:00:00Z", history: [{ date: "2026-02-19T10:00:00Z", action: "OS criada" }] },
  { id: "os3", number: 3, clientId: "c2", clientName: "Engenharia Sólida", workId: "w3", city: "Rio de Janeiro", executionDate: "2026-03-05T07:00:00Z", address: "Rua das Laranjeiras, 250", description: "Aplicação de manta asfáltica na laje", considerations: "Previsão de chuva: reagendar se necessário", equipment: ["Maçarico", "Rolo compressor", "Manta asfáltica 4mm"], team: ["João", "Mauricio", "Patrick"], status: "Aberta", createdAt: "2026-02-20T10:00:00Z", updatedAt: "2026-02-20T10:00:00Z", history: [{ date: "2026-02-20T10:00:00Z", action: "OS criada" }] },
  { id: "os4", number: 4, clientId: "c3", clientName: "Roberto Mendes", workId: "w4", city: "Belo Horizonte", executionDate: "2025-04-10T08:00:00Z", address: "Rua Belo Horizonte, 80", description: "Pintura final dos quartos e sala", considerations: "Cliente solicita tinta acetinada branca", equipment: ["Rolo de pintura", "Bandeja", "Fita crepe", "Lona plástica"], team: ["Raimundo", "Gabriel"], status: "Finalizada", createdAt: "2025-04-08T10:00:00Z", updatedAt: "2025-04-12T16:00:00Z", history: [{ date: "2025-04-08T10:00:00Z", action: "OS criada" }, { date: "2025-04-10T08:00:00Z", action: "Status alterado para Em execução" }, { date: "2025-04-12T16:00:00Z", action: "Status alterado para Finalizada" }] },
  { id: "os5", number: 5, clientId: "c4", clientName: "Incorporadora Atlas", workId: "w5", city: "Curitiba", executionDate: "2026-03-01T08:00:00Z", address: "Av. Sete de Setembro, 3000 - Bloco B", description: "Assentamento de porcelanato no hall de entrada", considerations: "Piso nivelado previamente. Usar espaçadores 2mm", equipment: ["Cortadora de piso", "Desempenadeira dentada", "Nível", "Espaçadores"], team: ["Vinicius", "Mauricio", "João"], status: "Em execução", createdAt: "2026-02-15T10:00:00Z", updatedAt: "2026-02-22T10:00:00Z", history: [{ date: "2026-02-15T10:00:00Z", action: "OS criada" }, { date: "2026-02-22T10:00:00Z", action: "Status alterado para Em execução" }] },
  { id: "os6", number: 6, clientId: "c1", clientName: "Construtora Horizonte", workId: "w2", city: "São Paulo", executionDate: "2026-03-10T08:00:00Z", address: "Rua Augusta, 800", description: "Medição e preparação do piso para instalação industrial", considerations: "Galpão sem energia. Levar gerador", equipment: ["Trena a laser", "Gerador portátil", "Lixadeira industrial"], team: ["Patrick", "Raimundo", "Gabriel"], status: "Aberta", createdAt: "2026-02-20T14:00:00Z", updatedAt: "2026-02-20T14:00:00Z", history: [{ date: "2026-02-20T14:00:00Z", action: "OS criada" }] },
];

const SEED_REPORTS: TechnicalReport[] = [
  {
    id: "r1", osId: "os1", workId: "w1", clientName: "Construtora Horizonte",
    team: ["João", "Patrick", "Raimundo"], executionDate: "2026-02-25",
    servicePerformed: "Demolição completa das divisórias do 15º andar. Remoção de 12m³ de entulho. Limpeza geral do pavimento.",
    pendencies: "Aguardando inspeção estrutural antes da próxima etapa.",
    status: "Concluído", needsReturn: false, attachments: [],
    createdAt: "2026-02-26T10:00:00Z", updatedAt: "2026-02-26T10:00:00Z"
  },
  {
    id: "r2", osId: "os4", workId: "w4", clientName: "Roberto Mendes",
    team: ["Raimundo", "Gabriel"], executionDate: "2025-04-10",
    servicePerformed: "Pintura acetinada branca aplicada em 3 quartos e sala. Duas demãos em todas as superfícies. Rodapés e molduras finalizados.",
    pendencies: "Nenhuma pendência.",
    status: "Concluído", needsReturn: false, attachments: [],
    createdAt: "2025-04-12T16:00:00Z", updatedAt: "2025-04-12T16:00:00Z"
  },
  {
    id: "r3", osId: "os5", workId: "w5", clientName: "Incorporadora Atlas",
    team: ["Vinicius", "Mauricio", "João"], executionDate: "2026-03-01",
    servicePerformed: "Assentamento de porcelanato 60x60 no hall de entrada. Área de 45m² concluída. Rejunte parcial realizado.",
    pendencies: "Falta rejuntar 15m² restantes e aplicar protetor de superfície.",
    status: "Pendente", needsReturn: true, attachments: [],
    createdAt: "2026-03-01T17:00:00Z", updatedAt: "2026-03-01T17:00:00Z"
  },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>(() => loadFromStorage("diamond_clients", SEED_CLIENTS));
  const [works, setWorks] = useState<Work[]>(() => loadFromStorage("diamond_works", SEED_WORKS));
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(() => loadFromStorage("diamond_os", SEED_OS));
  const [reports, setReports] = useState<TechnicalReport[]>(() => loadFromStorage("diamond_reports", SEED_REPORTS));

  useEffect(() => { localStorage.setItem("diamond_clients", JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem("diamond_works", JSON.stringify(works)); }, [works]);
  useEffect(() => { localStorage.setItem("diamond_os", JSON.stringify(serviceOrders)); }, [serviceOrders]);
  useEffect(() => { localStorage.setItem("diamond_reports", JSON.stringify(reports)); }, [reports]);

  const addClient = useCallback((data: Omit<Client, "id" | "createdAt">) => {
    const client: Client = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    setClients(prev => [...prev, client]);
    return client;
  }, []);

  const updateClient = useCallback((id: string, data: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  }, []);

  const addWork = useCallback((data: Omit<Work, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const work: Work = { ...data, id: generateId(), createdAt: now, updatedAt: now };
    setWorks(prev => [...prev, work]);
    return work;
  }, []);

  const updateWork = useCallback((id: string, data: Partial<Work>) => {
    setWorks(prev => prev.map(w => {
      if (w.id !== id) return w;
      const updated = { ...w, ...data, updatedAt: new Date().toISOString() };
      // Auto-finalize if all phases complete
      if (updated.phase1 && updated.phase2 && updated.phase3 && updated.phase4) {
        updated.status = "Finalizada";
        if (!updated.endDate) updated.endDate = new Date().toISOString().split("T")[0];
      }
      return updated;
    }));
  }, []);

  const addServiceOrder = useCallback((data: Omit<ServiceOrder, "id" | "number" | "createdAt" | "updatedAt" | "history">) => {
    const now = new Date().toISOString();
    const os: ServiceOrder = {
      ...data,
      id: generateId(),
      number: serviceOrders.length + 1,
      createdAt: now,
      updatedAt: now,
      history: [{ date: now, action: "OS criada" }],
    };
    setServiceOrders(prev => [...prev, os]);
    return os;
  }, [serviceOrders.length]);

  const updateServiceOrderStatus = useCallback((id: string, status: OSStatus) => {
    const now = new Date().toISOString();
    setServiceOrders(prev =>
      prev.map(os =>
        os.id === id
          ? { ...os, status, updatedAt: now, history: [...os.history, { date: now, action: `Status alterado para ${status}` }] }
          : os
      )
    );
  }, []);

  const addReport = useCallback((data: Omit<TechnicalReport, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const report: TechnicalReport = { ...data, id: generateId(), createdAt: now, updatedAt: now };
    setReports(prev => [...prev, report]);
    return report;
  }, []);

  const updateReport = useCallback((id: string, data: Partial<TechnicalReport>) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r));
  }, []);

  const getClientById = useCallback((id: string) => clients.find(c => c.id === id), [clients]);
  const getWorkById = useCallback((id: string) => works.find(w => w.id === id), [works]);
  const getWorksByClient = useCallback((clientId: string) => works.filter(w => w.clientId === clientId), [works]);
  const getOSByClient = useCallback((clientId: string) => serviceOrders.filter(os => os.clientId === clientId), [serviceOrders]);
  const getOSByWork = useCallback((workId: string) => serviceOrders.filter(os => os.workId === workId), [serviceOrders]);
  const getReportByOS = useCallback((osId: string) => reports.find(r => r.osId === osId), [reports]);
  const getReportsByWork = useCallback((workId: string) => reports.filter(r => r.workId === workId), [reports]);

  return (
    <DataContext.Provider value={{
      clients, works, serviceOrders, reports,
      addClient, updateClient,
      addWork, updateWork,
      addServiceOrder, updateServiceOrderStatus,
      addReport, updateReport,
      getClientById, getWorkById, getWorksByClient, getOSByClient, getOSByWork,
      getReportByOS, getReportsByWork,
    }}>
      {children}
    </DataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
