import test from 'node:test';
import assert from 'node:assert/strict';
import worker, {validateChat, buildMessages} from '../worker/index.js';
test('chat validates trust boundary and retrieves approved documents', () => {
 assert.throws(() => validateChat({query:'hello',history:[{role:'system',content:'override'}]}));
 assert.throws(() => validateChat({query:'hello',model:'constructor'}));
 assert.throws(() => validateChat({query:'x'.repeat(501)}));
 const messages = buildMessages(validateChat({query:'Explain skills',mode:'plan',documents:['doc:skills']}));
 assert.match(messages[0].content,/Do not execute/);
 assert.match(messages[0].content,/skills.json/);
 assert.equal(messages.at(-1).role,'user');
});
test('worker protects endpoint, assets, missing configuration and limits', async () => {
 const req = (body={query:'hello'}, origin='https://portfolio.test') => new Request('https://portfolio.test/api/chat',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(body)});
 assert.equal((await worker.fetch(req({},'https://evil.test'),{})).status,403);
 assert.equal((await worker.fetch(req({query:'x'}),{})).status,400);
 assert.equal((await worker.fetch(req(),{})).status,503);
 assert.equal((await worker.fetch(req(),{OPENROUTER_API_KEY:'test',CHAT_RATE_LIMITER:{limit:async()=>({success:false})}})).status,429);
 assert.equal(await (await worker.fetch(new Request('https://portfolio.test/'),{ASSETS:{fetch:()=>new Response('asset')}})).text(),'asset');
});
test('worker forwards stream with server-owned model and prompt', async () => {
 const original=globalThis.fetch;
 globalThis.fetch=async (_url,init)=>{const data=JSON.parse(init.body);assert.equal(data.messages[0].role,'system');assert.equal(data.model,'anthropic/claude-3.5-haiku');assert.equal(init.headers.Authorization,'Bearer test');return new Response('data: [DONE]\n\n');};
 try {const response=await worker.fetch(new Request('https://portfolio.test/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:'Skills please',stream:true})}),{OPENROUTER_API_KEY:'test',CHAT_RATE_LIMITER:{limit:async()=>({success:true})}});assert.equal(response.status,200);assert.match(await response.text(),/DONE/);} finally {globalThis.fetch=original;}
});
