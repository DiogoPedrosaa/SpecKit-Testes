# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

O sistema "Tibia Bazaar Clone" é um marketplace educacional de personagens. O plano técnico adota um frontend React+Vite e um backend Node+Fastify+MongoDB. A arquitetura do backend seguirá **estritamente a Arquitetura Hexagonal (Ports & Adapters)**, conforme nova regra da constituição. Isso garante total independência do Domínio e Casos de Uso em relação a frameworks, banco de dados e APIs externas. A testabilidade é maximizada utilizando TDD com Vitest (Unit/Integration) e Playwright (E2E).

## Technical Context

**Language/Version**: TypeScript 5+ (Node.js 20+)

**Primary Dependencies**: React, Vite, Fastify, Zod

**Storage**: MongoDB (via mongodb driver simples)

**Testing**: Vitest (Unit e Integration), Sinon (Mocks), Playwright (E2E)

**Target Platform**: Web Browser / Node.js Backend

**Project Type**: Web Application (Frontend + Backend HTTP API)

**Architecture Requirement**: Hexagonal Architecture (Ports and Adapters)
- **Domain**: Entidades e regras de negócio puras (sem dependências externas).
- **Application/Use Cases**: Fluxos da aplicação. Exigem interfaces (Ports) para comunicação externa.
- **Inbound/Driving Ports**: Interfaces expostas aos Inbound Adapters (ex: Casos de uso).
- **Outbound/Driven Ports**: Interfaces que os Casos de Uso precisam que a infraestrutura implemente (ex: Repositórios, Gateways).
- **Inbound Adapters**: Controladores Fastify/HTTP que traduzem requests e chamam Inbound Ports.
- **Outbound Adapters**: Implementações de Outbound Ports, ex: repositórios que conectam ao MongoDB.

**Constraints**: Dependências MUST apontar para dentro. Nenhum acoplamento HTTP, DB ou de FileSystem no Domínio ou Application.

**Scale/Scope**: Pequena (MVP para estudo)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Hexagonal Architecture (Backend)**: O plano estabelece uma divisão rigorosa em Domínio, Aplicação (Portas) e Adaptadores (In/Out), garantindo que regras de negócio dependam apenas de abstrações.
- [x] **TDD & Testing**: Plano define Vitest para testes isolados e integrados usando dublês de teste para as portas de saída. TDD é mandatório.
- [x] **Code Quality**: MVP evita over-engineering como filas complexas para o fim de leilão, preferindo Cron simplificado em um Adaptador de background.
- [x] **AI Behavior**: Foco nos requisitos da spec; nenhuma nova feature inventada.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── modules/
│   │   ├── users/
│   │   │   ├── domain/                  # Entidades (User, TibiaCoin), Value Objects, Domain Errors
│   │   │   ├── application/             # Use Cases e Ports (In/Out)
│   │   │   │   ├── use-cases/
│   │   │   │   └── ports/               # IUserRepository, ICryptoPort
│   │   │   └── adapters/
│   │   │       ├── inbound/             # HTTP Controllers (Fastify)
│   │   │       └── outbound/            # MongoUserRepository, BcryptAdapter
│   │   └── auctions/
│   │       ├── domain/                  # Character, Auction, Bid
│   │       ├── application/             # Use Cases e Ports (In/Out)
│   │       │   ├── use-cases/
│   │       │   └── ports/               # IAuctionRepository, ICharacterRepository
│   │       └── adapters/
│   │           ├── inbound/             # HTTP Controllers, CronJobs
│   │           └── outbound/            # MongoAuctionRepository
│   ├── shared/                          # Ports genéricos (Logger), Erros Base
│   └── main/                            # Composition Root, DI setup, Fastify App Setup
└── tests/
    ├── integration/                     # Testes dos Adapters e Fluxos
    ├── unit/                            # Testes de Domain e Application
    └── e2e/                             # Testes ponta a ponta

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── adapters/                        # API Clients
└── tests/
```

**Structure Decision**: A estrutura implementa a Arquitetura Hexagonal. Os módulos (users, auctions) expõem seu núcleo (`domain`, `application`) independentemente da tecnologia. Toda tecnologia externa (Fastify, Mongo, Bcrypt) fica isolada na camada `adapters`. O pacote `main` é responsável por instanciar os adaptadores e injetá-los nos casos de uso.

## Complexity Tracking

> **Nenhuma justificativa necessária, pois o uso de Hexagonal Architecture foi imposto pela constituição.**
