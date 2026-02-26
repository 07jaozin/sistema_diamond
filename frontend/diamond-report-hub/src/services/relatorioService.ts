export interface RelatorioData {
  cliente: string;
  equipe: string[];
  data_execucao: string;
  cidade: string;
  servico_executado: string;
  pendencias: string;
  status: string;
  precisa_retornar: string;
  anexos: File[];
}

export async function enviarRelatorio(dados: RelatorioData) {
  const formData = new FormData();
  
  const jsonData = {
    cliente: dados.cliente,
    equipe: dados.equipe,
    data_execucao: dados.data_execucao,
    cidade: dados.cidade,
    servico_executado: dados.servico_executado,
    pendencias: dados.pendencias,
    status: dados.status,
    precisa_retornar: dados.precisa_retornar,
    anexos: [] as string[],
  };

  dados.anexos.forEach((file) => {
    formData.append("anexos", file);
  });

  formData.append("dados", JSON.stringify(jsonData));

 
  
  // When you have a real API, uncomment below:
  const response = await fetch("http://localhost:5678/webhook-test/9345ef9e-ebd0-4b1c-98ef-777bd762321d", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Erro ao enviar relatório");
  }
  return await response.json();

  return { success: true, message: "Relatório enviado com sucesso" };
}
