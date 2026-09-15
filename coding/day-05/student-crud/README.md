<!-- READ THIS FIRST: root navigation is ../../../README.md and exact command map is ../../../RUNBOOK.md. Use the Run / Verify section below for execution. -->

# Day 5 — Student Management CRUD

React frontend + Node/Express API + PostgreSQL.

## Run / Verify

From this directory:

```bash
npm install
npm run install:all
```

### PostgreSQL setup

The API reads `DATABASE_URL` from `backend/.env`.

Example:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/student_crud
PORT=4100
```

If PostgreSQL is installed locally but not running:

```bash
sudo systemctl start postgresql
```

Create the database, then load the schema:

```bash
sudo -u postgres createdb student_crud 2>/dev/null || true
sudo -u postgres psql -d student_crud -f backend/schema.sql
```

Then start the app:

```bash
npm run dev
```

Open:

- Frontend: `http://localhost:5173` (or the next free Vite port shown in the terminal)
- Backend health: `http://localhost:4100/api/health`

Expected health response:

```json
{"status":"ok","service":"student-crud-api"}
```

Expected browser result: the Student Management table should load the seeded students from `backend/schema.sql`, and Add/Edit/Delete should work without a database connection error.

Run tests:

```bash
npm test
```

The app supports create, read, update and delete for students.

## Extra engineering feature — Search + CSV export

The CRUD app now includes a local search/filter workflow and one-click CSV export of the currently filtered students. This makes the CRUD exercise useful as a small admin workflow rather than only a database demo.

Verify it by creating several students, searching by name/email/course, filtering by course, and clicking **Export CSV**.

## Repository navigation

- Global guide: [`../../../README.md`](../../../README.md)
- Execution runbook: [`../../../RUNBOOK.md`](../../../RUNBOOK.md)
- Backend schema: [`backend/schema.sql`](./backend/schema.sql)
