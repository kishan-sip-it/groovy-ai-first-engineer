import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;
const app = express();
const port = Number(process.env.PORT || 4100);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/student_crud'
});

app.use(cors());
app.use(express.json());

const validateStudent = (body) => {
  const name = String(body?.name || '').trim();
  const email = String(body?.email || '').trim().toLowerCase();
  const course = String(body?.course || '').trim();
  const year = Number(body?.year);
  if (!name || !email || !course || !Number.isInteger(year) || year < 1 || year > 6) return null;
  return { name, email, course, year };
};

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'student-crud-api' }));

app.get('/api/students', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM students ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/students', async (req, res) => {
  const student = validateStudent(req.body);
  if (!student) return res.status(400).json({ error: 'Valid name, email, course and year are required.' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO students(name,email,course,year) VALUES($1,$2,$3,$4) RETURNING *',
      [student.name, student.email, student.course, student.year]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(error.code === '23505' ? 409 : 500).json({ error: error.code === '23505' ? 'Email already exists.' : error.message });
  }
});

app.put('/api/students/:id', async (req, res) => {
  const student = validateStudent(req.body);
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || !student) return res.status(400).json({ error: 'Invalid student data.' });
  try {
    const { rows } = await pool.query(
      'UPDATE students SET name=$1,email=$2,course=$3,year=$4 WHERE id=$5 RETURNING *',
      [student.name, student.email, student.course, student.year, id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Student not found.' });
    res.json(rows[0]);
  } catch (error) {
    res.status(error.code === '23505' ? 409 : 500).json({ error: error.code === '23505' ? 'Email already exists.' : error.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id.' });
  try {
    const result = await pool.query('DELETE FROM students WHERE id=$1', [id]);
    if (!result.rowCount) return res.status(404).json({ error: 'Student not found.' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`Student API running on http://localhost:${port}`));
