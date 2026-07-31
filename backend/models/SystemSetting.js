import mongoose from 'mongoose';

const systemSettingSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            default: 'system_status',
        },
        isLocked: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: 'BISHA WAAYEE ISKA BIXI LACAGTA!',
        },
        message: {
            type: String,
            default: 'Fadlan iska bixi lacagta bisha kuna tuur lambarkaan *712*616913269*#',
        },
        codeText: {
            type: String,
            default: '*712*616913269*#',
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

const SystemSetting = mongoose.model('SystemSetting', systemSettingSchema);
export default SystemSetting;
