import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '..', '..');
const required = [
  'coding/day-05/student-crud/backend/package.json',
  'coding/day-05/student-crud/backend/schema.sql',
  'coding/days-06-15-ai-lab/package.json',
  'coding/days-06-15-ai-lab/src/index.js',
  'coding/day-19/.github/workflows/ci.yml',
  'coding/day-19/render.yaml'
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  console.error('Release preflight failed. Missing:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const studentPackage = JSON.parse(fs.readFileSync(path.join(root, required[0]), 'utf8'));
const aiPackage = JSON.parse(fs.readFileSync(path.join(root, required[2]), 'utf8'));

const checks = [
  ['Student CRUD has a test script', typeof studentPackage.scripts?.test === 'string'],
  ['AI lab has a chat command', typeof aiPackage.scripts?.chat === 'string'],
  ['AI lab has a RAG command', typeof aiPackage.scripts?.rag === 'string'],
  ['AI lab has an agent command', typeof aiPackage.scripts?.agent === 'string']
];

const failed = checks.filter(([, ok]) => !ok);
checks.forEach(([label, ok]) => console.log(`${ok ? 'PASS' : 'FAIL'} — ${label}`));
if (failed.length) process.exit(1);
console.log('Release preflight passed.');
