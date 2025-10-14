import express from 'express';
import { body, param } from 'express-validator';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { getShippingOptionsByCountry, upsertShippingConfig, listShippingConfigs, deleteShippingConfig } from '../controllers/shippingController';

const router = express.Router();

// Public endpoint to fetch options for a country
router.get('/:country', param('country').isString().isLength({ min: 2, max: 2 }), getShippingOptionsByCountry);

// Admin endpoints
router.get('/', authenticateToken, requireAdmin, listShippingConfigs);
router.post('/', authenticateToken, requireAdmin,
  body('country').isString().isLength({ min: 2, max: 2 }),
  body('options').isArray({ min: 0 }),
  upsertShippingConfig
);
router.delete('/:country', authenticateToken, requireAdmin, deleteShippingConfig);

export default router;


