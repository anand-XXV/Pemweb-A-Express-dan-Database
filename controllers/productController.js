const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const parseProductId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const validateProduct = (body) => {
  const { name, price } = body;
  const parsedPrice = Number(price);

  if (typeof name !== 'string' || name.trim() === '') {
    return 'Nama produk wajib diisi';
  }

  if (price === undefined || price === null || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
    return 'Harga produk harus berupa angka yang tidak negatif';
  }

  return null;
};

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'asc' },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data produk' });
  }
};

const getProductById = async (req, res) => {
  const productId = parseProductId(req.params.id);
  if (!productId) {
    return res.status(400).json({ message: 'ID produk tidak valid' });
  }

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data produk' });
  }
};

const createProduct = async (req, res) => {
  const validationError = validateProduct(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name: req.body.name.trim(),
        price: Number(req.body.price),
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat produk' });
  }
};

const updateProduct = async (req, res) => {
  const productId = parseProductId(req.params.id);
  if (!productId) {
    return res.status(400).json({ message: 'ID produk tidak valid' });
  }

  const validationError = validateProduct(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: req.body.name.trim(),
        price: Number(req.body.price),
      },
    });
    res.status(200).json(product);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    res.status(500).json({ message: 'Gagal memperbarui produk' });
  }
};

const deleteProduct = async (req, res) => {
  const productId = parseProductId(req.params.id);
  if (!productId) {
    return res.status(400).json({ message: 'ID produk tidak valid' });
  }

  try {
    await prisma.product.delete({ where: { id: productId } });
    res.status(200).json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    res.status(500).json({ message: 'Gagal menghapus produk' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};