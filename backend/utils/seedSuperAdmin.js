import User from '../models/User.js';

export const seedSuperAdmin = async () => {
    try {
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
    } catch (error) {
        console.error('[Seed] Error seeding SuperAdmin account:', error.message);
    }
};
