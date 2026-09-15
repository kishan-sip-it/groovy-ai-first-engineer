import OpenAI from 'openai';
import { complete, resolveProvider } from '../src/providers.js';

function splitPage(text,size=900,overlap=120){const out=[];const clean=String(text||'').replace(/\s+/g,' ').trim();for(let i=0;i<clean.length;i+=size-overlap)out.push(clean.slice(i,i+size));return out;}
function localEmbed(text,dims=96){const v=Array(dims).fill(0);for(let i=0;i<text.length;i++){const c=text.charCodeAt(i);v[(i*17+c)%dims]+=((c%31)+1)/32;}const n=Math.sqrt(v.reduce((s,x)=>s+x*x,0))||1;return v.map(x=>x/n);}
function sim(a,b){return a.reduce((s,x,i)=>s+x*b[i],0)}
async function semanticVectors(texts){
  if(!process.env.OPENAI_API_KEY)return {vectors:texts.map(localEmbed),mode:'local-fallback'};
  try{const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});const r=await client.embeddings.create({model:process.env.OPENAI_EMBEDDING_MODEL||'text-embedding-3-small',input:texts});return {vectors:r.data.sort((a,b)=>a.index-b.index).map(x=>x.embedding),mode:'openai'};}catch{return {vectors:texts.map(localEmbed),mode:'local-fallback'};}
}
export default async function handler(req,res){
  if(req.method==='GET')return res.status(200).json({ok:true,mode:'page-aware',citationFormat:'page + chunk',embeddingMode:process.env.OPENAI_API_KEY?'openai-or-local-fallback':'local-fallback'});
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  try{
    const body=typeof req.body==='string'?JSON.parse(req.body):(req.body||{});const query=String(body.query||'').trim();if(!query)return res.status(400).json({error:'query is required'});
    let pages=Array.isArray(body.pages)?body.pages:[];if(!pages.length&&body.text)pages=[{page:1,text:String(body.text)}];if(!pages.length)return res.status(400).json({error:'pages[] or text is required'});
    const chunks=pages.flatMap(p=>splitPage(p.text).map((text,i)=>({page:Number(p.page)||1,chunk:i+1,text})));const emb=await semanticVectors([query,...chunks.map(c=>c.text)]);const q=emb.vectors[0];
    const ranked=chunks.map((c,i)=>({...c,score:sim(q,emb.vectors[i+1])})).sort((a,b)=>b.score-a.score).slice(0,5);const context=ranked.map(c=>`[Page ${c.page}, chunk ${c.chunk}] ${c.text}`).join('\n\n');
    const provider=resolveProvider(String(body.provider||'auto'));let answer='';let live=true;try{const r=await complete(provider,`Answer using only the supplied document context. Cite every factual claim as [p.X c.Y].\n\nQuestion: ${query}\n\nContext:\n${context}`);answer=r.text;}catch{live=false;answer=`Retrieved evidence (live model unavailable):\n${ranked.map(c=>`[p.${c.page} c.${c.chunk}] ${c.text}`).join('\n\n')}`;}
    return res.status(200).json({ok:true,answer,live,provider,embeddingMode:emb.mode,retrieved:ranked.map(c=>({page:c.page,chunk:c.chunk,score:Number(c.score.toFixed(4)),text:c.text}))});
  }catch(error){return res.status(500).json({ok:false,error:error instanceof Error?error.message:'RAG failed'});}
}
