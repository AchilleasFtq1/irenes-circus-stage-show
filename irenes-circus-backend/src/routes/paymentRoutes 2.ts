import express from 'express';
import { body } from 'express-validator';
import { createCheckoutSession, handleStripeWebhook } from '../controllers/paymentController';

const router = express.Router();

// Stripe webhook must use raw body; mounting is handled in index.ts with a special route
router.post('/checkout/session',
  body('items').isArray({ min: 1 }),
  body('items.*.productId').isString(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('successUrl').isString(),
  body('cancelUrl').isString(),
  body('currency').optional().isString(),
  body('collectShipping').optional().isBoolean(),
  createCheckoutSession
);

export default router;


