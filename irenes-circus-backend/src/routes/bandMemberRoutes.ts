import express from 'express';
import { getBandMembers, getBandMemberById, createBandMember, updateBandMember, deleteBandMember } from '../controllers/bandMemberController';
import { authenticateToken, requireRole } from '../middleware/auth';
import validate from '../middleware/validate';
import { bandMemberCreateSchema, bandMemberUpdateSchema } from '../validation/schemas';

const router = express.Router();

// Public routes
router.get('/', getBandMembers);
router.get('/:id', getBandMemberById);

// Protected routes (admin only)
router.post('/', authenticateToken, requireRole('admin'), validate(bandMemberCreateSchema), createBandMember);
router.put('/:id', authenticateToken, requireRole('admin'), validate(bandMemberUpdateSchema), updateBandMember);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteBandMember);

export default router; 