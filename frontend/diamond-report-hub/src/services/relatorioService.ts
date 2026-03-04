export interface RelatorioData {
  numero_os: string;
  IDObra: string;
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
  
    // Campos simples (string)
  formData.append("numero_os", dados.numero_os);
  formData.append("id_obra", dados.IDObra);
  formData.append("data_execucao", dados.data_execucao);
  formData.append("cidade", dados.cidade);
  formData.append("servico_executado", dados.servico_executado);
  formData.append("pendencias", dados.pendencias);
  formData.append("status", dados.status);
  formData.append("precisa_retornar", dados.precisa_retornar);

  // Array (equipe)
  dados.equipe.forEach((membro) => {
    formData.append("equipe", membro);
  });

  // Arquivos
  console.log(dados.anexos)
  dados.anexos.forEach((file) => {
    formData.append("anexos", file);
  });

 
  
  // When you have a real API, uncomment below:
  const response = await fetch("http://127.0.0.1:5000/relatorios/n8n", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Erro ao enviar relatório");
  }
  return await response.json();

  return { success: true, message: "Relatório enviado com sucesso" };
}
