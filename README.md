# E-commerce Test API

Backend API developed for an e-commerce technical challenge, built with Node.js, Express, TypeScript, Drizzle ORM, and PostgreSQL.

## 🎯 Challenge Requirements

This API provides the necessary endpoints to:

- Display product details (photo, name, price, description)
- Simulate promotional pricing
- Add products to the cart
- View cart summary with quantities and subtotals
- Remove items from the cart

## 📋 Prerequisites

- Node.js (v22.14.0 or higher)
- PostgreSQL
- pnpm (package manager)

## 🚀 How to Run Locally

### 1. Clone the repository

```bash
git clone <your-repository>
cd e-commerce-test-api
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
PORT=3000
```

### 4. Run database migrations

```bash
# Generate migrations based on schema
pnpm generate

# Apply migrations to the database
pnpm migrate
```

### 5. Seed the database with initial data

```bash
pnpm seed
```

### 6. Start the development server

```bash
pnpm dev
```

The API will be available at `http://localhost:3000`

## 📡 API Endpoints

### **Products**

#### `GET /api/products/:id`

Returns detailed data of a specific product.

**Response Example:**

```json
{
  "status": "success",
  "data": {
    "id": 2,
    "name": "Notebook Gamer Acer Nitro 5",
    "description": "Powerful gaming notebook equipped with Intel Core i7 processor...",
    "imageUrl": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
    "priceInCents": 749900,
    "promotionalPriceInCents": 649900,
    "createdAt": "2024-11-26T10:30:00.000Z"
  }
}
```

#### `GET /api/products`

Returns a list of all available products.

---

### **Cart**

#### `POST /api/cart/add`

Adds a product to the cart.

**Body:**

```json
{
  "productId": 2,
  "quantity": 1
}
```

**Response:**

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

Returns all items in the cart with price calculations.

**Response:**

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

Removes a specific item from the cart.

**Response:**

```json
{
  "status": "success",
  "message": "Item removed from cart"
}
```

---

## 🏗️ Project Structure

```
src/
├── controllers/      # Request controllers
│   ├── cart-controller.ts
│   └── product-controller.ts
├── services/        # Business logic
│   ├── cart-service.ts
│   └── product-service.ts
├── db/              # Database configuration
│   ├── index.ts
│   ├── schema.ts    # Drizzle ORM Schema
│   └── seed.ts      # Initial data
├── routes/          # Route definitions
│   ├── cart-routes.ts
│   ├── product-routes.ts
│   └── index.ts
├── utils/           # Utilities
│   ├── env.ts
│   └── errors.ts
└── server.ts        # Entry point
```

## 🛠️ Technologies Used

- **Node.js** - JavaScript Runtime
- **TypeScript** - Typed superset of JavaScript
- **Express.js** - Web framework
- **Drizzle ORM** - Type-safe ORM for TypeScript
- **PostgreSQL** - Relational database
- **Zod** - Schema validation
- **tsx** - TypeScript execution

## 💾 Database Schema

### Tables

**products**

- `id` (serial, PK)
- `name` (text)
- `description` (text)
- `imageUrl` (text)
- `priceInCents` (integer) - Price in cents
- `promotionalPriceInCents` (integer, nullable) - Promotional price
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

## 📝 Available Scripts

```bash
pnpm dev          # Starts server in development mode
pnpm build        # Compiles the project
pnpm start        # Starts server in production
pnpm generate     # Generates Drizzle migrations
pnpm migrate      # Applies migrations to the database
pnpm seed         # Seeds database with initial data
pnpm lint         # Runs linter
```

## 🧪 Automated Tests

The project uses **Vitest** for automated testing.

### Running tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate code coverage report
pnpm test:coverage
```

### Test Structure

- **Unit**: Tests business logic in services (`src/services/*.test.ts`), using database mocks.
- **Integration**: Tests API endpoints (`src/routes/*.test.ts`), using a real test database.

### Test Database Configuration

Integration tests use a separate database (defined in `.env.test` or automatically created as `ecommerce_test`). The global setup (`src/tests/global-setup.ts`) handles database creation and migration execution before tests.

## 🎨 Implementation Details

### Prices in Cents

All prices are stored in cents (integer) to avoid floating-point rounding issues.

### Promotional Price

The API prioritizes `promotionalPriceInCents` when available, otherwise uses `priceInCents`.

### Global Cart

For simplification as per challenge requirements, the API maintains a single global cart in memory. In production, it would be recommended to use sessions or user authentication.

## 📄 License

ISC
