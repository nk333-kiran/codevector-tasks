# codevector-tasks

# CodeVector Take-Home Assignment

## Project Overview
This project is a scalable product listing backend API built using Node.js, Express.js, and PostgreSQL.  
The system is designed to handle large product datasets efficiently (200,000+ products) while supporting fast pagination and filtering.

The API allows clients to:
- Fetch products in paginated form
- Filter products by category
- Load next pages using cursor-based pagination
- Maintain high performance using database indexing

---

## Tech Stack
- Node.js
- Express.js
- PostgreSQL
- JavaScript

---

## Setup Commands

### Install dependencies
```bash
npm install
```

### Seed database with product data
```bash
npm run seed
```

### Start development server
```bash
npm run dev
```

Server runs at:

```text
http://localhost:5000
```

---

## API Endpoints

### Get Products (First Page)
```http
GET /products
```

Returns first 20 products sorted by newest.

Example:

```text
http://localhost:5000/products
```

---

### Filter Products by Category
```http
GET /products?category=electronics
```

Returns products only from selected category.

Supported categories:
- electronics
- fashion
- books
- sports
- beauty

Example:

```text
http://localhost:5000/products?category=electronics
```

---

### Cursor Pagination (Next Page)
```http
GET /products?cursorTime=<timestamp>&cursorId=<id>
```

Example:

```text
http://localhost:5000/products?cursorTime=2026-06-25T17:32:15.098Z&cursorId=61752
```

This fetches the next page after the last product from the previous response.

---

## Cursor Pagination Explanation

Instead of using OFFSET pagination, this project uses **cursor-based pagination**.

### Why not OFFSET?
OFFSET-based pagination becomes slow for large datasets because the database must scan and skip many rows before returning results.

Problems with OFFSET:
- Slower as data grows
- Can return duplicate rows
- Can miss rows when new data is inserted

### Why Cursor Pagination?
Cursor pagination uses the last product’s:
- `created_at`
- `id`

to fetch the next set of records.

Benefits:
- Faster for large datasets
- Prevents duplicates
- Prevents missing records
- Better scalability for production systems

---

## Database Optimization

Indexes were added for better query performance:

- Composite index on:
  - `created_at`
  - `id`

Used for fast cursor pagination.

- Category index on:
  - `category`

Used for fast filtering.

---

## Conclusion
This implementation provides a scalable backend solution for large product catalogs with efficient pagination, filtering, and optimized database queries.
