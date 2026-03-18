import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const testRegisterAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const username = `admin_test_${Date.now()}`;
        const newUser = await User.create({
            name: 'Test Admin',
            username: username,
            password: 'password123',
            role: 'Admin',
            phone: '123456789',
            whatsapp: '123456789'
        });

        console.log('Admin created successfully:', newUser.username);
        await User.deleteOne({ _id: newUser._id });
        console.log('Test Admin deleted');
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error.message);
        process.exit(1);
    }
};

testRegisterAdmin();
