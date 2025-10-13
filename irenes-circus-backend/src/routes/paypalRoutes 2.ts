import express from 'express';
import { body, param } from 'express-validator';
import { createPayPalOrder, capturePayPalOrder } from '../controllers/paypalController';

const router = express.Router();

router.post('/order',
  body('items').isArray({ min: 1 }),
  body('items.*.productId').isString(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('returnUrl').isString(),
  body('cancelUrl').isString(),
  body('currency').optional().isString(),
  body('collectShipping').optional().isBoolean(),
  createPayPalOrder
);

router.post('/order/:orderId/capture', param('orderId').isString(), capturePayPalOrder);

export default router;


