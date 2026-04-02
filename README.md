Finance Dashboard Backend

Overview
This project is a clean, minimal backend for a finance dashboard with role-based access control (RBAC).

Tech Stack
- Node.js
- Express.js
- SQLite (raw SQL queries, no ORM)

Architecture
- Controller -> Service -> Model
- Controllers handle request/response only
- Services contain business logic
- Models handle SQL queries
- Middleware handles RBAC, validation, and errors

Project Structure
- src/config
- src/controllers
- src/services
- src/models
- src/routes
- src/middleware
- src/utils

Why This Structure Works
- Clear ownership by layer (HTTP, business, data)
- Easier testing and refactoring
- No business logic inside controllers

Setup
1. Install dependencies:
   npm install

2. Start in development mode:
   npm run dev

3. Start in production mode:
   npm start

Documentation
- Swagger UI: http://localhost:3000/docs
- Postman collection: postman_collection.json

The SQLite database file finance.db is auto-created on first run, and tables are created automatically if they do not exist.

Roles and Access Control
Role is passed using request header x-role.
Allowed roles: VIEWER, ANALYST, ADMIN

Permissions
- VIEWER: get records only
- ANALYST: get records + dashboard
- ADMIN: full access (users + records + dashboard)

If role header is missing or invalid, request is rejected.
If role does not have permission for an endpoint, response is 403.

Quick Reviewer Checks
- Consistent response shape from all endpoints
- Single flexible filter endpoint for records
- Dashboard calculations are isolated from controllers
- Validation runs before DB writes

API Endpoints
Health
- GET /health

Users (ADMIN only)
- POST /api/users
  Body: { "name": "John", "email": "john@example.com", "role": "VIEWER" }
- GET /api/users
- PATCH /api/users/:id/status
  Body: { "status": "ACTIVE" } or { "status": "INACTIVE" }

Records
- GET /api/records (VIEWER, ANALYST, ADMIN)
  Optional query params (single flexible filter endpoint):
  - type=INCOME|EXPENSE
  - category=Food
  - startDate=2026-01-01
  - endDate=2026-12-31
  - search=salary
  - limit=10
  - offset=20
  Response includes records plus pagination metadata.

- POST /api/records (ADMIN)
  Body: {
    "amount": 1200,
    "type": "INCOME",
    "category": "Salary",
    "date": "2026-04-01",
    "notes": "April salary"
  }

- PUT /api/records/:id (ADMIN)
- DELETE /api/records/:id (ADMIN)

Dashboard (ANALYST, ADMIN)
- GET /api/dashboard/summary
- GET /api/dashboard/categories
- GET /api/dashboard/trends
- GET /api/dashboard/recent
  Category and monthly trend endpoints return one row per category/month with income, expense, and total values.

Validation Rules
- amount: non-negative number
- type: INCOME or EXPENSE
- email: basic email format
- role: VIEWER, ANALYST, ADMIN
- Required fields are validated for create operations
- Empty or malformed request bodies are rejected

Error Response Format
All errors return:
{
  "success": false,
  "message": "Error message"
}

Success Response Pattern
Most successful responses return:
{
  "success": true,
  "message": "Optional success message",
  "data": {}
}

How To Test The API

1. Start the backend
- Run `npm install` once.
- Run `npm start` or `npm run dev`.
- Make sure the server is available at `http://localhost:3000`.

2. Test with Swagger UI
- Open `http://localhost:3000/docs` in your browser.
- Swagger shows all endpoints grouped by Users, Records, Dashboard, and Health.
- For protected routes, click `Authorize` or add the `x-role` header in the request.
- Use one of these values for `x-role`:
  - `VIEWER`
  - `ANALYST`
  - `ADMIN`
- Try the request body examples shown by Swagger.
- Recommended test flow:
  - `POST /api/users` with `x-role: ADMIN`
  - `POST /api/records` with `x-role: ADMIN`
  - `GET /api/records` with `x-role: VIEWER` or higher
  - `GET /api/dashboard/summary` with `x-role: ANALYST` or `ADMIN`

3. Test with Postman or Thunder Client
- Import the file `postman_collection.json`.
- Set the `baseUrl` variable to `http://localhost:3000` if needed.
- The collection already includes example requests for all major endpoints.
- Add the `x-role` header for protected routes:
  - `ADMIN` for user management and record creation/update/delete
  - `VIEWER` for record listing only
  - `ANALYST` for records and dashboard
- Use the saved requests to test both success and failure cases.
- Recommended order:
  - Health check
  - Create user
  - List users
  - Create record
  - List/filter records
  - Update record
  - Delete record
  - Dashboard summary, category breakdown, trends, recent activity

4. Example header setup
- `x-role: ADMIN`
- `Content-Type: application/json`

5. Example request body for record update
{
  "amount": 1500,
  "notes": "Updated amount"
}

Assumptions
- Date is stored as text in YYYY-MM-DD style for simple filtering/grouping.
- Update record supports partial updates.
- User status update allows setting ACTIVE/INACTIVE even if already in that state.

Manual Testing Checklist
1. Create User
- Valid request -> success
- Duplicate email -> error
- Missing fields -> error
- Invalid role -> error

2. Get Users
- No users -> empty array
- Multiple users -> list returned

3. Update User Status
- Valid id -> success
- Invalid id -> not found
- Already inactive -> success

4. Create Record
- Valid request -> success
- Invalid amount -> error
- Invalid type -> error
- Missing fields -> error

5. Get Records + Filter combinations
- No records -> empty array
- With records -> list returned
- Filter only type
- Filter only category
- Filter type + category
- No filters
- Date range only
- Combined date + type/category

6. Update/Delete Record
- Valid id -> success
- Invalid id -> not found

7. Dashboard Edge Cases
- No records: summary zeros, categories empty, trends empty, recent empty
- Only income: expense 0
- Only expense: income 0
- Mixed categories/months: grouped values correct
- Recent records: max 5

8. RBAC
- Missing role header -> reject
- Invalid role header -> reject
- Unauthorized action -> 403
