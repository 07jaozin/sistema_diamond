import { CarroList, OSStatus, TeamMember, ClientList, ObrasList, Equipe, ServiceOrder, OrdemServico, Funcao } from "@/types";
import { CreateServiceOrderDTO } from "@/types";



const API_BASE_URL = 'http://192.168.15.85:5000';

export interface ApiResponse {
  success: boolean;
  message: string | null;
  data: string[] | null;

}



async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders: HeadersInit = {}
  
  if(!(options.body instanceof FormData)){
      defaultHeaders['Content-Type'] = 'application/json';
  }
 
  const token = localStorage.getItem('auth_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro de conexão' }));
    throw new Error(error.message || 'Erro na requisição');
  }

  return response.json();
}

interface ListResponse<T> {
  success: boolean;
  data: any;
}

export async function listarCarros(): Promise<CarroList[]> {
  try {
    const response = await apiCall<ListResponse<CarroList[]>>('/carros', {
      method: 'GET'
    });

    return response.data;

  } catch (error: any) {
    console.error('Erro ao listar carros:', error.message);
    throw error;
  }
}
export async function listarOS(): Promise<OrdemServico[]> {
  try {
    const response = await apiCall<ListResponse<OrdemServico[]>>('/ordem_servico', {
      method: 'GET'
    });

    return response.data;

  } catch (error: any) {
    console.error('Erro ao listar as ordens de serviços:', error.message);
    throw error;
  }
}
export async function buscarOSId(os_id: number): Promise<OrdemServico> {
  try {
    console.log("os_id_services: ", os_id)
    const response = await apiCall<ListResponse<OrdemServico>>(`/ordem_servico/buscar_os_id/${os_id}`, {
      method: 'GET'
      
    });

    console.log("Response Data buscarOSId: " ,response.data)
    return response.data;

  } catch (error: any) {
    console.error('Erro ao listar as ordem de serviço:', error.message);
    throw error;
  }
}

export async function listarClientes(): Promise<ClientList[]>{
  try{
    const response = await apiCall<ListResponse<ClientList[]>>('/clientes', {
      method: 'GET'
    });

    return response.data;
    
  }catch (error: any) {
    console.error('Erro ao listar clientes:', error.message);
    throw error;
  }
}
export async function listarEquipeTecnica(): Promise<Equipe[]>{
  try{
    const response = await apiCall<ListResponse<Equipe[]>>('/funcionarios/equipe_tecnica', {
      method: 'GET'
    });

    return response.data;
    
  }catch (error: any) {
    console.error('Erro ao listar clientes:', error.message);
    throw error;
  }
}
export async function listarObras(): Promise<ObrasList[]>{
  try{
    const response = await apiCall<ListResponse<ObrasList[]>>('/obras', {
      method: 'GET'
    });

    return response.data;
    
  }catch (error: any) {
    console.error('Erro ao listar clientes:', error.message);
    throw error;
  }
}


export async function CreateServiceOrder(data: CreateServiceOrderDTO): Promise<ApiResponse> {
  try {
    const formData = new FormData();


    formData.append('client_id', String(data.clientId));
    formData.append('client_name', data.clientName);
    formData.append('work_id', String(data.workId));
    formData.append('carro_id', data.carroId !== null ? String(data.carroId) : '');
    formData.append('data_execucao', data.executionDate);
    formData.append('descricao_servico', data.description);
    
    if (data.considerations) {
      formData.append('observacoes_importantes', data.considerations);
    }
    
    if (data.equipment && data.equipment.length > 0) {
      formData.append('equipamentos', JSON.stringify(data.equipment));
    }
    
    if (data.team && data.team.length > 0) {
      formData.append('equipe', JSON.stringify(data.team));
    }
    
    formData.append('status', data.status);
    formData.append('etapa', data.etapa)

    const response = await apiCall<ApiResponse>('/ordem_servico', {
      method: 'POST',
      body: formData,
    });

    return response;
  } catch (error: any) {
    console.error('Erro ao criar ordem de serviço:', error.message);
    throw error;
  }
}

export async function UpdateServiceOrder(
  os_id: number,
  data: CreateServiceOrderDTO
): Promise<ApiResponse> {
  try {
    

    const response = await apiCall<ApiResponse>(`/ordem_servico/${os_id}`, {
     method: 'PUT',
     body: JSON.stringify({
      client_id: data.clientId,
      client_name: data.clientName,
      work_id: data.workId,
      carro_id: data.carroId,
      data_execucao: data.executionDate,
      descricao_servico: data.description,
      observacoes_importantes: data.considerations,
      equipamentos: data.equipment,
      equipe: data.team,
      status: data.status,
      etapa: data.etapa,
  }),
    });

    return response;
    
  } catch (error: any) {
    console.error('Erro ao atualizar ordem de serviço:', error.message);
    throw error;
  }
}

export async function CancelarOS(os_id: number, motivo: string) {
  try{
    const response = await apiCall<ApiResponse>('/ordem_servico/cancelar',{
      method: 'PUT',
      body: JSON.stringify({
        os_id: os_id,
        evento: "Cancelamento",
        observacao: motivo
      })
    })

    return response

  }catch (error: any) {
    console.error('Erro ao listar clientes:', error.message);
    throw error;
  }
}
export async function ObservacaoOS(os_id: number, observacao: string) {
  try{
    const response = await apiCall<ApiResponse>('/ordem_servico/observacao',{
      method: 'POST',
      body: JSON.stringify({
        os_id: os_id,
        evento: "Observação",
        observacao: observacao
      })
    })

    return response

  }catch (error: any) {
    console.error('Erro ao listar clientes:', error.message);
    throw error;
  }
}
export async function enviarOS(os_id: number) {
  try{
    const response = await apiCall<ApiResponse>('/ordem_servico/enviar_os',{
      method: 'POST',
      body: JSON.stringify(os_id)
    })

    return response

  }catch (error: any) {
    console.error('Erro ao enviar a OS:', error.message);
    throw error;
  }
}

export async function listarFuncoes(): Promise<Funcao[]>{
  try{
    const response = await apiCall<ListResponse<Funcao[]>>('/funcoes', {
      method: 'GET'
    });

    return response.data;
  }catch (error: any) {
    console.error('Erro ao listar funcoes:', error.message);
    throw error;
  }
}