# Data Model: Security, Testing & Deployment for Todo Web Application

## Overview
This document defines the data models for the security, testing, and deployment features of the Todo Web Application, based on the key entities identified in the feature specification.

## User Entity
Represents an authenticated user with unique identifier, authentication tokens, and associated tasks

**Fields:**
- id: UUID (primary key, unique identifier)
- username: String (unique, 3-50 characters)
- email: String (unique, valid email format)
- hashed_password: String (securely hashed password)
- created_at: DateTime (timestamp of account creation)
- updated_at: DateTime (timestamp of last update)
- is_active: Boolean (whether account is active)

**Relationships:**
- One-to-many with Task (user owns many tasks)

**Validation rules:**
- Username must be 3-50 alphanumeric characters plus underscores/hyphens
- Email must be valid email format
- Password must meet complexity requirements before hashing
- User must be active to perform operations

## Task Entity
Represents a task entity owned by a specific user, with properties like title, description, status, and timestamps

**Fields:**
- id: UUID (primary key, unique identifier)
- title: String (required, 1-100 characters)
- description: String (optional, up to 1000 characters)
- status: Enum ('pending', 'in-progress', 'completed')
- owner_id: UUID (foreign key referencing User.id)
- created_at: DateTime (timestamp of task creation)
- updated_at: DateTime (timestamp of last update)
- due_date: DateTime (optional, deadline for task)

**Relationships:**
- Many-to-one with User (many tasks belong to one user)

**Validation rules:**
- Title is required and must be 1-100 characters
- Owner_id must reference an existing active user
- Status must be one of the allowed enum values
- Due date cannot be in the past (if set)

## JWT Token
Represents a JSON Web Token containing user identity and authorization claims with expiration

**Fields:**
- sub: String (subject - user identifier)
- exp: Integer (expiration timestamp)
- iat: Integer (issued at timestamp)
- jti: String (JWT ID for revocation tracking - optional)

**Validation rules:**
- Token must not be expired at time of validation
- Signature must be valid against stored secret
- Subject must correspond to an existing active user

## Environment Configuration
Represents a collection of environment-specific variables including database URLs, API keys, and service endpoints

**Fields:**
- database_url: String (connection string for database)
- secret_key: String (secret for JWT signing/verification)
- algorithm: String (algorithm for JWT encoding, default: "HS256")
- access_token_expire_minutes: Integer (token validity duration)
- environment: String (environment name: dev, staging, prod)
- debug: Boolean (enable/disable debug mode)

**Validation rules:**
- database_url must be a valid database connection string
- secret_key must meet minimum length requirements (recommended: 32+ characters)
- access_token_expire_minutes must be positive integer
- environment must be one of allowed values (dev, staging, prod)

## State Transitions

### Task Status Transitions
- pending → in-progress (when user starts working on task)
- in-progress → pending (when user pauses work)
- in-progress → completed (when user finishes task)
- completed → in-progress (when user needs to reopen task)

### User Account States
- inactive → active (during account creation/activation)
- active → inactive (during account deactivation/deletion)