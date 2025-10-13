import express from 'express';
import { body } from 'express-validator';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { getProducts, getProductById, getProductBySlug, createProduct, updateProduct, deleteProduct } from '../controllers/productController';

const router = express.Router();

// Public
router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/slug/:slug', getProductBySlug);

// Admin protected
router.post('/',
  authenticateToken,
  requireAdmin,
  body('title').isString().isLength({ min: 1 }),
  body('priceCents').isInt({ min: 0 }),
  body('currency').optional().isString(),
  body('slug').isString().isLength({ min: 1 }),
  createProduct
);

router.put('/:id',
  authenticateToken,
  requireAdmin,
  body('title').optional().isString().isLength({ min: 1 }),
  body('priceCents').optional().isInt({ min: 0 }),
  body('currency').optional().isString(),
  body('slug').optional().isString().isLength({ min: 1 }),
  updateProduct
);

router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);

export default router;


