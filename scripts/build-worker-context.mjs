import { DOCUMENTS } from '../src/workspace/documents.js';
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
const docs = await Promise.all((await readdir('docs')).filter(f => f.endsWith('.md')).map(async name => ({ name, content: await readFile(`docs/${name}`, 'utf8') })));
await mkdir('worker/generated', { recursive: true });
await writeFile('worker/generated/context.js', `export default ${JSON.stringify([...DOCUMENTS.map(d => ({name:d.title, id:d.id, content:d.content})), ...docs])};\n`);
