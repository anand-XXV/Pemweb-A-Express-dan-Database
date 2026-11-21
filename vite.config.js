const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const tailwindcss = require('@tailwindcss/vite').default;

module.exports = defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/products': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        bypass: (request) => {
          const accept = request.headers.accept || '';
          if (accept.includes('text/html') && !accept.includes('application/json')) {
            return request.url;
          }
        },
      },
    },
  },
});
