import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ['ANTHROPIC_API_KEY'])
message = client.messages.create(
    model=os.getenv('ANTHROPIC_MODEL', 'claude-haiku-4-5-20251001'),
    max_tokens=512,
    messages=[{'role':'user','content':'Explain REST APIs in three concise points.'}],
)
print('\n'.join(block.text for block in message.content if getattr(block,'type',None)=='text'))
print('usage:', message.usage)
