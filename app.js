const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dir: '.', dev });

const handle = app.getRequestHandler();

const LRUCache = require('lru-cache');

const ssrCache = new LRUCache({
   max: 100,
   maxAge: 1000 * 60 * 60 // 1hour
});

app.prepare().then(() => {

  const server = express();

  server.get('/', (req, res) => {
    renderAndCache(req, res, '/', {});
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });

}).catch(ex => {
  console.error(ex.stack);
  process.exit(1);
});

function getCacheKey(req){
 //TODO clean-up, standardize an url to maximize cache hits
 return req.url
}

async function renderAndCache(req, res, pagePath, queryParams) {
  //TODO add a way to purge cache for a specific url
  const key = getCacheKey(req);

  // If we have a page in the cache, let's serve it
  if (ssrCache.has(key)) {
    res.setHeader('x-cache', 'HIT');
    res.send(ssrCache.get(key));
    return;
  }

  // No cache present for specific key? let's try to render and cache
 try {
   const html = await app.renderToHTML(req, res, pagePath, queryParams);
   // If something is wrong with the request, let's not cache
   // Send the generated content as is for further inspection

   if (dev || res.statusCode !== 200) {
    res.setHeader('x-cache', 'SKIP');
    res.send(html);
    return;
    }

    // Everything seems OK... let's cache
    ssrCache.set(key, html);
    res.setHeader('x-cache', 'MISS');
    res.send(html);
  } catch (err) {
    app.renderError(err, req, res, pagePath, queryParams);
 }
}
