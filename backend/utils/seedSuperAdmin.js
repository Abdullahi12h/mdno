import User from '../models/User.js';
import Tenant from '../models/Tenant.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Class from '../models/Class.js';
import Batch from '../models/Batch.js';
import Subject from '../models/Subject.js';
import Exam from '../models/Exam.js';
import Fee from '../models/Fee.js';
import ExamFee from '../models/ExamFee.js';
import Result from '../models/Result.js';

export const seedSuperAdmin = async () => {
    try {
        // 1. Seed SuperAdmin if missing
        const superAdminExists = await User.findOne({ role: 'SuperAdmin' });
        if (!superAdminExists) {
            console.log('[Seed] SuperAdmin account not found. Creating default superadmin account...');
            await User.create({
                name: 'Super Admin',
                username: 'superadmin',
                password: 'superadmin123',
                role: 'SuperAdmin',
                phone: '0610000000',
            });
            console.log('[Seed] SuperAdmin account created successfully! (username: superadmin, password: superadmin123)');
        }

        // 2. Ensure default tenant exists and attach existing unassigned data
        let defaultTenant = await Tenant.findOne({});
        if (!defaultTenant) {
            console.log('[Seed] No tenant found in DB. Creating default tenant "Al-Hafid Skill Center"...');
            defaultTenant = await Tenant.create({
                name: 'Al-Hafid Skill Center',
                code: 'al-hafid',
                phone: '0616913269',
                email: 'info@alhafid.so',
                status: 'active',
                subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
            });
            console.log(`[Seed] Default tenant created: ${defaultTenant.name} (${defaultTenant._id})`);
        }

        // Migrate all unattached records (tenantId: null or missing) to default tenant
        const updateFilter = { $or: [{ tenantId: null }, { tenantId: { $exists: false } }] };
        const updateDoc = { $set: { tenantId: defaultTenant._id } };

        await User.updateMany({ role: { $ne: 'SuperAdmin' }, ...updateFilter }, updateDoc);
        await Student.updateMany(updateFilter, updateDoc);
        await Teacher.updateMany(updateFilter, updateDoc);
        await Class.updateMany(updateFilter, updateDoc);
        await Batch.updateMany(updateFilter, updateDoc);
        await Subject.updateMany(updateFilter, updateDoc);
        await Exam.updateMany(updateFilter, updateDoc);
        await Fee.updateMany(updateFilter, updateDoc);
        await ExamFee.updateMany(updateFilter, updateDoc);
        await Result.updateMany(updateFilter, updateDoc);

        console.log('[Seed] Multi-tenancy auto-migration completed successfully!');
    } catch (error) {
        console.error('[Seed] Error in seeding / auto-migration:', error.message);
    }
};
