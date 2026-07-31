import jwt from 'jsonwebtoken';
import User from '../models/User.js';

import Tenant from '../models/Tenant.js';

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user no longer exists' });
            }

            req.tenantId = req.user.tenantId || null;

            // If user is not SuperAdmin and is associated with a tenant, check tenant status
            if (req.user.role !== 'SuperAdmin' && req.tenantId) {
                const tenant = await Tenant.findById(req.tenantId);
                if (tenant && (tenant.status === 'locked' || tenant.status === 'suspended')) {
                    return res.status(403).json({
                        message: 'Fadlan iska bixi lacagta/rukumada dugsiga! Account-ka dugsigaaga waa xiran yahay.',
                        isTenantLocked: true,
                        tenantName: tenant.name,
                    });
                }
            }

            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const optionalProtect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            console.warn('Optional auth failed:', error.message);
        }
    }
    next();
};

export const admin = (req, res, next) => {
    if (req.user && (req.user.role === 'Admin' || req.user.role === 'SuperAdmin')) {
        next();
    } else {
        console.warn(`[admin] Auth failed for user ${req.user?._id}, role: ${req.user?.role}`);
        res.status(403).json({ message: 'Not authorized as an Admin' });
    }
};

export const teacherOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'Admin' || req.user.role === 'Teacher' || req.user.role === 'SuperAdmin')) {
        next();
    } else {
        console.warn(`[teacherOrAdmin] Auth failed for user ${req.user?._id}, role: ${req.user?.role}`);
        res.status(403).json({ message: 'Not authorized. Requires Teacher or Admin role.' });
    }
};

export const superAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'SuperAdmin') {
        next();
    } else {
        console.warn(`[superAdmin] Auth failed for user ${req.user?._id}, role: ${req.user?.role}`);
        res.status(403).json({ message: 'Not authorized as Super Admin' });
    }
};

