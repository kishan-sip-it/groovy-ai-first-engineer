<!-- READ THIS FIRST: root navigation is ../../../README.md and exact command map is ../../../RUNBOOK.md. Use the Run / Verify section below for execution. -->

# Day 5 — Student Management CRUD

React frontend + Node/Express API + PostgreSQL.

## Run / Verify

From this directory:

```bash
npm install
npm run install:all
```

1. Create a PostgreSQL database named `student_crud`.
2. Run `backend/schema.sql` against it.
3. Set `DATABASE_URL` in the backend environment.
4. Start the app:

```bash
npm run dev
```

Open:

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:4100/api/health`

Run tests:

```bash
npm test
```

The app supports create, read, update and delete for students.

## Repository navigation

- Global guide: [`../../../README.md`](../../../README.md)
- Execution runbook: [`../../../RUNBOOK.md`](../../../RUNBOOK.md)
- Backend schema: [`backend/schema.sql`](./backend/schema.sql)
