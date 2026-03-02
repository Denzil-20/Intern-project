Task Management API – Backend Developer Assignment
📌 Overview

This project is a Scalable REST API with JWT Authentication and Role-Based Access Control (RBAC), built as part of a Backend Developer Intern assignment.
It includes:
Secure user registration & login
JWT-based authentication
Role-based authorization (USER / ADMIN)
Protected CRUD operation
Ownership enforcement
Input validation
Swagger API documentation
React frontend for API interaction
Modular and scalable architecture

🛠 Tech Stack:
Backend:
Node.js
Express.js
Prisma ORM
SQLite (Development Database)
JWT (Authentication)
Zod (Validation)
Swagger (API Documentation)

Frontend:

React.js

Fetch API

LocalStorage (JWT persistence)

🔐 Authentication & Authorization
Authentication

Password hashing

JWT token generation

Token expiration handling

Bearer token verification middleware

Authorization

Role-based middleware

USER and ADMIN roles

Task ownership enforcement

Only the task owner can:

View

Update

Delete their tasks

Admins can access protected admin routes.

📂 Project Structure
intern-project/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── validations/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
⚙️ Backend Setup Instructions
1️⃣ Navigate to Backend
cd backend
2️⃣ Install Dependencies
npm install
3️⃣ Create Environment File

Create a .env file inside backend:

PORT=5000
JWT_SECRET=your_secret_key
4️⃣ Setup Database (SQLite)
npx prisma migrate dev --name init
5️⃣ Start Backend Server
npm run dev

Server runs at:

http://localhost:5000

Swagger documentation:

http://localhost:5000/api-docs
💻 Frontend Setup Instructions
1️⃣ Navigate to Frontend
cd frontend
2️⃣ Install Dependencies
npm install
3️⃣ Start Frontend
npm start

Frontend runs at:

http://localhost:3000
📚 API Endpoints
Authentication

POST /api/v1/auth/register

POST /api/v1/auth/login

Tasks (Protected)

POST /api/v1/tasks

GET /api/v1/tasks

GET /api/v1/tasks/:id

PUT /api/v1/tasks/:id

DELETE /api/v1/tasks/:id

All task routes require:

Authorization: Bearer <JWT_TOKEN>
🔎 Core Features Implemented

User registration with password hashing

JWT authentication

Role-based access control

Ownership-based task security

CRUD operations for tasks

Structured error handling

Zod input validation

API versioning (/api/v1)

Swagger documentation

React frontend integration

🚀 Scalability Considerations

The backend is structured for scalability:

Modular architecture (controllers, routes, middleware separation)

Stateless JWT authentication (supports horizontal scaling)

Prisma ORM (easy migration to PostgreSQL/MySQL)

API versioning

Centralized middleware structure

Future Production Enhancements

Replace SQLite with PostgreSQL

Add Redis caching

Implement rate limiting

Add centralized logging

Docker containerization

CI/CD pipeline

Load balancing

🔒 Security Practices

Password hashing

JWT validation middleware

Role-based authorization

Task ownership enforcement

Input validation using Zod

Protected routes

📌 Deployment Note

This project runs locally using SQLite for simplicity.
