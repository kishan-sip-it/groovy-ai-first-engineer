import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Command } from 'commander';
import { complete, stream, availableProviders } from './providers.js';
import { runAgent } from './agent.js';
import { answerQuestion } from './rag.js';
import { logCall } from './telemetry.js';

const program = new Command();
program.name('ai-lab').description('Groovy Days 6-15 AI engineering lab');
async function runWithTelemetry(day, provider, input, fn){const started=Date.now();try{const result=await fn();const u=result?.usage||{};await logCall({day,provider,model:process.env[`${provider.toUpperCase()}_MODEL`]||'default',inputTokens:u.input_tokens??u.promptTokenCount??0,outputTokens:u.output_tokens??u.candidatesTokenCount??0,latencyMs:Date.now()-started});return result}catch(error){await logCall({day,provider,model:'default',latencyMs:Date.now()-started,status:'error'});throw error;}}
program.command('chat').option('-p, --provider <provider>','auto|anthropic|openai|gemini|groq','auto').argument('[prompt]').action(async(prompt,opts)=>{const q=prompt||'Explain prompt injection in three concise points.';const r=await runWithTelemetry(6,opts.provider,q,()=>complete(opts.provider,q));console.log(`[${opts.provider}]\n${r.text}`);});
program.command('stream').option('-p, --provider <provider>','auto|anthropic|openai|gemini|groq','auto').argument('[prompt]').action(async(prompt,opts)=>{for await(const part of stream(opts.provider,prompt||'Explain RAG in five short lines.'))process.stdout.write(part);console.log();});
program.command('explain').argument('[folder]').action(async(folder='.')=>{const files=[];const walk=async(dir)=>{for(const name of await fs.readdir(dir,{withFileTypes:true})){if(['node_modules','.git'].includes(name.name))continue;const full=path.join(dir,name.name);if(name.isDirectory())await walk(full);else if(/\.(js|jsx|ts|tsx|py|md|json|sql)$/.test(name.name)){const text=await fs.readFile(full,'utf8');files.push(`\nFILE: ${full}\n${text.slice(0,8000)}`);}}};await walk(path.resolve(folder));const context=files.join('\n').slice(0,60000);const provider=availableProviders()[0]||'mock';const r=await complete(provider,`Explain this codebase for a new engineer. Cover architecture, entry points, data flow, external integrations, risks, and how to run it.\n${context}`);console.log(r.text);});
program.command('agent').argument('[prompt]').action(async(prompt)=>console.log(await runAgent(prompt||'Calculate 17*23 and then summarize why tool calling is useful.')));
program.command('rag').argument('<question>').option('-f, --file <path>','source document').action(async(q,opts)=>console.log(await answerQuestion(q,opts.file)));
program.command('bench').action(async()=>{const prompts=Array.from({length:50},(_,i)=>`Prompt ${i+1}: Explain one software engineering concept in one sentence.`);const rows=[];for(const provider of ['anthropic','openai','gemini','groq']){for(const p of prompts){try{const s=Date.now();const r=await complete(provider,p);rows.push(`${provider},${Date.now()-s},"${(r.text||'').replaceAll('"','""')}"`);}catch(e){rows.push(`${provider},error,"${String(e.message).replaceAll('"','""')}"`);}}}await fs.writeFile('50-prompt-results.csv','provider,latency_ms,response\n'+rows.join('\n'));console.log('Wrote 50-prompt-results.csv');});
program.parseAsync().catch(e=>{console.error(e.message);process.exit(1);});
