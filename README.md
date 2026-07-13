# SerelepePay – Império Serelepe Bank API

SerelepePay é uma plataforma web que digitaliza uma economia escolar utilizando a moeda digital Serelepe ($e). Este repositório contém o back-end da aplicação, uma API bancária responsável pelo gerenciamento de contas, carteiras, transferências, pagamentos e demais operações financeiras.

## Tech Stack

- Node.js
- Express
- Prisma
- PostgreSQL
- Jest (testes)

## Configuração

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure as variáveis de ambiente:
   ```bash
   cp .env.example.test .env.test
   cp .env.example .env
   ```

## Como rodar os testes

1. Inicie o Docker Compose:
   ```bash
   docker compose up -d
   ```

2. Crie o banco de dados de teste:
   ```bash
   make db-test-create
   ```

3. Prepare o schema do banco de teste:
   ```bash
   npm run db:test:push
   ```

4. Execute os testes:
   ```bash
   make test
   ```

### Comandos úteis

- **Modo watch (desenvolvimento):**
  ```bash
   make test-watch
   ```

- **Resetar banco de teste:**
  ```bash
  make db-test-reset
  ```

- **Setup completo do banco de teste:**
  ```bash
  make db-test-setup
  ```

- **Verificar código com ESLint:**
  ```bash
  make lint
  ```
