import OpenAI from 'openai';

const clients = {
  openai: process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null,
  groq: process.env.GROQ_API_KEY ? new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1' }) : null
};
function clientFor(provider='auto') { if (provider === 'groq' && clients.groq) return ['groq', clients.groq]; if (provider === 'openai' && clients.openai) return ['openai', clients.openai]; if (clients.groq) return ['groq', clients.groq]; if (clients.openai) return ['openai', clients.openai]; return ['mock', null]; }
function calculator(expression) { if (!/^[0-9+\-*/().%\s]+$/.test(expression)) throw new Error('Unsafe calculator expression'); return String(Function(`"use strict";return (${expression})`)()); }
async function webLookup(url) { const u = new URL(url); if (!['http:','https:'].includes(u.protocol)) throw new Error('Only http/https URLs are allowed'); const r = await fetch(u, { headers:{'user-agent':'Groovy-AI-Lab-Agent/1.0'} }); if(!r.ok) throw new Error(`HTTP ${r.status}`); return (await r.text()).replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(0,6000); }
async function persistNote(text) {
  const payload = { text, createdAt: new Date().toISOString(), source:'groovy-ai-agent' };
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_NOTES_TABLE) {
    const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${process.env.SUPABASE_NOTES_TABLE}`, { method:'POST', headers:{'content-type':'application/json','apikey':process.env.SUPABASE_SERVICE_ROLE_KEY,'Authorization':`Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,'Prefer':'return=minimal'}, body:JSON.stringify(payload) });
    if(!r.ok) throw new Error(`Supabase save failed (${r.status})`);
    return 'saved-to-supabase';
  }
  if (process.env.SLACK_WEBHOOK_URL) {
    const r = await fetch(process.env.SLACK_WEBHOOK_URL, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ text:`Groovy AI Agent note: ${text}`}) });
    if(!r.ok) throw new Error(`Slack save failed (${r.status})`);
    return 'sent-to-slack';
  }
  return 'saved-locally-in-run';
}
const toolDefs = [
  { type:'function', function:{ name:'calculator', description:'Evaluate a basic arithmetic expression.', parameters:{type:'object',properties:{expression:{type:'string'}},required:['expression']}}},
  { type:'function', function:{ name:'web_lookup', description:'Fetch a public URL and summarize the returned text.', parameters:{type:'object',properties:{url:{type:'string'}},required:['url']}}},
  { type:'function', function:{ name:'save_note', description:'Persist a note to configured Supabase or Slack, with a local-run fallback.', parameters:{type:'object',properties:{text:{type:'string'}},required:['text']}}}
];

export default async function handler(req,res){
  if(req.method==='GET') return res.status(200).json({ok:true, tools:toolDefs.map(t=>t.function.name), persistence: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_NOTES_TABLE) ? 'supabase' : (process.env.SLACK_WEBHOOK_URL ? 'slack' : 'run-local')});
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  try {
    const body=typeof req.body==='string'?JSON.parse(req.body):(req.body||{}); const prompt=String(body.prompt||'').trim(); if(!prompt)return res.status(400).json({error:'prompt is required'});
    const [provider, client]=clientFor(String(body.provider||'auto'));
    if(!client) return res.status(200).json({provider:'mock', text:'Agent is wired and ready. Configure OPENAI_API_KEY or GROQ_API_KEY for live reasoning.', toolTrace:[]});
    const model=String(body.model || (provider==='groq'?'llama-3.3-70b-versatile':'gpt-4o-mini'));
    const messages=[{role:'system',content:'You are Groovy Webs production standup/engineering agent. Use tools when needed, explain actions, and never fabricate tool results.'},{role:'user',content:prompt}];
    const toolTrace=[];
    for(let step=0;step<6;step++){
      const response=await client.chat.completions.create({model,messages,tools:toolDefs,tool_choice:'auto'});
      const msg=response.choices?.[0]?.message; if(!msg)throw new Error('No model response'); messages.push(msg);
      const calls=msg.tool_calls||[]; if(!calls.length)return res.status(200).json({ok:true,provider,model,text:msg.content||'',toolTrace});
      for(const call of calls){const args=JSON.parse(call.function.arguments||'{}'); let result; try{if(call.function.name==='calculator')result=calculator(args.expression); else if(call.function.name==='web_lookup')result=await webLookup(args.url); else if(call.function.name==='save_note')result=await persistNote(args.text); else result='unknown tool';}catch(e){result=`Tool error: ${e.message}`;} toolTrace.push({tool:call.function.name,args,result}); messages.push({role:'tool',tool_call_id:call.id,content:String(result)});}
    }
    return res.status(200).json({ok:true,provider,model,text:'Agent reached the safety step limit.',toolTrace});
  } catch(error){ return res.status(500).json({ok:false,error:error instanceof Error?error.message:'Agent failed'}); }
}
