import { createServer } from 'node:http';
import { execFile } from 'node:child_process';
import { watch } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const port = 8080;
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const buildScript = fileURLToPath(new URL('build.js', import.meta.url));
const dataFile = new URL('../data/resume.json', import.meta.url);
const watched = ['../src/', '../data/'].map((dir) => fileURLToPath(new URL(dir, import.meta.url)));

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
};

const readBase = async () => JSON.parse(await readFile(dataFile, 'utf8')).meta.basePath;
let base = await readBase();

const runBuild = () =>
  new Promise((resolve) => {
    execFile(process.execPath, [buildScript], async (error, _stdout, stderr) => {
      if (error) {
        console.error(stderr || error.message);
        resolve(false);
        return;
      }
      const previous = base;
      try {
        base = await readBase();
      } catch (readError) {
        console.error(`Could not read basePath from data/resume.json: ${readError.message}`);
        resolve(false);
        return;
      }
      if (base !== previous) console.log(`Base path changed: http://localhost:${port}${base}`);
      resolve(true);
    });
  });

let building = false;
let pending = false;
let timer;

const rebuild = async () => {
  if (building) {
    pending = true;
    return;
  }
  building = true;
  if (await runBuild()) console.log(`Rebuilt at ${new Date().toLocaleTimeString()}`);
  building = false;
  if (pending) {
    pending = false;
    rebuild();
  }
};

const server = createServer(async (request, response) => {
  let pathname;
  let path;
  try {
    ({ pathname } = new URL(request.url, `http://localhost:${port}`));
    path = decodeURIComponent(pathname);
  } catch {
    response.writeHead(400, { 'Content-Type': types['.txt'] }).end('Bad request');
    return;
  }

  if (!path.startsWith(base)) {
    response.writeHead(302, { Location: base }).end();
    return;
  }

  path = path.slice(base.length);
  if (path === '' || path.endsWith('/')) path += 'index.html';
  const file = join(dist, path);

  if (!file.startsWith(dist)) {
    response.writeHead(403).end();
    return;
  }

  try {
    if ((await stat(file)).isDirectory()) {
      response.writeHead(301, { Location: `${pathname}/` }).end();
      return;
    }
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404, { 'Content-Type': types['.txt'] }).end('Not found');
  }
});

const initialBuildOk = await runBuild();
server.listen(port, () => {
  console.log(`http://localhost:${port}${base}`);
  if (!initialBuildOk) {
    console.error('Initial build failed: the page may be missing or outdated. Fix the error above and save, the site rebuilds automatically.');
  }
});

for (const dir of watched) {
  watch(dir, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(rebuild, 100);
  });
}
