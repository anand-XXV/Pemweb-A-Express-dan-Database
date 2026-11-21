const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const serveReactRoute = (req, res, next) => {
  const accept = req.get('accept') || '';
  if (accept.includes('text/html') && !accept.includes('application/json')) {
    return next('route');
  }
  return next();
};

router.get('/', serveReactRoute, getAllProducts);
router.get('/:id', serveReactRoute, getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;