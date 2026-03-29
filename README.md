# Database Design Overview

## Architecture

The system uses a relational database with two core entities: **Inventory** and **Suppliers**. The schema is designed to ensure data integrity and efficient querying for search and filtering operations.

---

## Entities

### Inventory
Stores product-level data. Each record represents a unique inventory item linked to a supplier.

**Fields:**
- `id` (UUID, Primary Key)
- `supplierId` (Foreign Key → Suppliers.id)
- `product_name` (String, required)
- `quantity` (Integer, ≥ 0)
- `price` (Decimal(10,2), ≥ 0.01)
- `createdAt`, `updatedAt`, `deletedAt` (timestamps with soft delete)

---

### Suppliers
Stores supplier-level data and acts as the parent entity.

**Fields:**
- `id` (UUID, Primary Key)
- `name` (String, required)
- `city` (String, required)
- `createdAt`, `updatedAt`, `deletedAt`

---

## Relationships

- One Supplier → Many Inventory items (One-to-Many)
- `supplierId` in Inventory references `Suppliers.id`

---

## Database Choice

A **SQL (relational database)** was chosen for the following reasons:

- Structured and well-defined schema
- Strong relational mapping between Inventory and Suppliers
- Built-in data integrity via constraints and validations
- Efficient querying with joins and filters (search, price range, etc.)
- Transaction support for reliable operations

NoSQL was not selected because:
- It lacks strong relational consistency
- Joins are inefficient or require manual handling
- Not ideal for structured transactional systems like inventory management

---

## Indexing & Optimization

### Recommended Indexes

- **Composite Index:** `(product_name, price)`
  - Improves performance for search queries with price filtering
  - Reduces full table scans

- **Index on `supplierId`:**
  - Optimizes joins between Inventory and Suppliers

---

## Scalability Considerations

- **UUIDs** ensure uniqueness and support distributed systems
- **Soft deletes (`paranoid`)** prevent permanent data loss
- **Normalized schema** avoids redundancy and improves consistency

---

## Summary

The design focuses on:
- Data integrity through structured schema and constraints  
- Efficient querying via indexing and relational modeling  
- Maintainability with clear entity separation  

This ensures the system performs well for inventory search and management use cases.
