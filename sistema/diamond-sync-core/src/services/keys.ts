// services/keys.ts

export const serviceOrderKeys = {
  all: ["ordens_servico"] as const,

  lists: () => [...serviceOrderKeys.all, "list"] as const,

  details: () => [...serviceOrderKeys.all, "detail"] as const,

  detail: (id: number) =>
    [...serviceOrderKeys.details(), id] as const,
};

export const carrosKeys = {
  all: ["carros"] as const,
};

export const obrasKeys = {
  all: ["obras"] as const,
};

export const clientesKeys = {
  all: ["clientes"] as const,
};

export const equipeKeys = {
  all: ["equipe_tecnica"] as const,
};
