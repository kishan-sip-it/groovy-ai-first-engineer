import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const empty = { name:'', email:'', course:'Computer Science', year:1 };

function downloadCsv(students){
  const header = ['Name','Email','Course','Year'];
  const rows = students.map(s => [s.name, s.email, s.course, s.year]);
  const csv = [header, ...rows].map(row => row.map(value => `"${String(value ?? '').replaceAll('"','""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type:'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'students.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function App(){
  const [students,setStudents]=useState([]);
  const [form,setForm]=useState(empty);
  const [editing,setEditing]=useState(null);
  const [error,setError]=useState('');
  const [search,setSearch]=useState('');
  const [courseFilter,setCourseFilter]=useState('All');

  const load=async()=>{
    const r=await fetch('/api/students');
    const d=await r.json();
    if(!r.ok) throw new Error(d?.error || 'Failed to load students');
    setStudents(d);
  };

  useEffect(()=>{load().catch(e=>setError(e.message));},[]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter(s =>
      (!q || [s.name,s.email,s.course].some(v => String(v).toLowerCase().includes(q))) &&
      (courseFilter === 'All' || s.course === courseFilter)
    );
  }, [students, search, courseFilter]);

  const courses = useMemo(() => ['All', ...new Set(students.map(s => s.course))], [students]);

  const save=async e=>{
    e.preventDefault(); setError('');
    const url=editing?`/api/students/${editing}`:'/api/students';
    const r=await fetch(url,{method:editing?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
    const d=await r.json().catch(()=>null);
    if(!r.ok) return setError(d?.error||'Request failed');
    setForm(empty); setEditing(null); await load();
  };

  const edit=s=>{setEditing(s.id);setForm({name:s.name,email:s.email,course:s.course,year:s.year});};
  const remove=async id=>{
    if(!confirm('Delete this student?'))return;
    const r=await fetch(`/api/students/${id}`,{method:'DELETE'});
    if(!r.ok)setError('Delete failed'); else await load();
  };

  return <main>
    <div className="page-head">
      <div><h1>Student Management</h1><p>React + Node + PostgreSQL · CRUD + search + export</p></div>
      <button type="button" onClick={()=>downloadCsv(filtered)} disabled={!filtered.length}>Export CSV</button>
    </div>

    <form onSubmit={save}>
      {Object.entries(form).map(([k,v])=><input key={k} value={v} onChange={e=>setForm({...form,[k]:k==='year'?Number(e.target.value):e.target.value})} placeholder={k}/>) }
      <button>{editing?'Update':'Add'} Student</button>
      {editing&&<button type="button" onClick={()=>{setEditing(null);setForm(empty)}}>Cancel</button>}
    </form>

    <section className="toolbar">
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, email or course..." />
      <select value={courseFilter} onChange={e=>setCourseFilter(e.target.value)}>{courses.map(course=><option key={course}>{course}</option>)}</select>
      <span>{filtered.length} of {students.length} students</span>
    </section>

    {error&&<div className="error">{error}</div>}
    <table>
      <thead><tr><th>Name</th><th>Email</th><th>Course</th><th>Year</th><th>Actions</th></tr></thead>
      <tbody>
        {filtered.map(s=><tr key={s.id}><td>{s.name}</td><td>{s.email}</td><td>{s.course}</td><td>{s.year}</td><td><button type="button" onClick={()=>edit(s)}>Edit</button><button type="button" onClick={()=>remove(s.id)}>Delete</button></td></tr>)}
        {!filtered.length && <tr><td colSpan="5" className="empty">No matching students.</td></tr>}
      </tbody>
    </table>
  </main>
}

createRoot(document.getElementById('root')).render(<App/>);
