# Inventory Database + APIs

This assignment implements a database-focused inventory API with supplier relationships and grouped inventory results.

## Database schema

### Suppliers

- `id` (UUID, primary key)
- `name` (string, required)
- `city` (string, required)

### Inventory

- `id` (UUID, primary key)
- `supplier_id` (UUID, foreign key)
- `product_name` (string, required)
- `quantity` (integer, required, ≥ 0)
- `price` (decimal, required, > 0)

### Relationship

- One supplier has many inventory items.
- Inventory rows are linked by `supplier_id`.

## Why SQL

I chose SQL because the data model is naturally relational: suppliers and inventory items have a clear one-to-many relationship, and relational constraints help enforce referential integrity. SQL also makes aggregation and sorting operations efficient for queries like "group inventory by supplier and sort by total value."

## API endpoints

### `POST /supplier`

Create a new supplier.

Request body:

```json
{
  "name": "Supplier Name",
  "city": "City Name"
}
```

### `POST /inventory`

Create a new inventory item for an existing supplier.

Request body:

```json
{
  "supplierId": "<supplier-uuid>",
  "product_name": "Product Name",
  "quantity": 10,
  "price": 15.5
}
```

Rules:

- `supplierId` must reference an existing supplier
- `quantity` must be ≥ 0
- `price` must be > 0

### `GET /inventory`

Return all inventory grouped by supplier and sorted by total inventory value (`quantity × price`) in descending order.

Response shape:

```json
[
  {
    "supplier": {
      "id": "...",
      "name": "...",
      "city": "..."
    },
    "inventory": [ ... ],
    "totalValue": 12345.67
  }
]
```

## Running locally

1. Start the backend:
   ```bash
   cd server
   npm install
   npm start
   ```
2. Seed the database with dummy data:
   ```bash
   npm run seed
   ```
3. Start the frontend:
   ```bash
   cd client
   npm install
   npm run dev
   ```

## Optimization suggestion

Add an index on `Inventory.supplier_id` and, if search is added later, on `Inventory.product_name`. This speeds up joining inventory to suppliers and improves query performance for filter and aggregation queries.
