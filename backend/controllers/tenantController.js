import Tenant from '../models/Tenant.js';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';

// @desc    Get all tenants with stats
// @route   GET /api/tenants
// @access  Private/SuperAdmin
export const getTenants = async (req, res) => {
    try {
        const tenants = await Tenant.find({}).sort({ createdAt: -1 });

        const tenantData = await Promise.all(
            tenants.map(async (tenant) => {
                const studentCount = await Student.countDocuments({ tenantId: tenant._id });
                const teacherCount = await Teacher.countDocuments({ tenantId: tenant._id });
                const adminUser = await User.findOne({ tenantId: tenant._id, role: 'Admin' }).select('name username phone');

                return {
                    ...tenant.toObject(),
                    studentCount,
                    teacherCount,
                    adminUser,
                };
            })
        );

        res.json(tenantData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new tenant & initial admin user
// @route   POST /api/tenants
// @access  Private/SuperAdmin
export const createTenant = async (req, res) => {
    try {
        const { name, code, email, phone, address, logo, adminName, adminUsername, adminPassword, subscriptionDays } = req.body;

        if (!name || !code) {
            return res.status(400).json({ message: 'Name and Code are required' });
        }

        const existingTenant = await Tenant.findOne({ code: code.toLowerCase().trim() });
        if (existingTenant) {
            return res.status(400).json({ message: 'Dugsi leh code-kan hore ayaa u jira (Code already exists)' });
        }

        if (adminUsername) {
            const existingUser = await User.findOne({ username: adminUsername });
            if (existingUser) {
                return res.status(400).json({ message: 'Username-ka Admin-ka hore ayaa loo isticmaalay' });
            }
        }

        const days = subscriptionDays ? parseInt(subscriptionDays) : 30;
        const expiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

        const tenant = await Tenant.create({
            name,
            code: code.toLowerCase().trim(),
            email,
            phone,
            address,
            logo: logo || '',
            status: 'active',
            subscriptionExpiry: expiryDate,
        });

        let adminUser = null;
        if (adminUsername && adminPassword) {
            adminUser = await User.create({
                name: adminName || `${name} Admin`,
                username: adminUsername,
                password: adminPassword,
                role: 'Admin',
                phone: phone || '',
                tenantId: tenant._id,
            });
        }

        res.status(201).json({
            tenant,
            adminUser: adminUser ? { id: adminUser._id, name: adminUser.name, username: adminUser.username } : null,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get tenant details
// @route   GET /api/tenants/:id
// @access  Private/SuperAdmin
export const getTenantById = async (req, res) => {
    try {
        const tenant = await Tenant.findById(req.params.id);
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }

        const studentCount = await Student.countDocuments({ tenantId: tenant._id });
        const teacherCount = await Teacher.countDocuments({ tenantId: tenant._id });
        const adminUsers = await User.find({ tenantId: tenant._id, role: 'Admin' }).select('-password');

        res.json({
            ...tenant.toObject(),
            studentCount,
            teacherCount,
            adminUsers,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update tenant (status, subscription, details)
// @route   PUT /api/tenants/:id
// @access  Private/SuperAdmin
export const updateTenant = async (req, res) => {
    try {
        const tenant = await Tenant.findById(req.params.id);
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }

        const { name, email, phone, address, logo, status, subscriptionDays, maxStudents, maxTeachers } = req.body;

        if (name) tenant.name = name;
        if (email !== undefined) tenant.email = email;
        if (phone !== undefined) tenant.phone = phone;
        if (address !== undefined) tenant.address = address;
        if (logo !== undefined) tenant.logo = logo;
        if (status) tenant.status = status;
        if (maxStudents) tenant.maxStudents = maxStudents;
        if (maxTeachers) tenant.maxTeachers = maxTeachers;

        if (subscriptionDays) {
            const addDays = parseInt(subscriptionDays);
            const currentExpiry = tenant.subscriptionExpiry && tenant.subscriptionExpiry > new Date()
                ? new Date(tenant.subscriptionExpiry)
                : new Date();
            tenant.subscriptionExpiry = new Date(currentExpiry.getTime() + addDays * 24 * 60 * 60 * 1000);
        }

        await tenant.save();
        res.json(tenant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete tenant
// @route   DELETE /api/tenants/:id
// @access  Private/SuperAdmin
export const deleteTenant = async (req, res) => {
    try {
        const tenant = await Tenant.findById(req.params.id);
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }

        await tenant.deleteOne();
        res.json({ message: 'Tenant removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
