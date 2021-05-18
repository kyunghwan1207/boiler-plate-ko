const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',//frontend(client폴더)에서 traget을 줄때 5000번 포트로 주겟다
      changeOrigin: true,
    })
  );
};