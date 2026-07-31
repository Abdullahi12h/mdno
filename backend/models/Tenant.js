import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        logo: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['active', 'suspended', 'locked'],
            default: 'active',
        },
        subscriptionExpiry: {
            type: Date,
            default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
        },
        maxStudents: {
            type: Number,
            default: 1000,
        },
        maxTeachers: {
            type: Number,
            default: 100,
        },
    },
    {
        timestamps: true,
    }
);

const Tenant = mongoose.model('Tenant', tenantSchema);
export default Tenant;
