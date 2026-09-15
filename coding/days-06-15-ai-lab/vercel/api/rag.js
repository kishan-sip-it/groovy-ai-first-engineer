import { complete, resolveProvider } from '../src/providers.js';

function splitPage(text, size=900, overlap=120){ const out=[]; const clean=String(text||'').replace(/\s+/g,' ').trim(); for(let i=0;i<clean.length;i+=size-overlap) out.push(clean.slice(i,i+size)); return out; }
function embed(text, dims=48){ const v=Array(dims).fill(0); for(let i=0;i<text.length;i++){ const c=text.charCodeAt(i); v[(i*13+c)%dims]+=((c%29)+1)/30; } const n=Math.sqrt(v.reduce((s,x)=>s+x*x,0))||1; return v.map(x=>x/n); }
function sim(a,b){return a.reduce((s,x,i)=>s+x*b[i],0)}

export default async function handler(req,res){
  if(req.method==='GET') return res.status(200).json({ok:true, mode:'page-aware', citationFormat:'page + chunk'});
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  try{
    const body=typeof req.body==='string'?JSON.parse(req.body):(req.body||{}); const query=String(body.query||'').trim(); if(!query)return res.status(400).json({error:'query is required'});
    let pages=Array.isArray(body.pages)?body.pages:[];
    if(!pages.length && body.text) pages=[{page:1,text:String(body.text)}];
    if(!pages.length)return res.status(400).json({error:'pages[] or text is required'});
    const chunks=pages.flatMap(p=>splitPage(p.text).map((text,i)=>({page:Number(p.page)||1,chunk:i+1,text})));
    const q=embed(query); const ranked=chunks.map(c=>({...c,score:sim(q,embed(c.text))})).sort((a,b)=>b.score-a.score).slice(0,5);
    const context=ranked.map(c=>`[Page ${c.page}, chunk ${c.chunk}] ${c.text}`).join('\n\n');
    const provider=resolveProvider(String(body.provider||'auto'));
    let answer=''; let live=true;
    try{ const r=await complete(provider,`Answer using only the supplied document context. Cite every factual claim as [p.X c.Y].\n\nQuestion: ${query}\n\nContext:\n${context}`); answer=r.text; }catch(e){ live=false; answer=`Retrieved evidence (live model unavailable):\n${ranked.map(c=>`[p.${c.page} c.${c.chunk}] ${c.text}`).join('\n\n')}`; }
    return res.status(200).json({ok:true,answer,live,provider,retrieved:ranked.map(c=>({page:c.page,chunk:c.chunk,score:Number(c.score.toFixed(4)),text:c.text}))});
  }catch(error){return res.status(500).json({ok:false,error:error instanceof Error?error.message:'RAG failed'});}
}
