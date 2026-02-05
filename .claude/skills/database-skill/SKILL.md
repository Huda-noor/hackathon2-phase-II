---
name: database-skill
description: Design relational database schemas with tables, migrations, and best practices. Use for backend systems and scalable applications.
---

# Database Schema & Migrations

## Instructions

1. **Schema design**
   - Identify entities and relationships
   - Normalize data (up to 3NF where applicable)
   - Define primary and foreign keys

2. **Table creation**
   - Use clear, consistent naming conventions
   - Choose correct data types
   - Add constraints (NOT NULL, UNIQUE, CHECK)

3. **Migrations**
   - Create versioned migration files
   - Separate `up` and `down` logic
   - Ensure migrations are reversible

4. **Indexes & performance**
   - Add indexes on frequently queried columns
   - Avoid over-indexing
   - Use composite indexes where needed

## Best Practices
- Use snake_case for table and column names
- Prefer UUIDs or auto-increment IDs consistently
- Always include timestamps (`created_at`, `updated_at`)
- Never edit old migrations; create new ones
- Test migrations on a staging database first

## Example Structure
```sql
-- users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
