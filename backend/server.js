import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import coreRoutes from './routes/coreRoutes.js';
import userRoutes from './routes/userRoutes.js';
import managementRoutes from './routes/managementRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import backupRoutes from './routes/backupRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import graduationJob from './jobs/graduationJob.js';
import path from 'path';
import { Server } from 'socket.io';
import http from 'http';

import systemRoutes from './routes/systemRoutes.js';
import { seedSuperAdmin } from './utils/seedSuperAdmin.js';

dotenv.config();

connectDB().then(() => {
    seedSuperAdmin();
});

// Initialize chron jobs
graduationJob();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://alh-sk.nidwa.com'
];

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PATCH'],
    },
});

app.set('io', io);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Socket.io logic
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join_order', (orderId) => {
        socket.join(orderId);
        console.log(`User joined order room: ${orderId}`);
    });

    socket.on('send_message', (data) => {
        // Broadcast message to everyone in the room (including sender)
        io.to(data.orderId).emit('receive_message', data);
    });

    socket.on('status_update', (data) => {
        io.to(data.orderId).emit('status_changed', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/core', coreRoutes);
app.use('/api/users', userRoutes);
app.use('/api/management', managementRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/system', systemRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
