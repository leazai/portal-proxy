const http = require('http');
const https = require('https');
const httpProxy = require('http-proxy');

const TARGET = 'https://rpmengage.lovable.app';
const PORT = process.env.PORT || 3000;

const proxy = httpProxy.createProxyServer({
  target: TARGET,
  changeOrigin: true,
  secure: true,
  autoRewrite: true,
  hostRewrite: 'rpmengage.lovable.app'
});

proxy.on('error', function (err, req, res) {
  console.error('Proxy error:', err);
  res.writeHead(502, { 'Content-Type': 'text/plain' });
  res.end('Proxy error: ' + err.message);
});

const server = http.createServer(function (req, res) {
  console.log(`Proxying: ${req.method} ${req.url}`);
  proxy.web(req, res);
});

server.listen(PORT, function () {
  console.log(`Portal proxy running on port ${PORT}`);
  console.log(`Forwarding all traffic to ${TARGET}`);
});
