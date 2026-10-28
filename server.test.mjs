import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, readFileSync, rmdirSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve, sep} from 'node:path';
import {request as httpRequest} from 'node:http';
import {createAppServer} from './server.mjs';

const event = (id, payload = {minutes: 60}) => ({id, type: 'preference', at: '2026-10-27T12:00:00.000Z', payload});

async function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'romana-test-'));
  const dataDirectory = join(root, 'data');
  const staticDirectory = join(root, 'www');
  mkdirSync(dataDirectory);
  mkdirSync(staticDirectory);
  writeFileSync(join(staticDirectory, 'index.html'), '<h1>Română</h1>');
  writeFileSync(join(root, 'server.mjs'), 'private server');
  writeFileSync(join(dataDirectory, 'secret.txt'), 'private progress');
  let server;
  let base;
  async function start() {
    server = createAppServer({root, dataDirectory, staticDirectory});
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    base = `http://127.0.0.1:${server.address().port}`;
  }
  async function stop() {
    if (server?.listening) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
  await start();
  t.after(async () => {
    await stop();
    assert.ok(resolve(root).startsWith(resolve(tmpdir()) + sep));
    rmSync(root, {recursive: true, force: true});
  });
  return {
    root,
    dataDirectory,
    file: join(dataDirectory, 'learning-events.json'),
    start,
    stop,
    get: path => fetch(base + path),
    post: (events, headers = {}) => fetch(base + '/api/learning', {
      method: 'POST', headers: {'Content-Type': 'application/json', Origin: base, ...headers}, body: JSON.stringify({events}),
    }),
    raw: (body, headers = {}) => fetch(base + '/api/learning', {
      method: 'POST', headers: {'Content-Type': 'application/json', Origin: base, ...headers}, body,
    }),
    foreignHost: () => new Promise((resolve, reject) => {
      const request = httpRequest(base + '/api/learning', {method: 'POST', headers: {Host: 'evil.example', 'Content-Type': 'application/json'}}, response => {
        response.resume();
        response.on('end', () => resolve(response.statusCode));
      });
      request.on('error', reject);
      request.end(JSON.stringify({events: [event('host')]}));
    }),
  };
}

test('serves the website and health identity without exposing private files', async t => {
  const f = await fixture(t);
  assert.deepEqual(await (await f.get('/health')).json(), {app: 'romana-local', root: f.root});
  assert.match(await (await f.get('/')).text(), /Română/);
  for (const path of ['/server.mjs', '/source/package.json', '/data/secret.txt', '/runtime/node.exe', '/%2e%2e/data/secret.txt', '/api/missing']) {
    assert.equal((await f.get(path)).status, 404, path);
  }
});

test('saves before replying, survives restart, and backs up the previous valid progress', async t => {
  const f = await fixture(t);
  const first = await f.post([event('first')]);
  assert.equal(first.status, 200);
  assert.equal((await first.json()).snapshot.preferences.minutes, 60);
  assert.equal(JSON.parse(readFileSync(f.file, 'utf8')).length, 1);
  await f.stop();
  await f.start();
  assert.equal((await (await f.get('/api/learning')).json()).snapshot.preferences.minutes, 60);
  assert.equal((await f.post([event('first', {minutes: 90})])).status, 200);
  assert.equal(JSON.parse(readFileSync(f.file, 'utf8')).length, 1);
  assert.equal((await f.post([event('second', {level: 'B1'})])).status, 200);
  assert.equal(JSON.parse(readFileSync(f.file, 'utf8')).length, 2);
  assert.equal(JSON.parse(readFileSync(f.file + '.bak', 'utf8'))[0].id, 'first');
  assert.equal(JSON.parse(readFileSync(f.file + '.bak', 'utf8')).length, 1);
});

test('rejects invalid events, a mixed invalid batch, oversized input, and foreign mutations', async t => {
  const f = await fixture(t);
  assert.equal((await f.post([event('seed')])).status, 200);
  const before = readFileSync(f.file, 'utf8');
  assert.equal((await f.post([{...event('bad'), type: 'attempt', payload: {exerciseId: 'unknown', answer: 'yes'}}])).status, 400);
  assert.equal((await f.post([event('../bad')])).status, 400);
  assert.equal((await f.post([event('new'), event('invalid', {minutes: 10})])).status, 400);
  assert.equal((await f.post([event('foreign')], {Origin: 'https://example.com'})).status, 403);
  assert.equal(await f.foreignHost(), 403);
  assert.equal((await f.raw('null')).status, 400);
  assert.equal((await f.raw('x'.repeat(6_000_001))).status, 413);
  assert.equal(readFileSync(f.file, 'utf8'), before);
});

test('refuses to overwrite corrupted progress or its last backup', async t => {
  const f = await fixture(t);
  const corrupt = '[{"id":"broken","type":"preference","at":"bad","payload":{}}]';
  writeFileSync(f.file, corrupt);
  writeFileSync(f.file + '.bak', 'last good backup');
  const get = await f.get('/api/learning');
  assert.equal(get.status, 503);
  assert.match((await get.json()).error, /поврежд|прочитать/i);
  assert.equal((await f.post([event('new')])).status, 503);
  assert.equal(readFileSync(f.file, 'utf8'), corrupt);
  assert.equal(readFileSync(f.file + '.bak', 'utf8'), 'last good backup');
});

test('concurrent saves preserve every distinct event', async t => {
  const f = await fixture(t);
  const responses = await Promise.all(Array.from({length: 12}, (_, i) => f.post([event('save-' + i)])));
  for (const response of responses) assert.equal(response.status, 200);
  const events = JSON.parse(readFileSync(f.file, 'utf8'));
  assert.equal(events.length, 12);
  assert.equal(new Set(events.map(e => e.id)).size, 12);
});

test('a failed disk write preserves current progress and backup, then permits retry', async t => {
  const f = await fixture(t);
  assert.equal((await f.post([event('first')])).status, 200);
  assert.equal((await f.post([event('second')])).status, 200);
  const current = readFileSync(f.file, 'utf8');
  const backup = readFileSync(f.file + '.bak', 'utf8');
  mkdirSync(f.file + '.bak.tmp');
  assert.equal((await f.post([event('third')])).status, 503);
  assert.equal(readFileSync(f.file, 'utf8'), current);
  assert.equal(readFileSync(f.file + '.bak', 'utf8'), backup);
  rmdirSync(f.file + '.bak.tmp');
  assert.equal((await f.post([event('third')])).status, 200);
  assert.equal(JSON.parse(readFileSync(f.file, 'utf8')).length, 3);
  assert.equal(readFileSync(f.file + '.bak', 'utf8'), current);
});
