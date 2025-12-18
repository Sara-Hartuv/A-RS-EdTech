# A-RS-EdTech Copilot Instructions

## Project Overview
Achievement/reward system for educational institutions. Students earn points/vouchers and redeem products. Teachers manage students and approve orders.

## Architecture

### Backend (Express + TypeScript + MongoDB)
**4-layer pattern:** Controller → Service → Repository → Model

**Critical patterns:**
- Controllers: `Promise<void>`, call `res.status().json()` directly, validate inputs
- Services: Business logic, throw user-friendly errors
- Repositories: MongoDB queries via Mongoose
- Password field: `password` (hidden except in `findUserByPhoneWithPassword()`)
- Auth: JWT in `Authorization: Bearer <token>` header
- Imports: Always use `* as` pattern for services/repositories

### Frontend (React + TypeScript + Vite + Zustand)
- Zustand with persist → `localStorage` key `auth-storage`
- Token auto-injected via axios interceptor (`api/api.ts`)
- React Router + role-based `ProtectedRoute` component
- Routes: `/login`, `/student`, `/teacher`, `/products`

## Domain Models
- **User**: Roles (`student`/`teacher`/`admin`), `students: ObjectId[]`, `points`/`vouchers`/`bubbleVouchers`, soft delete via `status`
- **Product**: `category: ObjectId`, `costInVouchers`, `stock`, `purchasesCount`, soft delete via `isActive`
- **Order**: Status flow `draft` → `pendingApproval` → `approved` → `delivered`
- **Idea**: Student suggestions, status `pending` → `reviewed` → `approved/rejected`, `seen` flag

## Dev Commands
```bash
# Backend: npm run dev (port 5000) | npm run build | npm start
# Frontend: npm run dev (port 5173) | npm run build | npm run lint
```

## Auth Flow
1. POST `/api/users/login` → `{ user, token }`
2. Zustand persists to localStorage
3. Axios interceptor adds `Authorization: Bearer <token>`
4. Middleware `authenticate` verifies JWT → `req.user = { userId, role }`
5. `authorize(...roles)` checks permissions

## Critical Conventions
- **Imports**: `import * as userService from '../services/user.service';`
- **Error handling**: Services throw errors, controllers catch & map to status codes
- **Validation**: Check required fields in controllers, validate ObjectId with `mongoose.Types.ObjectId.isValid()`
- **Auth utils**: Use `hashPassword`, `comparePassword`, `generateToken`, `verifyToken` from `auth.utils.ts`
- **Frontend**: Pages in `pages/`, components in `components/`, types in `types/`, TailwindCSS styling
- **Env**: Backend needs `MONGO_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`. Frontend API: `http://localhost:5000/api`

## Common Patterns

**New entity**: Model → Repository → Service → Controller → Routes → Register in `routes/index.ts`

**Role-based access**:
```typescript
// Backend: router.get('/', authenticate, authorize('teacher', 'admin'), controller.getAll);
// Frontend: <ProtectedRoute allowedRoles={['teacher', 'admin']}><Page /></ProtectedRoute>
```

## Development Principles

### 1. No Code Without Understanding the Design
Before any feature: write briefly what the system needs to do, who the user is, what rules apply, and what flows exist. If not defined — don't start coding.

### 2. Work in Fixed Layers Only
- **Controller** — responsible only for Input/Output, no business logic
- **Service Layer** — contains Business Logic and Rules
- **Repository** — responsible for database queries only
- **No layer skipping allowed**

### 3. Business Logic Centralized — Not Scattered
Every business rule must be in one place only — in the Service layer. Logic is not dependent on UI or API.
## Development Principles

1. **No Code Without Design** - Define feature, actors, flows, edge cases before coding
2. **Fixed Layers Only** - Controller (I/O) → Service (logic) → Repository (DB). No skipping
3. **Centralized Logic** - All business rules in Service layer only
4. **Mandatory Refactor** - After feature works: improve names, split functions, remove duplication
5. **Security First** - Secrets in ENV, token verified via middleware, validate all inputs
6. **System for Others** - Clear names, separated modules, consistent structure, brief docs
7. **Ownership Mindset** - Ask: Is it clear? Maintainable? Consistent? Understandable?
8. **Consistency** - Same patterns for validation, permissions, layer calls. Document exceptions
9. **Continuous Improvement** - Each feature leaves system better (names, structure, logic, docs)

## Notes
- Backend: CommonJS | Frontend: ES modules
- **CRITICAL: English only - Hebrew comments strictly forbidden**
- Soft deletes: `status: false` or `isActive: false`