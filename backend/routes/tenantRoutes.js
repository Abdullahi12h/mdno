import express from 'express';
import {
    getTenants,
    createTenant,
    getTenantById,
    updateTenant,
    deleteTenant,
} from '../controllers/tenantController.js';
import { protect, superAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, superAdmin, getTenants)
    .post(protect, superAdmin, createTenant);

router.route('/:id')
    .get(protect, superAdmin, getTenantById)
    .put(protect, superAdmin, updateTenant)
    .delete(protect, superAdmin, deleteTenant);

export default router;
