import fs from 'node:fs/promises';
const file = new URL('../telemetry.csv', import.meta.url);
export async function logCall({day,provider,model,inputTokens=0,outputTokens=0,latencyMs=0,status='ok'}){
  try{
    const path=file;
    try{await fs.access(path)}catch{await fs.writeFile(path,'timestamp,day,provider,model,input_tokens,output_tokens,latency_ms,status\n');}
    const row=[new Date().toISOString(),day,provider,model,inputTokens,outputTokens,latencyMs,status].map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')+'\n';
    await fs.appendFile(path,row);
  }catch{}
}
