# Day 5 — Student Management CRUD

React frontend + Node/Express API + PostgreSQL.

## Local setup

1. Create a PostgreSQL database named `student_crud`.
2. Run `backend/schema.sql` against it.
3. Set `DATABASE_URL` in the backend environment.
4. From this directory run:

```bash
npm install
npm run install:all
npm run dev
```

Frontend: `http://localhost:5173`
Backend health: `http://localhost:4100/api/health`

The app supports create, read, update and delete for students.
