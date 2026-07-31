const express = require('express');
const router = express.Router();

// Disable SSL certificate rejection globally in this Node process
// This prevents fetch certificate errors on Windows local environments without needing Undici package.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

router.get('/', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('URL query parameter is required');
  }

  // 1. Detect if the target URL is a YouTube video or Shorts link
  const urlLower = targetUrl.toLowerCase();
  if (urlLower.includes('youtube.com/watch') || urlLower.includes('youtu.be/') || urlLower.includes('youtube.com/shorts/')) {
    let videoId = '';
    try {
      const urlObj = new URL(targetUrl);
      if (urlLower.includes('youtube.com/watch')) {
        videoId = urlObj.searchParams.get('v');
      } else if (urlLower.includes('youtu.be/')) {
        videoId = urlObj.pathname.slice(1);
      } else if (urlLower.includes('youtube.com/shorts/')) {
        const parts = urlObj.pathname.split('/');
        videoId = parts[parts.indexOf('shorts') + 1];
      }
    } catch (e) {
      const match = targetUrl.match(/(?:v=|\/shorts\/|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (match) videoId = match[1];
    }

    if (videoId) {
      res.setHeader('Content-Type', 'text/html');
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>YouTube Player</title>
          <style>
            html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #000; }
            iframe { border: none; width: 100%; height: 100%; }
          </style>
          <script>
            // Sync parent address bar with the watch URL
            window.parent.postMessage({
              type: 'IFRAME_NAVIGATED',
              url: 'https://www.youtube.com/watch?v=${videoId}'
            }, '*');
          </script>
        </head>
        <body>
          <iframe 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
          ></iframe>
        </body>
        </html>
      `);
    }
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(response.status).send(`Target site responded with code ${response.status}`);
    }

    let html = await response.text();
    const parsedUrl = new URL(targetUrl);
    const origin = parsedUrl.origin;

    // JavaScript hack to defeat iframe detection and track page navigation
    const frameBusterOverride = `
      <script>
        (function() {
          try {
            Object.defineProperty(window, 'top', { get: function() { return window.self; } });
            Object.defineProperty(window, 'parent', { get: function() { return window.self; } });
          } catch (e) {
            window.top = window.self;
            window.parent = window.self;
          }

          const originHost = "${origin}";

          function notifyParentOfUrl() {
            try {
              let currentUrl = window.location.href;
              if (currentUrl.includes('localhost:')) {
                const urlObj = new URL(currentUrl);
                const targetParam = urlObj.searchParams.get('url');
                if (targetParam) {
                  currentUrl = targetParam;
                } else {
                  // Reconstruct target URL using base origin host
                  currentUrl = originHost + urlObj.pathname + urlObj.search + urlObj.hash;
                }
              }
              window.parent.postMessage({
                type: 'IFRAME_NAVIGATED',
                url: currentUrl
              }, '*');
            } catch(e) {}
          }

          window.addEventListener('DOMContentLoaded', notifyParentOfUrl);
          window.addEventListener('load', notifyParentOfUrl);
          window.addEventListener('popstate', notifyParentOfUrl);
          window.addEventListener('hashchange', notifyParentOfUrl);

          const origPush = history.pushState;
          history.pushState = function(state, title, url) {
            if (!url) return;
            try {
              const resolvedUrl = new URL(url, originHost).toString();
              const proxiedUrl = 'http://localhost:5000/api/proxy?url=' + encodeURIComponent(resolvedUrl);
              origPush.call(this, state, title, proxiedUrl);
              setTimeout(notifyParentOfUrl, 100);
            } catch (err) {
              origPush.apply(this, arguments);
            }
          };

          const origReplace = history.replaceState;
          history.replaceState = function(state, title, url) {
            if (!url) return;
            try {
              const resolvedUrl = new URL(url, originHost).toString();
              const proxiedUrl = 'http://localhost:5000/api/proxy?url=' + encodeURIComponent(resolvedUrl);
              origReplace.call(this, state, title, proxiedUrl);
              setTimeout(notifyParentOfUrl, 100);
            } catch (err) {
              origReplace.apply(this, arguments);
            }
          };

          // Intercept all link clicks inside the iframe to keep them proxied
          document.addEventListener('click', function(e) {
            const anchor = e.target.closest('a');
            if (anchor && anchor.href) {
              if (anchor.getAttribute('target') === '_blank') return;
              if (anchor.href.startsWith('javascript:')) return;
              
              e.preventDefault();
              e.stopPropagation();

              // Browser resolves relative links relative to base href automatically
              const targetUrl = anchor.href;
              window.location.href = 'http://localhost:5000/api/proxy?url=' + encodeURIComponent(targetUrl);
            }
          }, true);

          // Intercept search form submissions
          document.addEventListener('submit', function(e) {
            const form = e.target;
            if (form.action) {
              const method = (form.method || 'GET').toUpperCase();
              if (method === 'GET') {
                e.preventDefault();
                e.stopPropagation();

                const formData = new FormData(form);
                const params = new URLSearchParams(formData);
                const actionUrl = new URL(form.action, window.location.href).toString();
                const separator = actionUrl.includes('?') ? '&' : '?';
                const targetUrl = actionUrl + separator + params.toString();

                window.location.href = 'http://localhost:5000/api/proxy?url=' + encodeURIComponent(targetUrl);
              }
            }
          }, true);
        })();
      </script>
    `;

    // Inject base tag & frame buster override script
    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head><base href="${origin}/">${frameBusterOverride}`);
    } else {
      html = `<base href="${origin}/">${frameBusterOverride}` + html;
    }

    // Replace inline frame-busting checks in raw source code
    html = html.replace(/window\.top\s*!==\s*window\.self/g, 'false');
    html = html.replace(/top\.location/g, 'self.location');

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    res.status(500).send(`Failed to proxy URL: ${err.message}`);
  }
});

module.exports = router;
