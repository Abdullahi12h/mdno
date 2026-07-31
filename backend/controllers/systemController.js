import SystemSetting from '../models/SystemSetting.js';

// @desc    Get current system status
// @route   GET /api/system/status
// @access  Public
export const getSystemStatus = async (req, res) => {
    try {
        let setting = await SystemSetting.findOne({ key: 'system_status' });
        if (!setting) {
            setting = await SystemSetting.create({ key: 'system_status', isLocked: false });
        }
        res.json({
            isLocked: setting.isLocked,
            title: setting.title,
            message: setting.message,
            codeText: setting.codeText,
            updatedAt: setting.updatedAt,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle system lock status & update info
// @route   POST /api/system/toggle
// @access  Private/SuperAdmin
export const toggleSystemLock = async (req, res) => {
    try {
        const { isLocked, title, message, codeText } = req.body;

        let setting = await SystemSetting.findOne({ key: 'system_status' });
        if (!setting) {
            setting = new SystemSetting({ key: 'system_status' });
        }

        if (typeof isLocked === 'boolean') {
            setting.isLocked = isLocked;
        } else {
            setting.isLocked = !setting.isLocked; // toggle if not provided explicitly
        }

        if (title !== undefined) setting.title = title;
        if (message !== undefined) setting.message = message;
        if (codeText !== undefined) setting.codeText = codeText;
        if (req.user) setting.updatedBy = req.user._id;

        await setting.save();

        res.json({
            message: setting.isLocked ? 'System is now locked' : 'System is now unlocked',
            isLocked: setting.isLocked,
            title: setting.title,
            messageText: setting.message,
            codeText: setting.codeText,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
