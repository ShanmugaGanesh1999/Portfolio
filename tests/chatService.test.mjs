import test from 'node:test';
import assert from 'node:assert/strict';
import {chatQuery} from '../src/services/chatService.js';
test('chat client preserves trailing SSE content and reports stream errors', async () => {
 const original=globalThis.fetch;
 try {
  globalThis.fetch=async(_url,init)=>{assert.equal(_url,'/api/chat');assert.equal(init.headers.Authorization,undefined);return new Response('data: {"choices":[{"delta":{"content":"hello"}}]}');};
  let output=''; assert.equal(await chatQuery('hello',[],chunk=>output+=chunk),'hello'); assert.equal(output,'hello');
  globalThis.fetch=async()=>new Response('data: {"error":{"message":"provider error"}}\n\n');
  await assert.rejects(chatQuery('hello',[],()=>{}),/interrupted/);
 }finally{globalThis.fetch=original;}
});
