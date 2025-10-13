import express from 'express';
import { body, param } from 'express-validator';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { listOrders, getOrderById, markFulfilled, createDraftOrder } from '../controllers/orderController';

const router = express.Router();

// Public order tracking (limited info)
router.get('/track/:id', getOrderById);

// Admin views
router.get('/', authenticateToken, requireAdmin, listOrders);
router.get('/:id', authenticateToken, requireAdmin, getOrderById);
router.put('/:id/fulfill', authenticateToken, requireAdmin, param('id').isString(), markFulfilled);

// Public create draft order (prior to payment)
router.post('/draft',
  body('items').isArray({ min: 1 }),
  body('items.*.productId').isString(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('currency').optional().isString(),
  createDraftOrder
);

export default router;


