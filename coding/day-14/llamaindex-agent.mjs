import { ReActAgent, FunctionTool } from 'llamaindex';
import { OpenAI } from '@llamaindex/openai';
import 'dotenv/config';

function calculator({ expression }) {
  if (!/^[0-9+\-*/().%\s]+$/.test(expression)) throw new Error('Unsafe calculator expression');
  return String(Function(`"use strict";return (${expression})`)());
}
const calculatorTool = new FunctionTool(calculator, {
  name:'calculator',
  description:'Calculate a safe arithmetic expression.',
  parameters:{type:'object',properties:{expression:{type:'string'}},required:['expression']}
});
const llm = new OpenAI({ model:process.env.OPENAI_MODEL || 'gpt-4o-mini', apiKey:process.env.OPENAI_API_KEY });
const agent = new ReActAgent({ llm, tools:[calculatorTool], systemPrompt:'You are a precise engineering agent. Use calculator for arithmetic and explain the result.' });
const prompt = process.argv.slice(2).join(' ') || 'Calculate 17*23 and explain the result.';
const result = await agent.run({ input:prompt });
console.log(JSON.stringify({framework:'LlamaIndex',result:String(result?.response?.message?.content || result?.response || result)},null,2));
