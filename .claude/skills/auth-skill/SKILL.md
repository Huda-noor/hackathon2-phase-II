---
name: auth-skill
description: Implement secure authentication including signup, signin, password hashing, JWT tokens, and Better Auth integration.
---

# Authentication Skill

## Instructions

1. **User Signup**
   - Accept email/username and password
   - Validate input (email format, password length)
   - Hash passwords before storing
   - Prevent duplicate accounts

2. **User Signin**
   - Verify user credentials
   - Compare hashed passwords
   - Return authentication token on success
   - Handle invalid credentials gracefully

3. **Password Security**
   - Use strong hashing algorithms (bcrypt / argon2)
   - Never store plain text passwords
   - Use proper salt rounds
   - Support password reset flow

4. **JWT Authentication**
   - Generate JWT on successful signin
   - Include user ID and role in payload
   - Set token expiration
   - Verify JWT on protected routes

5. **Better Auth Integration**
   - Configure Better Auth provider
   - Support email & password authentication
   - Enable session handling
   - Integrate middleware for route protection

## Best Practices
- Always hash passwords
- Use environment variables for secrets
- Set short-lived access tokens
- Use refresh tokens if needed
- Protect sensitive routes with middleware
- Return clear but secure error messages

## Example Structure
```ts
// Signup
POST /auth/signup

// Signin
POST /auth/signin

// Protected route
GET /profile
Authorization: Bearer <JWT_TOKEN>
