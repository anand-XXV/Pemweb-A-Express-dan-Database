const express = require('express');
const app = express();
const PORT = 3000;

const productRoutes = require('./routes/productRoutes');

app.use(express.json());

app.use('/products', productRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});