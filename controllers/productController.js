let products = [
  { id: 1, name: 'Buku', price: 15000 },
  { id: 2, name: 'Pulpen', price: 5000 },
];

const getAllProducts = (req, res) => {
  res.status(200).json(products);
};

const getProductById = (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).json({ message: 'Produk tidak ditemukan' });
  }

  res.status(200).json(product);
};

const createProduct = (req, res) => {
  const { name, price } = req.body;

  const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

  const newProduct = {
    id: newId,
    name: name,
    price: Number(price),
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
};