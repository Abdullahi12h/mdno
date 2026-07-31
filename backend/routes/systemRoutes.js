import express from 'express';
import { getSystemStatus, toggleSystemLock } from '../controllers/systemController.js';
import { protect, superAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/status', getSystemStatus);
router.post('/toggle', protect, superAdmin, toggleSystemLock);

export default router;
