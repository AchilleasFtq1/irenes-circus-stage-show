import express from 'express';
import { body } from 'express-validator';
import GiftCard from '../models/GiftCard';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Public validate endpoint
router.post('/validate', body('code').isString(), async (req, res) => {
  const code = String(req.body.code || '').toUpperCase();
  const gc = await GiftCard.findOne({ code });
  if (!gc || gc.status !== 'active' || (gc.expiresAt && gc.expiresAt < new Date()) || gc.balanceCents <= 0) {
    res.status(404).json({ valid: false, message: 'Invalid or exhausted gift card' });
    return;
  }
  res.json({ valid: true, balanceCents: gc.balanceCents });
});

// Admin CRUD
router.get('/', authenticateToken, requireAdmin, async (_req, res) => {
  const list = await GiftCard.find().sort({ createdAt: -1 });
  res.json(list);
});

router.post('/', authenticateToken, requireAdmin,
  body('amountCents').isInt({ min: 1 }),
  async (req, res) => {
    const amount = parseInt(req.body.amountCents, 10);
    const code = (Math.random().toString(36).slice(2, 10) + Date.now().toString(36)).toUpperCase();
    const gc = await GiftCard.create({ code, balanceCents: amount, originalAmountCents: amount, status: 'active', expiresAt: req.body.expiresAt });
    res.status(201).json(gc);
  }
);

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const gc = await GiftCard.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(gc);
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  await GiftCard.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;


