# E-commerce Test API

API Backend desenvolvida para desafio técnico de e-commerce, construída com Node.js, Express, TypeScript, Drizzle ORM e PostgreSQL.

## 🎯 Requisitos do Desafio

Esta API fornece os endpoints necessários para:

- Exibir detalhes de produtos (foto, nome, preço, descrição)
- Simular preço promocional
- Adicionar produtos ao carrinho
- Visualizar resumo do carrinho com quantidades e subtotais
- Remover itens do carrinho

## 📋 Pré-requisitos

- Node.js (v22.14.0 ou superior)
- PostgreSQL
- pnpm (gerenciador de pacotes)

## 🚀 Como Rodar Localmente

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd e-commerce-test-api
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/ecommerce
PORT=3000
```

### 4. Execute as migrations do banco de dados

```bash
# Gera as migrations baseadas no schema
pnpm generate

# Aplica as migrations no banco
pnpm migrate
```

### 5. Popule o banco com dados iniciais (seed)

```bash
pnpm seed
```

### 6. Inicie o servidor de desenvolvimento

```bash
pnpm dev
```

A API estará disponível em `http://localhost:3000`

## 📡 Endpoints da API

### **Produtos**

#### `GET /api/products/:id`

Retorna dados detalhados de um produto específico.

**Exemplo de resposta:**

```json
{
  "status": "success",
  "data": {
    "id": 2,
    "name": "Notebook Gamer Acer Nitro 5",
    "description": "Notebook gamer potente equipado com processador Intel Core i7...",
    "imageUrl": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
    "priceInCents": 749900,
    "promotionalPriceInCents": 649900,
    "createdAt": "2024-11-26T10:30:00.000Z"
  }
}
```

#### `GET /api/products`

Retorna lista de todos os produtos disponíveis.

---

### **Carrinho**

#### `POST /api/cart/add`

Adiciona um produto ao carrinho.

**Body:**

```json
{
  "productId": 2,
  "quantity": 1
}
```

**Resposta:**

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "cartId": "550e8400-e29b-41d4-a716-446655440000",
    "productId": 2,
    "quantity": 1
  }
}
```

#### `GET /api/cart`

Retorna todos os itens do carrinho com cálculos de preços.

**Resposta:**

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "quantity": 2,
        "product": {
          "id": 2,
          "name": "Notebook Gamer Acer Nitro 5",
          "description": "...",
          "imageUrl": "...",
          "priceInCents": 749900,
          "promotionalPriceInCents": 649900
        },
        "unitPriceInCents": 649900,
        "subtotalInCents": 1299800
      }
    ],
    "totalInCents": 1299800,
    "itemCount": 1
  }
}
```

#### `DELETE /api/cart/:id`

Remove um item específico do carrinho.

**Resposta:**

```json
{
  "status": "success",
  "message": "Item removed from cart"
}
```

---

## 🏗️ Estrutura do Projeto

```
src/
├── controllers/      # Controladores de requisição
│   ├── cart-controller.ts
│   └── product-controller.ts
├── services/        # Lógica de negócio
│   ├── cart-service.ts
│   └── product-service.ts
├── db/              # Configuração do banco
│   ├── index.ts
│   ├── schema.ts    # Schema Drizzle ORM
│   └── seed.ts      # Dados iniciais
├── routes/          # Definição de rotas
│   ├── cart-routes.ts
│   ├── product-routes.ts
│   └── index.ts
├── utils/           # Utilitários
│   ├── env.ts
│   └── errors.ts
└── server.ts        # Entry point
```

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Express.js** - Framework web
- **Drizzle ORM** - ORM type-safe para TypeScript
- **PostgreSQL** - Banco de dados relacional
- **Zod** - Validação de schemas
- **tsx** - Execução de TypeScript

## 💾 Schema do Banco de Dados

### Tabelas

**products**

- `id` (serial, PK)
- `name` (text)
- `description` (text)
- `imageUrl` (text)
- `priceInCents` (integer) - Preço em centavos
- `promotionalPriceInCents` (integer, nullable) - Preço promocional
- `createdAt` (timestamp)

**carts**

- `id` (uuid, PK)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

**cart_items**

- `id` (serial, PK)
- `cartId` (uuid, FK → carts)
- `productId` (integer, FK → products)
- `quantity` (integer, default: 1)

## 📝 Scripts Disponíveis

```bash
pnpm dev          # Inicia servidor em modo desenvolvimento
pnpm build        # Compila o projeto
pnpm start        # Inicia servidor em produção
pnpm generate     # Gera migrations do Drizzle
pnpm migrate      # Aplica migrations no banco
pnpm seed         # Popula banco com dados iniciais
pnpm lint         # Executa linter
```

## 🧪 Testes Automatizados

O projeto utiliza **Vitest** para testes automatizados.

### Executando os testes

```bash
# Executa todos os testes
pnpm test

# Executa testes em modo watch (observação)
pnpm test:watch

# Gera relatório de cobertura de código
pnpm test:coverage
```

### Estrutura de Testes

- **Unitários**: Testam a lógica de negócio nos services (`src/services/*.test.ts`), utilizando mocks do banco de dados.
- **Integração**: Testam os endpoints da API (`src/routes/*.test.ts`), utilizando um banco de dados de teste real.

### Configuração do Banco de Testes

Os testes de integração utilizam um banco de dados separado (definido em `.env.test` ou criado automaticamente como `ecommerce_test`). O setup global (`src/tests/global-setup.ts`) cuida da criação do banco e execução das migrations antes dos testes.

## 🎨 Detalhes de Implementação

### Preços em Centavos

Todos os preços são armazenados em centavos (integer) para evitar problemas de arredondamento com ponto flutuante.

### Preço Promocional

A API prioriza `promotionalPriceInCents` quando disponível, caso contrário usa `priceInCents`.

### Carrinho Global

Para simplificação conforme requisitos do desafio, a API mantém um carrinho global único em memória. Em produção, seria recomendado usar sessões ou autenticação de usuários.

## 📄 Licença

ISC
