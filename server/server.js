import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import * as Sentry from '@sentry/node';
import { clerkWebhooks } from './controllers/webhooks.js';
import companyRoutes from './routes/companyRoutes.js';
import connnectCloudinary from './config/cloudinary.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { clerkMiddleware } from '@clerk/express';

// Initialize Express
const app = express();

// Connect database
await connectDB();
await connnectCloudinary();

// Middlewares
app.use(cors({
    origin: 'https://job-portal-client-cwg97qcp2-nandish-panchals-projects.vercel.app', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json({ limit: '10mb' })); // Increase payload size limit
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(clerkMiddleware());

// Routes
app.get('/', (req, res) => res.send('API WORKING'));
app.get('/debug-sentry', function mainHandler(req, res) {
    throw new Error('Sentry error!');
});

app.post('/webhooks', clerkWebhooks);
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});