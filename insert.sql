insert into funcionarios( nome, email, ativo, data_nascimento) values 
('Mauricio', 'mauricio.m@gmail.com', true, '1988-02-03'),
('Gabriel', 'gabriel.m@gmail.com', true, '2006-02-03'),
('Patrick', 'patrick.m@gmail.com', true, '1990-02-03'),
('Vinicius', 'vinicius.m@gmail.com', true, '2000-02-03'),
('Lucas', 'Lucas.m@gmail.com', true, '2004-02-03'),
('João Victor', 'joaovictorvalentim.m@gmail.com', true, '2007-02-13'),
('Neto', 'neto.m@gmail.com', true, '1988-02-03'),
('Mariana', 'mariana.m@gmail.com', true, '2006-02-03'),
('André', 'andre.m@gmail.com', true, '1976-02-03'),
('Jessica', 'jessica@gmail.com', true, '1989-01-23'),
('Dener', 'dener.m@gmail.com', true, '1990-02-03');




select * from funcionarios;

INSERT INTO funcoes (nome, descricao) VALUES
('Vendedor',
 'Responsável pela prospecção de clientes, elaboração de propostas comerciais, negociação de contratos e acompanhamento do pós-venda. Atua na interface entre cliente e empresa, garantindo alinhamento técnico-comercial das soluções ofertadas.'),

('Técnico de Automação',
 'Executa instalação, configuração e manutenção de sistemas de automação residencial, predial ou industrial. Realiza testes funcionais, parametrização de equipamentos, leitura de diagramas elétricos e suporte técnico em campo.'),

('Técnico de Cabeamento',
 'Responsável pela infraestrutura física de redes e sistemas elétricos de baixa tensão, incluindo lançamento, organização e certificação de cabos estruturados, fibra óptica e cabeamento elétrico.'),

('Responsável pelo Estoque',
 'Controla entrada e saída de materiais, realiza inventários periódicos, monitora níveis mínimos de estoque e garante rastreabilidade de equipamentos e insumos utilizados nas obras e ordens de serviço.'),

('Responsável da Equipe Técnica',
 'Coordena a equipe técnica em campo, distribui tarefas, acompanha cronogramas de execução e assegura conformidade técnica e de segurança nas instalações realizadas.'),

('Arquiteta',
 'Desenvolve projetos arquitetônicos e compatibilização com projetos elétricos e de automação. Atua no planejamento de layout técnico, integração de sistemas e acompanhamento de execução conforme normas vigentes.'),

('Financeiro',
 'Responsável pela gestão financeira da empresa, incluindo contas a pagar e receber, controle de fluxo de caixa, emissão de notas fiscais, conciliação bancária e suporte à gestão estratégica.');
 
 insert into funcionario_funcoes(funcionario_id, funcao_id, data_inicio) values
 (1, 2, '2023-02-01'),
 (2, 2, '2023-02-01'),
 (3, 3, '2023-02-01'),
 (4, 3, '2023-02-01'),
 (5, 3, '2023-02-01');
 
 insert into funcionario_funcoes(funcionario_id, funcao_id, data_inicio) values
 (7, 1, '2023-02-01'),
 (8, 1, '2023-02-01'),
 (9, 1, '2023-02-01'),
 (10, 1, '2023-02-01'),
 (21, 5, '2023-02-01'),
 (6, 2, '2023-02-01');
 
 select funcionarios.nome, funcoes.nome from funcionarios 
 inner join funcionario_funcoes on 
 funcionarios.id = funcionario_funcoes.funcionario_id
 inner join funcoes on 
 funcionario_funcoes.funcao_id = funcoes.id;
 
 INSERT INTO clientes (nome, status, vendedor_id) VALUES
('Carlos Eduardo Almeida', 'ativo', 7),
('Construtora Horizonte Ltda', 'ativo', 8),
('Fernanda Souza Ribeiro', 'ativo', 9);

INSERT INTO contatos_cliente (cliente_id, nome, tipo, telefone, email) VALUES
(1, 'Carlos Eduardo Almeida', 'principal', '(16) 99999-1111', 'carlos@email.com'),
(1, 'Mariana Almeida', 'esposa', '(16) 98888-2222', 'mariana@email.com'),

(2, 'Ricardo Mendes', 'diretor', '(16) 97777-3333', 'ricardo@horizonte.com.br'),
(2, 'Departamento Financeiro', 'financeiro', '(16) 96666-4444', 'financeiro@horizonte.com.br'),

(3, 'Fernanda Souza Ribeiro', 'principal', '(16) 95555-5555', 'fernanda@email.com');

INSERT INTO vendas (
    cliente_id,
    vendedor_id,
    responsavel_pos_venda_id,
    data_fechamento,
    valor_fechado,
    descricao_venda,
    status
) VALUES
(1, 1, 7, '2026-02-10', 85000.00,
 'Projeto completo de automação residencial incluindo iluminação, climatização e sistema de segurança.',
 'fechado'),

(2, 1, 8, '2026-02-15', 320000.00,
 'Infraestrutura elétrica e cabeamento estruturado para edifício corporativo.',
 'fechado'),

(3, 2, 9, '2026-02-20', 45000.00,
 'Automação parcial de residência com foco em iluminação e controle via aplicativo.',
 'fechado');
 
 INSERT INTO vendas (
    cliente_id,
    vendedor_id,
    responsavel_pos_venda_id,
    data_fechamento,
    valor_fechado,
    descricao_venda,
    status
) VALUES
(3, 2, 10, '2025-02-20', 50000.00,
 'Automação parcial de residência com foco em iluminação e controle via aplicativo.',
 'aberto');
 
 INSERT INTO obras (
    cliente_id,
    venda_id,
    status,
    descricao,
    data_inicio,
    data_previsao
) VALUES
(1, 1, 'em execução',
 'Execução do projeto de automação residencial conforme escopo contratado.',
 '2026-02-18',
 '2026-04-30'),

(2, 2, 'planejando',
 'Planejamento da infraestrutura elétrica e rede lógica do prédio comercial.',
 '2026-03-01',
 '2026-08-15'),

(3, 3, 'em execução',
 'Instalação de módulos de automação e integração com assistente virtual.',
 '2026-02-25',
 '2026-03-30'); 
 
 INSERT INTO obras (
    cliente_id,
    venda_id,
    status,
    descricao,
    data_inicio,
    data_previsao
) VALUES
(3, 4, 'em execução',
 'Instalação de módulos de automação e integração com assistente virtual.',
 '2025-02-25',
 '2026-06-30');
 
 INSERT INTO enderecos (
    obra_id,
    endereco,
    condominio,
    cidade,
    estado,
    cep
) VALUES
(1, 'Rua das Palmeiras, 245', 'Condomínio Villa Real', 'Araraquara', 'SP', '14800-000'),

(2, 'Av. Empresarial, 1200', 'Centro Comercial Horizonte', 'Ribeirão Preto', 'SP', '14020-000'),

(3, 'Rua João Batista, 78', NULL, 'São Carlos', 'SP', '13560-000');

INSERT INTO historico_ordens_servico(ordem_servico_id, funcionario_id, evento, descricao) VALUES
(3, 21, 'Criação da OS', 'Geração da OS'),
(4, 21, 'Criação da OS', 'Geração da OS');


INSERT INTO telefone_funcionario (funcionario_id, telefone, tipo, principal) VALUES
(1, '(16) 99702-7779', 'celular', TRUE),
(2, '(16) 99608-6281', 'celular', TRUE),
(3, '(32 99835-2324', 'celular', TRUE),
(4, '(16) 99724-6650', 'celular', TRUE),
(5, '(16) 98818-7387', 'celular', TRUE),
(6, '(16) 99729-6585', 'celular', TRUE),
(7, '(16) 99111-1007', 'celular', TRUE),
(8, '(16) 98238-0390', 'celular', TRUE),
(9, '(16) 99132-0450', 'celular', TRUE),
(10, '(16) 99343-0338', 'celular', TRUE),
(21, '(16) 97401-1085', 'celular', TRUE);
