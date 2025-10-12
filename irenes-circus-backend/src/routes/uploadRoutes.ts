import express from 'express';
import multer from 'multer';
import { authenticateToken, requireRole } from '../middleware/auth';
import Upload from '../models/Upload';
import logger from '../config/logger';

const router = express.Router();

// Configure multer for memory storage instead of disk
const storage = multer.memoryStorage();

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

// POST /api/upload - saves to MongoDB and returns URL
router.post(
  '/',
  authenticateToken,
  requireRole('admin'),
  upload.single('image'),
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = req.file.originalname.split('.').pop() || 'jpg';
      const filename = `upload-${uniqueSuffix}.${ext}`;

      // Convert buffer to base64
      const base64Data = req.file.buffer.toString('base64');

      // Save to MongoDB
      const uploadDoc = await Upload.create({
        filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        data: base64Data,
        size: req.file.size,
        uploadedBy: (req as any).user?.id
      });

      logger.info(`File uploaded to MongoDB: ${filename}`);

      // Return the URL for accessing the image
      const isProduction = process.env.NODE_ENV === 'production';
      const publicBase = process.env.BACKEND_PUBLIC_URL;
      const baseUrl = isProduction && publicBase ? publicBase : `${req.protocol}://${req.get('host')}`;
      const url = `${baseUrl}/api/uploads/${uploadDoc.filename}`;
      
      res.status(201).json({ 
        url, 
        filename: uploadDoc.filename,
        id: uploadDoc._id
      });
    } catch (error) {
      logger.error('Upload error:', error);
      res.status(500).json({ message: 'Failed to upload file', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
);

// GET /api/uploads/:filename - serve image from MongoDB
router.get('/:filename', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { filename } = req.params;
    
    // Find the upload in MongoDB
    const upload = await Upload.findOne({ filename });
    
    if (!upload) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    // Convert base64 back to buffer
    const buffer = Buffer.from(upload.data, 'base64');
    
    // Set appropriate headers
    res.set({
      'Content-Type': upload.mimetype,
      'Content-Length': buffer.length.toString(),
      'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      'ETag': `"${upload._id}"`,
    });

    // Send the image
    res.send(buffer);
  } catch (error) {
    logger.error('Error serving file:', error);
    res.status(500).json({ message: 'Failed to retrieve file', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// DELETE /api/uploads/:id - delete from MongoDB
router.delete(
  '/:id',
  authenticateToken,
  requireRole('admin'),
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      const result = await Upload.findByIdAndDelete(id);
      
      if (!result) {
        res.status(404).json({ message: 'File not found' });
        return;
      }

      logger.info(`File deleted from MongoDB: ${result.filename}`);
      res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      logger.error('Delete error:', error);
      res.status(500).json({ message: 'Failed to delete file', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
);

export default router;