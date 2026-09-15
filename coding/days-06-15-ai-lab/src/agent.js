import OpenAI from 'openai';

const client = process.env.OPENAI_API_KEY ? new OpenAI({apiKey:process.env.OPENAI_API_KEY}) : null;

const tools = [
  {type:'function',name:'calculator',description:'Perform a basic arithmetic expression.',parameters:{type:'object',properties:{expression:{type:'string'}},required:['expression']}},
  {type:'function',name:'web_search',description:'Fetch a URL and return readable text for a research target.',parameters:{type:'object',properties:{url:{type:'string'}},required:['url']}},
  {type:'function',name:'save_note',description:'Save a short note to the local agent-notes file.',parameters:{type:'object',properties:{text:{type:'string'}},required:['text']}}
];

function calculator(expression){
  if(!/^[0-9+\-*/().%\s]+$/.test(expression)) throw new Error('Unsafe calculator expression');
  return String(Function(`"use strict";return (${expression})`)());
}
async function web_search(url){const r=await fetch(url);if(!r.ok)throw new Error(`HTTP ${r.status}`);return (await r.text()).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').slice(0,4000);}
async function save_note(text){const fs=await import('node:fs/promises');await fs.appendFile('agent-notes.md',`- ${new Date().toISOString()} ${text}\n`);return 'saved';}

export async function runAgent(prompt){
  if(!client) return 'OpenAI tool-using agent is ready but OPENAI_API_KEY is not configured.';
  let input=[{role:'user',content:prompt}];
  for(let step=0;step<5;step++){
    const response=await client.responses.create({model:process.env.OPENAI_MODEL||'gpt-4o-mini',input,tools});
    const calls=response.output.filter(x=>x.type==='function_call');
    if(!calls.length) return response.output_text || '';
    input.push(...response.output);
    for(const call of calls){let result;try{const args=JSON.parse(call.arguments||'{}');if(call.name==='calculator')result=calculator(args.expression);if(call.name==='web_search')result=await web_search(args.url);if(call.name==='save_note')result=await save_note(args.text);}catch(e){result=`Tool error: ${e.message}`;}input.push({type:'function_call_output',call_id:call.call_id,output:String(result)});}
  }
  return 'Agent stopped after maximum tool steps.';
}
