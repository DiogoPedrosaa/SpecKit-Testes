# Quickstart & Validation Guide

Este guia valida os cenários fim-a-fim da aplicação (Backend + Frontend).

## Pré-requisitos
- Node.js v20+
- Docker (para subir o MongoDB localmente)
- Playwright instalado (`npx playwright install`)

## Subindo o ambiente local
1. Clone o repositório.
2. Na raiz do backend (`/backend`), copie o `.env.example` para `.env`.
3. Inicie o MongoDB:
   ```bash
   docker-compose up -d
   ```
4. Instale as dependências e inicie o Backend:
   ```bash
   cd backend
   npm install
   npm run build
   npm start
   ```
5. Instale as dependências e inicie o Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Testes Automatizados (Validação Rápida)

Para garantir que a regra de negócio central está funcionando (sem depender de infraestrutura):
```bash
cd backend
npm run test:unit
```
*(Espera-se ver todos os testes dos Casos de Uso passando com cobertura de regras de negócio, como lance mínimo, retenção de saldo e encerramento)*

Para rodar os testes da API e integração com o banco:
```bash
cd backend
npm run test:integration
```

Para validar a UI e o fluxo principal do usuário:
```bash
cd frontend
npm run test:e2e
```

## Cenário Manual de Validação (O Caminho Feliz)
1. Acesse `http://localhost:5173`.
2. Registre o "User A" e adicione 1000 Tibia Coins fictícias no painel.
3. Registre o "User B" e adicione 2000 Tibia Coins fictícias no painel.
4. Como "User A", crie o personagem "Knight Test" e anuncie-o por 500 TC com expiração para daqui a 2 minutos. (Verifique se 50 TC da taxa de criação foram descontadas do User A).
5. Como "User B", acesse a página inicial (deslogado ou logado) e veja o anúncio.
6. Como "User B" (logado), dê um lance de 600 TC. (Verifique se o saldo livre do User B cai para 1400 TC e 600 TC ficam retidas).
7. Espere 2 minutos.
8. Como "User A", recarregue a página ou aguarde o cron job. O leilão deve constar como "Finalizado".
9. Verifique os saldos: "User B" perdeu de vez os 600 TC retidos e agora tem 1400 TC. "User A" recebeu 600 TC - 12% de comissão = 528 TC, totalizando 950 TC + 528 TC = 1478 TC (se o saldo antes do anúncio era 1000).
