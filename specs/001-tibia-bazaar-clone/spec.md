# Feature Specification: Tibia Bazaar Clone

**Feature Branch**: `N/A`

**Created**: 2026-08-31

**Status**: Draft

**Input**: User description: "$ARGUMENTS"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Autenticação e Gestão de Conta (Priority: P1)

Como um jogador, eu quero me cadastrar no sistema e gerenciar meu saldo fictício de Tibia Coins para poder participar dos leilões (comprando ou vendendo).

**Why this priority**: Sem usuários e saldo fictício, o sistema de leilão não tem atores para funcionar.

**Independent Test**: Pode ser testado registrando um usuário, fazendo login e visualizando a interface da conta.

**Acceptance Scenarios**:

1. **Given** um visitante não logado, **When** ele preenche o formulário de cadastro com dados válidos, **Then** a conta é criada e ele é redirecionado para a área logada.
2. **Given** um usuário logado, **When** ele acessa a área da conta e adiciona moedas virtuais fictícias, **Then** o saldo do usuário é incrementado de acordo.

---

### User Story 2 - Cadastro e Listagem de Personagens (Priority: P1)

Como um usuário, eu quero cadastrar personagens que possuo e visualizar uma listagem geral de personagens em leilão no sistema, para poder colocar os meus à venda ou buscar personagens para comprar.

**Why this priority**: É o core business do sistema; o marketplace não existe sem os "produtos" (personagens).

**Independent Test**: Pode ser testado cadastrando personagens via painel do usuário e acessando a listagem pública sem precisar da lógica complexa de lances num primeiro momento.

**Acceptance Scenarios**:

1. **Given** um usuário logado, **When** ele submete as informações de um personagem (nome, nível, vocação), **Then** o personagem é salvo e vinculado à sua conta.
2. **Given** um usuário qualquer (visitante ou logado), **When** ele acessa a página principal, **Then** ele visualiza uma lista paginada/ordenada de todos os anúncios ativos no momento.

---

### User Story 3 - Criação e Encerramento de Anúncio (Priority: P2)

Como um vendedor, eu quero criar um anúncio para o meu personagem definindo preço inicial e data de fim, e quero que o leilão finalize automaticamente na data estipulada.

**Why this priority**: É o que transforma os personagens cadastrados em itens negociáveis no leilão.

**Independent Test**: Pode ser testado criando o anúncio, avançando o tempo do sistema e checando se o status mudou para finalizado.

**Acceptance Scenarios**:

1. **Given** um usuário logado dono de um personagem não anunciado, **When** ele cria um leilão informando lance mínimo e data de encerramento, **Then** o anúncio fica com status ativo e visível na listagem pública.
2. **Given** um leilão ativo, **When** a data/hora atual ultrapassa a data/hora de encerramento estipulada, **Then** o sistema altera o status do anúncio para finalizado (com ou sem vencedor, dependendo dos lances).

---

### User Story 4 - Sistema de Lances e Débito (Priority: P2)

Como um comprador, eu quero dar lances em anúncios ativos usando meu saldo de Tibia Coins, sendo informado imediatamente se meu lance é o vencedor atual, e sendo debitado apenas se eu ganhar no final.

**Why this priority**: É a mecânica principal do leilão em si (bidding).

**Independent Test**: Pode ser testado dando um lance em um leilão criado, checando validação de saldo e o histórico de lances.

**Acceptance Scenarios**:

1. **Given** um usuário com saldo suficiente, **When** ele tenta dar um lance em um leilão que seja superior ao preço mínimo ou ao lance atual, **Then** o sistema registra o lance, atualiza o maior lance do anúncio e retém (bloqueia) essa quantia do saldo do usuário.
2. **Given** um leilão que foi encerrado com sucesso, **When** o sistema processa o encerramento, **Then** o vencedor tem suas moedas virtuais retidas efetivamente debitadas, e o vendedor recebe o valor.
3. **Given** um usuário que deu um lance e foi superado por outro (overbid), **When** o novo lance é registrado, **Then** as moedas retidas do primeiro usuário são devolvidas ao seu saldo livre.

---

### User Story 5 - Histórico e Visualização Detalhada (Priority: P3)

Como um usuário, eu quero ver os detalhes completos de um anúncio específico e consultar meus históricos de participação (anúncios criados e lances efetuados), para ter controle das minhas negociações.

**Why this priority**: Melhora a usabilidade e a rastreabilidade da conta, mas não impede as transações principais de ocorrerem (MVP pode sobreviver temporariamente sem históricos super complexos).

**Independent Test**: Pode ser testado acessando o painel de histórico após realizar algumas ações de lance/venda e verificando as informações.

**Acceptance Scenarios**:

1. **Given** um anúncio qualquer, **When** um usuário clica para ver detalhes, **Then** é exibida uma página com todas as informações do personagem, do leilão e o histórico de lances (sem identificar os compradores publicamente, se for a regra do Tibia).
2. **Given** um usuário logado que participou de leilões, **When** ele acessa seu painel, **Then** ele vê uma lista dos seus lances e anúncios criados.

### Edge Cases

- O que acontece se dois usuários tentarem dar um lance no mesmo microssegundo (race condition)? O sistema deve processar serialmente e aceitar apenas o primeiro, rejeitando o segundo com mensagem de erro se o lance atualizado o tornar inválido, ou bloqueio otimista de concorrência.
- Como o sistema lida com o encerramento de um leilão que não recebeu nenhum lance? O leilão deve mudar para "Finalizado sem lances" e o personagem deve ficar livre para um novo anúncio no futuro.
- O que acontece se o usuário tentar criar um anúncio para um personagem que já está em um leilão ativo? O sistema deve impedir a criação e retornar um erro de validação.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE permitir cadastro, login e logout de usuários.
- **FR-002**: O sistema DEVE manter um saldo de "Tibia Coins" para cada usuário (sistema fictício de moedas, podendo ser incrementado de forma simulada/mockada na área logada).
- **FR-003**: O sistema DEVE permitir que um usuário cadastre personagens (nome, nível, vocação) informando que pertencem a ele.
- **FR-004**: O sistema DEVE permitir a criação de um anúncio (leilão) para um personagem inativo (sem leilão aberto), exigindo um preço mínimo e uma data/hora de encerramento futuro válido.
- **FR-005**: O sistema DEVE listar todos os leilões ativos numa área pública.
- **FR-006**: O sistema DEVE validar e aceitar lances apenas se o usuário logado tiver saldo livre de Tibia Coins maior ou igual ao valor do lance.
- **FR-007**: O sistema DEVE rejeitar lances que sejam menores ou iguais ao maior lance atual.
- **FR-008**: O sistema DEVE bloquear/reter temporariamente o saldo do usuário ao dar um lance vencedor atual (maior lance), para garantir a liquidez no encerramento.
- **FR-009**: O sistema DEVE liberar o saldo retido do usuário cujo lance foi superado (overbid) por um lance maior de outro usuário.
- **FR-010**: O sistema DEVE encerrar leilões automaticamente quando a data/hora atual atingir a data/hora de encerramento do anúncio.
- **FR-011**: O sistema DEVE transferir os Tibia Coins retidos do vencedor para o saldo livre do vendedor (criador do anúncio) no momento do encerramento com sucesso do leilão.
- **FR-012**: O sistema DEVE exibir o histórico de lances na página de detalhes de cada anúncio.
- **FR-013**: O sistema DEVE prover uma visão de histórico na conta do usuário mostrando leilões participados e personagens vendidos/anunciados.
- **FR-014**: O sistema DEVE replicar ao máximo o estilo visual (UI/UX) do site tibia.com na sua seção Char Bazaar, adotando paletas de cores, tipografia e layout similares (Requisito Não Funcional transposto como meta visual).

- **FR-015**: O leilão não prorroga tempo no fim (Sem anti-snipe). Termina estritamente na data e hora estipuladas.
- **FR-016**: A listagem de lances de um leilão é totalmente anônima, protegendo a identidade dos compradores.
- **FR-017**: É cobrada do vendedor uma taxa fixa de criação (Ex: 50 TC) que requer saldo prévio e não é reembolsada, além de uma comissão percentual fixa (Ex: 12%) descontada do valor final da venda no encerramento.

### Key Entities

- **Usuário (User)**: ID, Nome, Email, Senha(Hash), SaldoLivre (Tibia Coins disponíveis), SaldoRetido (Tibia Coins bloqueadas em lances ativos).
- **Personagem (Character)**: ID, Nome, Nivel, Vocacao, UsuarioID (dono).
- **Anuncio (Auction)**: ID, PersonagemID, VendedorID, PrecoMinimo, MaiorLanceAtual, VencedorAtualID, DataFim, Status (Ativo, FinalizadoVendido, FinalizadoSemLances, Cancelado).
- **Lance (Bid)**: ID, AnuncioID, UsuarioID (comprador), Valor, DataHoraCriacao.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O sistema permite a submissão e visualização de lances com atualização imediata de estado na interface do usuário.
- **SC-002**: Lances simultâneos são processados serialmente, mantendo a integridade transacional do saldo e lances em 100% dos testes.
- **SC-003**: 100% dos leilões expirados são transicionados corretamente para estados finalizados por workers ou trigger de acesso.
- **SC-004**: A interface visual passa em checklist de similaridade (cores, fontes, estruturação) com o Char Bazaar original em uma avaliação visual subjetiva.

## Assumptions

- Assumimos que a validação de e-mail e envio de notificações não é estritamente necessária no MVP educacional e será mockada/ignorada.
- Assumimos que o gerenciamento de saldo fictício (Tibia Coins) terá um endpoint simplificado de "Adicionar Saldo" para facilitar testes, sem qualquer gateway de pagamento real.
- Assumimos que a concorrência no momento de registrar o lance usará mecanismos de banco de dados (como transações ou lock otimista) para evitar que a mesma moeda virtual seja gasta duas vezes.
- Assumimos que "encerramento do anúncio" pode ser feito via Job programado que roda frequentemente, não precisando ter exatidão absoluta de milissegundos.
