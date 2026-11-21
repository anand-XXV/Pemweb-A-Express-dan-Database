const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const productRoutes = require('./routes/productRoutes');

app.use(express.json());

app.use('/products', productRoutes);

const frontendPath = path.join(__dirname, 'dist');
app.use(express.static(frontendPath));
app.use((req, res, next) => {
  if (req.method !== 'GET' || !req.accepts('html')) {
    return next();
  }

  res.sendFile(path.join(frontendPath, 'index.html'), (error) => {
    if (error) {
      next(error);
    }
  });
});
app.use((req, res) => {
  res.status(404).json({ message: 'Halaman tidak ditemukan' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});