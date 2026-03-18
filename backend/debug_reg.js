import axios from 'axios';

const testApiReg = async () => {
    try {
        const response = await axios.post('http://localhost:5001/api/auth/register', {
            name: 'salma',
            username: `salma_${Date.now()}`,
            password: 'password123',
            role: 'Admin',
            phone: '2345678',
            whatsapp: '2345678'
        });
        console.log('Success:', response.status);
    } catch (error) {
        console.log('Error Status:', error.response?.status);
        console.log('Error Data:', JSON.stringify(error.response?.data));
    }
};

testApiReg();
