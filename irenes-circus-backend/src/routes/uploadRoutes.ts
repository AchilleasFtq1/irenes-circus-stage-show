import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
    cb(null, `${base}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// POST /api/upload - returns { url }
router.post(
  '/',
  authenticateToken,
  requireRole('admin'),
  upload.single('image'),
  (req: express.Request, res: express.Response): void => {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const relativePath = `/uploads/${req.file.filename}`;
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const url = isProduction ? `${baseUrl}${relativePath}` : relativePath;
    res.status(201).json({ url, filename: req.file.filename });
  }
);

export default router;


