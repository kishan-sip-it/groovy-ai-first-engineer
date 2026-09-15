import { complete, resolveProvider } from '../src/providers.js';

function toolCallStyle(prompt){ return {plan:['retrieve context','choose tool','execute tool','synthesize answer'],prompt}; }
async function runPath(kind,prompt,provider){
  const plan=toolCallStyle(prompt); const routed=resolveProvider(provider||'auto');
  const system=kind==='langchain'
    ? 'You are a LangChain-style agent. Follow a Runnable-style pipeline: input -> prompt -> model -> structured tool decision -> final answer.'
    : 'You are a LlamaIndex-style agent. Follow a context-first pipeline: retrieve nodes -> reason over context -> select tools -> final answer.';
  const result=await complete(routed,`${system}\n\n${JSON.stringify(plan)}\n\nUser request: ${prompt}`);
  return {framework:kind,provider:routed,architecture:kind==='langchain'?'Runnable pipeline + tool boundary':'retrieval/context pipeline + tool boundary',text:result.text};
}
export default async function handler(req,res){
  if(req.method==='GET')return res.status(200).json({ok:true,implementations:{langchain:'executable style adapter',llamaindex:'executable style adapter'},comparison:{langchain:'composition-first runnable chain',llamaindex:'retrieval/context-first index pipeline'}});
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  try{const body=typeof req.body==='string'?JSON.parse(req.body):(req.body||{}); const prompt=String(body.prompt||'').trim(); if(!prompt)return res.status(400).json({error:'prompt is required'}); const [a,b]=await Promise.all([runPath('langchain',prompt,body.provider),runPath('llamaindex',prompt,body.provider)]); return res.status(200).json({ok:true,results:[a,b]});}
  catch(error){return res.status(500).json({ok:false,error:error instanceof Error?error.message:'Framework comparison failed'});}
}
