---
name: backend-skill
description: Generate backend routes, handle HTTP requests/responses, and connect applications to databases.
---

# Backend Routing & Database Integration

## Instructions

1. **Project setup**
   - Initialize backend framework (FastAPI / Express / Django)
   - Configure environment variables
   - Enable CORS and middleware

2. **Routing**
   - Create RESTful routes (GET, POST, PUT, DELETE)
   - Use clear route naming conventions
   - Separate routes into modules/controllers

3. **Request & Response Handling**
   - Validate incoming request data
   - Handle query params, path params, and body
   - Return proper HTTP status codes
   - Send consistent JSON responses

4. **Database Connection**
   - Configure database connection (PostgreSQL / MongoDB / MySQL)
   - Use ORM/ODM (SQLAlchemy, Prisma, Mongoose)
   - Implement CRUD operations
   - Handle connection errors gracefully

5. **Error Handling**
   - Centralized error handler
   - Custom error messages
   - Logging for debugging

## Best Practices
- Follow REST API standards
- Keep business logic out of routes
- Use async/await for DB operations
- Never expose secrets in code
- Validate data before saving
- Use migrations for schema changes

## Example Structure
```js
// routes/user.js
router.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.status(201).json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})
