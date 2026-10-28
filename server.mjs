import {createServer} from 'node:http';
import {copyFileSync, existsSync, mkdirSync, readFileSync, realpathSync, renameSync, statSync, writeFileSync} from 'node:fs';
import {dirname, extname, isAbsolute, join, relative, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {catalog, courseVersion} from './source/lib/course/data.ts';
import {createAccumulator, reduceEvents, validateEvent} from './source/lib/course/records.ts';

const appRoot = dirname(fileURLToPath(import.meta.url));
const maxPayload = 6_000_000;
const mime = {'.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.pdf': 'application/pdf', '.txt': 'text/plain; charset=utf-8'};

export function createAppServer({root = appRoot, dataDirectory = join(root, 'data'), staticDirectory = join(root, 'www')} = {}) {
  root = resolve(root);
  const progressFile = join(dataDirectory, 'learning-events.json');

  function readProgress() {
    try {
      if (!existsSync(progressFile)) {
        mkdirSync(dataDirectory, {recursive: true});
        writeFileSync(progressFile, '[]\n', {flag: 'wx'});
      }
      const raw = readFileSync(progressFile, 'utf8');
      const events = JSON.parse(raw);
      if (!Array.isArray(events)) throw new Error('Ожидается список событий');
      const accumulator = createAccumulator(catalog);
      const seen = new Set();
      for (const event of events) {
        if (seen.has(event?.id)) continue;
        const checked = validateEvent(event, catalog, accumulator.snapshot);
        accumulator.append(checked);
        seen.add(checked.id);
      }
      return {raw, events};
    } catch {
      throw new Error('Не удалось прочитать файл прогресса: он повреждён или недоступен. Файл не изменён. Сохраните его копию и восстановите исправную резервную копию из папки data.');
    }
  }

  function saveProgress(events) {
    const temp = progressFile + '.tmp';
    const backup = progressFile + '.bak';
    writeFileSync(temp, JSON.stringify(events) + '\n');
    copyFileSync(progressFile, backup + '.tmp');
    renameSync(backup + '.tmp', backup);
    renameSync(temp, progressFile);
  }

  const server = createServer({requestTimeout: 30_000, headersTimeout: 10_000, maxHeaderSize: 8192}, (request, response) => {
    const headers = {'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff'};
    const json = (status, value) => {
      response.writeHead(status, {...headers, 'Content-Type': 'application/json; charset=utf-8'});
      response.end(JSON.stringify(value));
    };
    const origin = `http://127.0.0.1:${server.address().port}`;
    if (request.headers.host !== origin.slice(7)) return json(403, {error: 'Неверный адрес локального приложения'});
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, origin).pathname);
      if (pathname.includes('\0') || pathname.includes('\\')) throw new Error();
    } catch {
      return json(400, {error: 'Некорректный адрес'});
    }

    if (pathname === '/health' && request.method === 'GET') return json(200, {app: 'romana-local', root});

    if (pathname === '/api/learning') {
      if (request.method === 'GET') {
        try {
          return json(200, {courseVersion, snapshot: reduceEvents(readProgress().events, catalog)});
        } catch (error) {
          return json(503, {error: error.message});
        }
      }
      if (request.method !== 'POST') return json(405, {error: 'Метод не поддерживается'});
      if (request.headers.origin && request.headers.origin !== origin) return json(403, {error: 'Неверный источник запроса'});
      if (!request.headers['content-type']?.toLowerCase().startsWith('application/json')) return json(415, {error: 'Ожидается JSON'});
      let bytes = 0;
      const chunks = [];
      request.on('data', chunk => {
        bytes += chunk.length;
        if (bytes <= maxPayload) chunks.push(chunk);
      });
      request.on('end', () => {
        if (bytes > maxPayload) return json(413, {error: 'Файл слишком большой'});
        let body;
        try {
          body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
          if (!Array.isArray(body?.events) || body.events.length < 1 || body.events.length > 100) throw new Error('Ожидается список из 1–100 событий');
        } catch (error) {
          return json(400, {error: error.message});
        }
        let existing;
        try {
          existing = readProgress().events;
        } catch (error) {
          return json(503, {error: error.message});
        }
        const seen = new Set(existing.map(event => event.id));
        const accumulator = createAccumulator(catalog, existing);
        const fresh = [];
        try {
          for (const rawEvent of body.events) {
            if (seen.has(rawEvent?.id)) continue;
            const event = validateEvent(rawEvent, catalog, accumulator.snapshot);
            fresh.push(event);
            seen.add(event.id);
            accumulator.append(event);
          }
        } catch (error) {
          return json(400, {error: error.message});
        }
        try {
          if (fresh.length) saveProgress([...existing, ...fresh]);
          return json(200, {courseVersion, snapshot: accumulator.snapshot});
        } catch {
          return json(503, {error: 'Не удалось сохранить прогресс. Проверьте доступ к папке data и свободное место. Предыдущий прогресс сохранён.'});
        }
      });
      request.on('error', () => {
        if (!response.headersSent) json(400, {error: 'Не удалось прочитать запрос'});
      });
      return;
    }

    if (!['GET', 'HEAD'].includes(request.method)) return json(405, {error: 'Метод не поддерживается'});
    if (/^\/(api|source|data|runtime)(\/|$)/.test(pathname)) return json(404, {error: 'Страница не найдена'});
    try {
      const staticRoot = realpathSync(staticDirectory);
      let target = resolve(staticRoot, '.' + pathname);
      let outside = relative(staticRoot, target);
      if (outside.startsWith('..' + sep) || outside === '..' || isAbsolute(outside)) return json(404, {error: 'Файл не найден'});
      if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
      if (!existsSync(target) && !extname(pathname)) target = join(staticRoot, 'index.html');
      target = realpathSync(target);
      outside = relative(staticRoot, target);
      if (outside.startsWith('..' + sep) || outside === '..' || isAbsolute(outside) || !statSync(target).isFile()) return json(404, {error: 'Файл не найден'});
      const content = readFileSync(target);
      response.writeHead(200, {...headers, 'Content-Type': mime[extname(target).toLowerCase()] ?? 'application/octet-stream', 'Content-Length': content.length});
      response.end(request.method === 'HEAD' ? undefined : content);
    } catch {
      json(404, {error: 'Файл не найден'});
    }
  });
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createAppServer();
  server.on('error', error => {
    console.error('Не удалось запустить Română:', error.message);
    process.exitCode = 1;
  });
  server.listen(47833, '127.0.0.1', () => console.log('Română: http://127.0.0.1:47833/'));
}
