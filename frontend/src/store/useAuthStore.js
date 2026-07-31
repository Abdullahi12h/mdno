import { create } from 'zustand';
import api from '../utils/api';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    systemStatus: { isLocked: false, title: '', message: '', codeText: '' },
    fetchSystemStatus: async () => {
        try {
            const { data } = await api.get('/system/status');
            set({ systemStatus: data });
            return data;
        } catch (error) {
            console.error('Failed to fetch system status:', error);
            return null;
        }
    },
    login: async (username, password) => {
        try {
            const { data } = await api.post('/auth/login', { username, password });
            localStorage.setItem('user', JSON.stringify(data));
            set({ user: data });
            return { success: true, user: data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    },
    register: async (formData) => {
        try {
            await api.post('/auth/register', formData);
            return { success: true };
        } catch (error) {
            console.error('Registration failed', error);
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    },
    logout: () => {
        localStorage.removeItem('user');
        set({ user: null });
    },
}));

export default useAuthStore;
