import express from 'express';
import { body } from 'express-validator';
import Promotion from '../models/Promotion';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Public validate/apply endpoint
router.post('/validate', body('code').isString(), async (req, res) => {
  try {
    const code = String(req.body.code || '').toUpperCase();
    const promo = await Promotion.findOne({ code, active: true });
    if (!promo) { res.status(404).json({ valid: false, message: 'Invalid code' }); return; }
    const now = new Date();
    if ((promo.startsAt && now < promo.startsAt) || (promo.endsAt && now > promo.endsAt)) {
      res.status(400).json({ valid: false, message: 'Code not active' }); return;
    }
    res.json({ valid: true, promotion: promo });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

// Admin CRUD
router.get('/', authenticateToken, requireAdmin, async (_req, res) => {
  const promos = await Promotion.find().sort({ createdAt: -1 });
  res.json(promos);
});

router.post('/', authenticateToken, requireAdmin,
  body('code').isString(),
  body('type').isIn(['percent','fixed']),
  body('value').isNumeric(),
  async (req, res) => {
    const promo = await Promotion.create(req.body);
    res.status(201).json(promo);
  }
);

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const promo = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(promo);
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  await Promotion.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;


