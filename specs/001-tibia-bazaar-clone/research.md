# Research & Architectural Decisions

## 1. Arquitetura Geral e Fronteiras
- **Decision**: Arquitetura em Camadas (Hexagonal/Clean Architecture simplificada). O Domínio (Entidades e Casos de Uso) não conhece a Infraestrutura (MongoDB, Fastify). Interfaces (Ports) definem os contratos.
- **Rationale**: Atende ao requisito "Separar claramente regras de negócio de infraestrutura" e "Regras de negócio não devem depender de MongoDB ou HTTP".
- **Alternatives considered**: MVC tradicional (rejeitado por acoplar domínio ao framework/banco).

## 2. Organização das Pastas e Módulos
- **Decision**: Divisão por Módulos (Feature-based) dentro do backend. Estrutura: `src/modules/[module]/`. Dentro de cada módulo: `domain` (entities), `application` (use-cases, interfaces), `infrastructure` (repositories, controllers, routes).
- **Rationale**: Mantém o código coeso. Funcionalidades de leilão ficam num módulo `auction`, usuários no módulo `user`.
- **Alternatives considered**: Divisão por camada (`src/controllers`, `src/use-cases`), rejeitada por espalhar as features pelo projeto.

## 3. Persistência e Banco de Dados
- **Decision**: Repositórios (Repository Pattern) encapsulando o MongoDB.
- **Rationale**: Isolamento. Os casos de uso chamam `IUserRepository`, e a implementação `MongoUserRepository` lida com o driver do Mongo. 
- **Alternatives considered**: Active Record / Mongoose diretamente nos casos de uso (rejeitado por violar a independência de infra).

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
