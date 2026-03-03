const http = require('http' );
const https = require('https' );
const httpProxy = require('http-proxy' );

const TARGET = 'https://rpmengage.lovable.app';
const PORT = process.env.PORT || 8080;

const proxy = httpProxy.createProxyServer({
  target: TARGET,
  changeOrigin: true,
  secure: true,
  autoRewrite: true,
  followRedirects: false,
  hostRewrite: 'rpmengage.lovable.app'
} );

proxy.on('proxyRes', function (proxyRes, req, res) {
  if (proxyRes.headers['location']) {
    const loc = proxyRes.headers['location'];
    if (loc.includes('abodex.ai')) {
      proxyRes.headers['location'] = '/client-portal';
    }
  }
});

proxy.on('error', function (err, req, res) {
  console.error('Proxy error:', err);
  res.writeHead(502, { 'Content-Type': 'text/plain' });
  res.end('Proxy error: ' + err.message);
});

const server = http.createServer(function (req, res ) {
  console.log(`Proxying: ${req.method} ${req.url}`);

  if (req.url === '/' || req.url === '') {
    res.writeHead(302, { 'Location': '/client-portal' });
    res.end();
    return;
  }

  proxy.web(req, res);
});

server.listen(PORT, function () {
  console.log(`Portal proxy running on port ${PORT}`);
  console.log(`Forwarding all traffic to ${TARGET}`);
});
