import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

const empty={name:'',email:'',course:'Computer Science',year:1};
function App(){
 const [students,setStudents]=useState([]); const [form,setForm]=useState(empty); const [editing,setEditing]=useState(null); const [error,setError]=useState('');
 const load=async()=>{const r=await fetch('/api/students'); const d=await r.json(); setStudents(d);};
 useEffect(()=>{load().catch(e=>setError(e.message));},[]);
 const save=async e=>{e.preventDefault(); setError(''); const url=editing?`/api/students/${editing}`:'/api/students'; const r=await fetch(url,{method:editing?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); const d=await r.json().catch(()=>null); if(!r.ok) return setError(d?.error||'Request failed'); setForm(empty); setEditing(null); load();};
 const edit=s=>{setEditing(s.id);setForm({name:s.name,email:s.email,course:s.course,year:s.year});};
 const remove=async id=>{if(!confirm('Delete this student?'))return; const r=await fetch(`/api/students/${id}`,{method:'DELETE'}); if(!r.ok)setError('Delete failed'); else load();};
 return <main><h1>Student Management</h1><p>React + Node + PostgreSQL</p><form onSubmit={save}>{Object.entries(form).map(([k,v])=><input key={k} value={v} onChange={e=>setForm({...form,[k]:k==='year'?Number(e.target.value):e.target.value})} placeholder={k}/>) }<button>{editing?'Update':'Add'} Student</button>{editing&&<button type="button" onClick={()=>{setEditing(null);setForm(empty)}}>Cancel</button>}</form>{error&&<div className="error">{error}</div>}<table><thead><tr><th>Name</th><th>Email</th><th>Course</th><th>Year</th><th>Actions</th></tr></thead><tbody>{students.map(s=><tr key={s.id}><td>{s.name}</td><td>{s.email}</td><td>{s.course}</td><td>{s.year}</td><td><button onClick={()=>edit(s)}>Edit</button><button onClick={()=>remove(s.id)}>Delete</button></td></tr>)}</tbody></table></main>}
createRoot(document.getElementById('root')).render(<App/>);
