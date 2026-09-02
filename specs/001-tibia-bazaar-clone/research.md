# Research & Architectural Decisions

## 1. Arquitetura Geral e Fronteiras
- **Decision**: Arquitetura Hexagonal (Ports & Adapters). O Domínio (Entidades) e a Aplicação (Casos de Uso) não conhecem a Infraestrutura (MongoDB, Fastify). Interfaces (Ports Inbound/Outbound) definem os contratos. Controladores e Repositórios atuam como Adapters.
- **Rationale**: Atende à nova regra da constituição de independência total do domínio em relação a frameworks e bancos de dados. Dependências apontam apenas para dentro.
- **Alternatives considered**: MVC tradicional (rejeitado por acoplar domínio ao framework/banco) ou Clean Architecture completa (simplificada para Hexagonal para o MVP).

## 2. Organização das Pastas e Módulos
- **Decision**: Divisão por Módulos (Feature-based) dentro do backend. Dentro de cada módulo: `domain` (entities), `application` (use-cases, ports), `adapters` (`inbound` para HTTP/CLI, `outbound` para Repositories/Gateways). Uma pasta `main` compõe as dependências (Composition Root).
- **Rationale**: Mantém o código coeso e as fronteiras arquiteturais explícitas.
- **Alternatives considered**: Divisão estrita por camadas genéricas (`src/controllers`, `src/use-cases`), rejeitada por espalhar features.

## 3. Persistência e Banco de Dados (Outbound Adapters)
- **Decision**: Adapters de persistência (MongoDB) implementando os Outbound Ports definidos na camada de Application (ex: `IAuctionRepository`).
- **Rationale**: Isolamento total do DB. O driver do Mongo fica contido apenas nos Adapters.
- **Alternatives considered**: Active Record / Mongoose diretamente nos casos de uso (rejeitado por violar a constituição).

## 4. Estratégia de Autenticação
- **Decision**: JWT (JSON Web Tokens) injetados via Fastify Hooks/Middleware.
- **Rationale**: Stateless, fácil de integrar no frontend React e no Fastify. O caso de uso recebe o `userId` em vez de lidar com tokens.
- **Alternatives considered**: Sessões baseadas em cookies no banco (overhead desnecessário para o MVP educacional).

## 5. Estratégia de Testes
- **Decision**: Vitest para Unitários e Integração. Sinon para mocks e spies. Playwright para E2E (frontend). Testes unitários focam no `domain` e `application` (sem banco). Testes de integração (com testcontainers/mongo em memória) na camada de `infrastructure`.
- **Rationale**: Atende aos requisitos FIRTS e separação de testes especificados na diretriz.
- **Alternatives considered**: Jest (rejeitado pois Vitest foi especificado).

## 6. Estratégia de Tratamento de Erros e Validação
- **Decision**: Classes de Erro de Domínio (ex: `InsufficientBalanceError`). Validação de entrada via Zod no nível do Fastify (Controller/Route) antes de chamar o Use Case.
- **Rationale**: Tratamento explícito de exceções. Evita validações complexas espalhadas no código. 
- **Alternatives considered**: Validação manual com `if/else` (rejeitada por verbosidade).

## 7. Estratégia de Configuração, Logs e Observabilidade
- **Decision**: Variáveis de ambiente (`.env`) validadas no startup via Zod. Logs estruturados usando o `Pino` (padrão do Fastify).
- **Rationale**: Simples e eficiente. `Pino` provê observabilidade básica (logs em JSON).
- **Alternatives considered**: Winston/Morgan ou APMs complexos (rejeitados para evitar over engineering).

## 8. Estratégia de Integração e Sistema de Encerramento (Cron)
- **Decision**: Polling simples ou `node-cron` rodando periodicamente para buscar leilões expirados (`endTime <= now`) e processá-los via um Use Case de encerramento.
- **Rationale**: Simplicidade. Leilões do Tibia não exigem precisão de milissegundos estrita no encerramento (o lock transacional é suficiente para evitar lances pós-data).
- **Alternatives considered**: Filas com SQS/RabbitMQ (over engineering para o MVP educacional).
