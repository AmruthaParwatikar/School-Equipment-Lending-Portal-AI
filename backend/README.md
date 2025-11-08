
# School Equipment Lending - Backend (Full)

Node.js + Express + MongoDB backend for the School Equipment Lending project.
Includes authentication (JWT), equipment management, loan requests, approvals, and returns.

## Quick start
1. Copy `.env.example` -> `.env` and set values.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start server:
   ```bash
   npm run dev    # if you have nodemon
   # or
   npm start
   ```
4. Server will run on the port in your `.env` (default 4000).

## Available endpoints (prefix /api/v1)
- POST /auth/signup
- POST /auth/login
- GET /equipment
- POST /equipment (admin)
- PUT /equipment/:id (admin)
- DELETE /equipment/:id (admin)
- POST /loans (student requests)
- GET /loans (user or admin view)
- PUT /loans/:id/approve (staff/admin)
- PUT /loans/:id/return (staff/admin)

