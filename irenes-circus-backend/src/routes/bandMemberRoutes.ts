import express from 'express';
import { getBandMembers, getBandMemberById, createBandMember, updateBandMember, deleteBandMember } from '../controllers/bandMemberController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getBandMembers);
router.get('/:id', getBandMemberById);

// Protected routes (admin only)
router.post('/', authenticateToken, requireRole('admin'), createBandMember);
router.put('/:id', authenticateToken, requireRole('admin'), updateBandMember);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteBandMember);

export default router; 