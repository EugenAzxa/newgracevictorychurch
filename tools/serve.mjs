/**
 * serve.mjs - local preview server
 * -----------------------------------------------------------
 * Usage:  node tools/serve.mjs [port]     (default 4321)
 *
 * Node built-ins only, no install. Serves the site exactly as Vercel will:
 * `.html` URLs stay `.html` (no clean-URL rewriting), unknown paths get
 * 404.html, and nothing is cached so a reload always shows your edits.
 *
 * You need a server rather than opening index.html directly because
 * sermons.js fetches data/sermons.json, and browsers block fetch on file://.
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, normalize, extname } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2]) || 4321;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff2': 'font/woff2',
};

async function resolve(urlPath) {
  // Strip the query string, decode, and refuse anything trying to climb out of ROOT
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  const rel = normalize(clean).replace(/^([/\\.]+)/, '');
  const full = join(ROOT, rel);
  if (!full.startsWith(ROOT)) return null;

  try {
    const info = await stat(full);
    if (info.isDirectory()) return resolve(join(clean, 'index.html').replace(/\\/g, '/'));
    return full;
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  const file = await resolve(req.url === '/' ? '/index.html' : req.url);

  if (!file) {
    const notFound = join(ROOT, '404.html');
    try {
      res.writeHead(404, { 'Content-Type': TYPES['.html'] });
      res.end(await readFile(notFound));
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
    console.log(`404  ${req.url}`);
    return;
  }

  res.writeHead(200, {
    'Content-Type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  res.end(await readFile(file));
  console.log(`200  ${req.url}`);
});

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try: node tools/serve.mjs ${PORT + 1}`);
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, () => {
  console.log(`\n  New Grace Victory Church - local preview`);
  console.log(`  http://localhost:${PORT}\n`);
  console.log(`  Ctrl+C to stop.\n`);
});
