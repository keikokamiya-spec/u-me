import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3457;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.JPG':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.HEIC': 'image/heic',
  '.heic': 'image/heic',
  '.svg':  'image/svg+xml',
  '.pdf':  'application/pdf',
  '.ico':  'image/x-icon',
};

const NOTE_RSS_URL = 'https://note.com/ume_nails/rss';

const decodeHtml = value => value
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .trim();

const stripHtml = value => decodeHtml(value)
  .replace(/<[^>]*>/g, '')
  .replace(/\s+/g, ' ')
  .trim();

const getTag = (source, tag) => {
  const match = source.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? decodeHtml(match[1]) : '';
};

const getLatestNote = async () => {
  const response = await fetch(NOTE_RSS_URL, {
    headers: {
      'User-Agent': 'u-me-nail-salon/1.0',
      'Accept': 'application/rss+xml, application/xml, text/xml',
    },
  });

  if (!response.ok) {
    throw new Error(`note RSS request failed: ${response.status}`);
  }

  const xml = await response.text();
  const itemMatch = xml.match(/<item\b[\s\S]*?<\/item>/i);
  if (!itemMatch) {
    return { profileUrl: 'https://note.com/ume_nails', item: null };
  }

  const item = itemMatch[0];
  const description = stripHtml(getTag(item, 'description')).slice(0, 120);

  return {
    profileUrl: 'https://note.com/ume_nails',
    item: {
      title: stripHtml(getTag(item, 'title')),
      link: getTag(item, 'link') || 'https://note.com/ume_nails',
      date: getTag(item, 'pubDate'),
      description,
    },
  };
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);

  if (urlPath === '/api/note') {
    getLatestNote()
      .then(data => {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=600',
        });
        res.end(JSON.stringify(data));
      })
      .catch(error => {
        res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: error.message }));
      });
    return;
  }

  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(__dirname, urlPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found: ' + urlPath);
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`u/me server running on port ${PORT}`);
});
