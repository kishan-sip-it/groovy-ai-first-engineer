import { createAgent, tool } from 'langchain';
import * as z from 'zod';
import 'dotenv/config';

const calculator = tool((input) => String(Function(`"use strict";return (${input.expression})`)()), {
  name:'calculator',
  description:'Calculate a safe arithmetic expression.',
  schema:z.object({ expression:z.string().regex(/^[0-9+\\-*/().%\\s]+$/) })
});

const agent = createAgent({
  model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  tools: [calculator],
  systemPrompt: 'You are a precise engineering agent. Use calculator for arithmetic and explain the result.'
});

const prompt = process.argv.slice(2).join(' ') || 'Calculate 17*23 and explain the result.';
const result = await agent.invoke({messages:[{role:'user',content:prompt}]});
const messages = result.messages || [];
const last = messages[messages.length-1];
console.log(JSON.stringify({framework:'LangChain',messages,last: last?.content || ''},null,2));
