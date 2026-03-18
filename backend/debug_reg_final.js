async function runTest() {
    try {
        const response = await fetch('http://localhost:5001/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'salma admin',
                username: 'salma',
                password: 'password123',
                role: 'Admin',
                phone: '123456',
                whatsapp: '123456'
            })
        });
        const data = await response.json();
        console.log('STATUS:', response.status);
        console.log('DATA:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.log('ERROR:', err.message);
    }
}

runTest();
