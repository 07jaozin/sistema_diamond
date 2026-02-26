create database if not exists diamond;

use diamond;

CREATE TABLE funcionarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    ativo BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    
  
);

CREATE TABLE funcionario_enderecos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    funcionario_id INT NOT NULL,
    tipo VARCHAR(50) DEFAULT 'residencial', 
    cep VARCHAR(15),
    rua VARCHAR(150) NOT NULL,
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    pais VARCHAR(50) DEFAULT 'Brasil',

    principal BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);

CREATE TABLE telefone_funcionario(
	id INT AUTO_INCREMENT PRIMARY KEY,
    funcionario_id INT NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    tipo VARCHAR(50),
    principal BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
    
);
CREATE TABLE funcoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE funcionario_funcoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    funcionario_id INT NOT NULL,
    funcao_id INT NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NULL,
    observacao TEXT,

    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id),
    FOREIGN KEY (funcao_id) REFERENCES funcoes(id)
);

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    status VARCHAR(50), 
    vendedor_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (vendedor_id) REFERENCES funcionarios(id)
);

CREATE TABLE contatos_cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    tipo VARCHAR(50), -- principal, esposa, empresa, etc
    telefone VARCHAR(20),
    email VARCHAR(150),

    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
        ON DELETE CASCADE
);


CREATE TABLE vendas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    vendedor_id INT NOT NULL, 
    responsavel_pos_venda_id INT, 
    data_fechamento DATE,
    valor_fechado DECIMAL(12,2),
    descricao_venda TEXT,
    status VARCHAR(50) DEFAULT 'fechado',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (vendedor_id) REFERENCES funcionarios(id),
    FOREIGN KEY (responsavel_pos_venda_id) REFERENCES funcionarios(id)
);

CREATE TABLE obras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    venda_id INT,
    status VARCHAR(50), -- planejando, em execução, finalizada, pausada
    descricao TEXT,
    data_inicio DATE,
    data_previsao DATE,
    data_conclusao DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (venda_id) REFERENCES vendas(id)
);

CREATE TABLE enderecos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    obra_id INT NOT NULL,
    endereco VARCHAR(255),
    condominio VARCHAR(150),
    cidade VARCHAR(150),
    estado VARCHAR(100),
    cep VARCHAR(20),

    FOREIGN KEY (obra_id) REFERENCES obras(id)
        ON DELETE CASCADE
);

CREATE TABLE ordens_servico (
    id INT AUTO_INCREMENT PRIMARY KEY,

    numero_os VARCHAR(50) NOT NULL UNIQUE,
    cliente_id INT NOT NULL,
    obra_id INT NOT NULL,
    venda_id INT NULL,

    data_emissao DATE NOT NULL,
    data_execucao DATE,

    tipo_servico VARCHAR(100),
    descricao_servico TEXT,

    status VARCHAR(50) DEFAULT 'aberta',
    prioridade VARCHAR(50) DEFAULT 'normal',

    observacoes_importantes TEXT,
    informacoes_adicionais TEXT,

    responsavel_tecnico_id INT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (obra_id) REFERENCES obras(id),
    FOREIGN KEY (venda_id) REFERENCES vendas(id),
    FOREIGN KEY (responsavel_tecnico_id) REFERENCES funcionarios(id)
);

CREATE TABLE relatorios_tecnicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    obra_id INT NOT NULL,
    ordem_servico_id INT NOT NULL,
    data_execucao DATE NOT NULL,
    cidade VARCHAR(150),
    descricao_servico TEXT,
    pendencias TEXT,
    avaliacao_ia TEXT,
    status_obra VARCHAR(50),
    precisa_retorno BOOLEAN DEFAULT FALSE,
    data_sugestao_retorno DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (obra_id) REFERENCES obras(id),
    FOREIGN KEY (ordem_servico_id) REFERENCES ordens_servico(id)
);

CREATE TABLE relatorio_funcionarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    relatorio_id INT NOT NULL,
    funcionario_id INT NOT NULL,
    funcao_no_servico VARCHAR(100), -- responsável, auxiliar, etc

    FOREIGN KEY (relatorio_id) REFERENCES relatorios_tecnicos(id)
        ON DELETE CASCADE,
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);


CREATE TABLE documentos (
    id INT AUTO_INCREMENT PRIMARY KEY,

    obra_id INT NULL,
    venda_id INT NULL,
    ordem_servico_id INT NULL,
    relatorio_id INT NULL,

    tipo_documento VARCHAR(100) NOT NULL,
    nome_arquivo VARCHAR(255) NOT NULL,
    url_arquivo VARCHAR(500) NOT NULL,

    mime_type VARCHAR(100),
    tamanho_bytes BIGINT,

    versao INT DEFAULT 1,
    ativo BOOLEAN DEFAULT TRUE,

    criado_por INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE CASCADE,
    FOREIGN KEY (venda_id) REFERENCES vendas(id) ON DELETE CASCADE,
    FOREIGN KEY (ordem_servico_id) REFERENCES ordens_servico(id) ON DELETE CASCADE,
    FOREIGN KEY (relatorio_id) REFERENCES relatorios_tecnicos(id) ON DELETE CASCADE,
    FOREIGN KEY (criado_por) REFERENCES funcionarios(id)
);



CREATE TABLE ordem_servico_itens (
    id INT AUTO_INCREMENT PRIMARY KEY,

    ordem_servico_id INT NOT NULL,
    item_numero INT NOT NULL,

    descricao VARCHAR(255) NOT NULL,
    quantidade DECIMAL(10,2),
    unidade VARCHAR(20), -- un, m, kg, etc

    observacao TEXT,

    FOREIGN KEY (ordem_servico_id) 
        REFERENCES ordens_servico(id)
        ON DELETE CASCADE
);

CREATE TABLE parceiros (
    id INT AUTO_INCREMENT PRIMARY KEY,

    tipo VARCHAR(50) NOT NULL, 
    

    nome VARCHAR(200) NOT NULL,
    documento VARCHAR(30), -- CPF ou CNPJ
    empresa VARCHAR(200),

    cidade VARCHAR(100),
    estado VARCHAR(50),

    ativo BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE parceiro_contatos (
    id INT AUTO_INCREMENT PRIMARY KEY,

    parceiro_id INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    cargo VARCHAR(100), -- comercial, financeiro, assistente
    telefone VARCHAR(20),
    email VARCHAR(150),
    principal BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (parceiro_id) REFERENCES parceiros(id)
        ON DELETE CASCADE
);

CREATE TABLE venda_parceiros (
    id INT AUTO_INCREMENT PRIMARY KEY,

    venda_id INT NOT NULL,
    parceiro_id INT NOT NULL,

    papel VARCHAR(100), 
    -- origem, co-indicação, apoio comercial

    comissao_percentual DECIMAL(5,2),
    comissao_valor DECIMAL(12,2),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (venda_id) REFERENCES vendas(id) ON DELETE CASCADE,
    FOREIGN KEY (parceiro_id) REFERENCES parceiros(id)
);

CREATE TABLE obra_parceiros (
    id INT AUTO_INCREMENT PRIMARY KEY,

    obra_id INT NOT NULL,
    parceiro_id INT NOT NULL,

    papel VARCHAR(100), 
    -- arquiteto responsável, engenheiro estrutural, designer

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE CASCADE,
    FOREIGN KEY (parceiro_id) REFERENCES parceiros(id)
);

CREATE INDEX idx_doc_obra ON documentos(obra_id);
CREATE INDEX idx_doc_venda ON documentos(venda_id);
CREATE INDEX idx_doc_os ON documentos(ordem_servico_id);
CREATE INDEX idx_doc_relatorio ON documentos(relatorio_id);

CREATE INDEX idx_funcionarios_email ON funcionarios(email);
CREATE INDEX idx_funcionarios_ativo ON funcionarios(ativo);

CREATE INDEX idx_func_end_funcionario ON funcionario_enderecos(funcionario_id);
CREATE INDEX idx_func_end_principal ON funcionario_enderecos(principal);
CREATE INDEX idx_func_end_cidade ON funcionario_enderecos(cidade);

CREATE INDEX idx_ff_funcionario_ativo 
ON funcionario_funcoes(funcionario_id, data_fim);

CREATE INDEX idx_clientes_vendedor ON clientes(vendedor_id);
CREATE INDEX idx_clientes_status ON clientes(status);
CREATE INDEX idx_clientes_nome ON clientes(nome);

CREATE INDEX idx_contato_cliente ON contatos_cliente(cliente_id);

CREATE INDEX idx_vendas_cliente ON vendas(cliente_id);
CREATE INDEX idx_vendas_vendedor ON vendas(vendedor_id);
CREATE INDEX idx_vendas_status ON vendas(status);
CREATE INDEX idx_vendas_data ON vendas(data_fechamento);

CREATE INDEX idx_obras_cliente ON obras(cliente_id);
CREATE INDEX idx_obras_venda ON obras(venda_id);
CREATE INDEX idx_obras_status ON obras(status);

CREATE INDEX idx_endereco_obra ON enderecos(obra_id);
CREATE INDEX idx_endereco_cidade ON enderecos(cidade);

CREATE INDEX idx_relatorio_obra ON relatorios_tecnicos(obra_id);
CREATE INDEX idx_relatorio_data ON relatorios_tecnicos(data_execucao);
CREATE INDEX idx_relatorio_status ON relatorios_tecnicos(status_obra);
CREATE INDEX idx_relatorio_retorno ON relatorios_tecnicos(precisa_retorno);

CREATE INDEX idx_rf_relatorio ON relatorio_funcionarios(relatorio_id);
CREATE INDEX idx_rf_funcionario ON relatorio_funcionarios(funcionario_id);

CREATE INDEX idx_doc_tipo ON documentos(tipo_documento);
CREATE INDEX idx_doc_ativo ON documentos(ativo);
CREATE INDEX idx_doc_criado_por ON documentos(criado_por);

CREATE INDEX idx_os_cliente ON ordens_servico(cliente_id);
CREATE INDEX idx_os_obra ON ordens_servico(obra_id);
CREATE INDEX idx_os_status ON ordens_servico(status);
CREATE INDEX idx_os_data_execucao ON ordens_servico(data_execucao);

CREATE INDEX idx_os_itens_ordem ON ordem_servico_itens(ordem_servico_id);

