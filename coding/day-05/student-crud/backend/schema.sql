CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  course TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year BETWEEN 1 AND 6),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO students (name,email,course,year)
VALUES
  ('Aarav Shah','aarav@example.com','Computer Science',3),
  ('Meera Patel','meera@example.com','Information Technology',2)
ON CONFLICT (email) DO NOTHING;
