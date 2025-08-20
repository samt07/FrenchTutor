const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs-extra');
require('dotenv').config();

// Import route handlers
const stripeRoutes = require('./routes/stripe');
const emailService = require('./services/email');
const dataService = require('./services/data');

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for deployment platforms (Railway, Heroku, etc.) - only trust the first proxy
app.set('trust proxy', 1);

// Security middleware - configured for Stripe integration
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'", 
                "'unsafe-inline'", // Allow inline scripts for onclick handlers
                "https://js.stripe.com" // Allow Stripe.js
            ],
            styleSrc: [
                "'self'", 
                "'unsafe-inline'", // Allow inline styles
                "https://fonts.googleapis.com",
                "https://cdnjs.cloudflare.com"
            ],
            fontSrc: [
                "'self'",
                "https://fonts.gstatic.com",
                "https://cdnjs.cloudflare.com"
            ],
            connectSrc: [
                "'self'",
                "https://api.stripe.com" // Allow connections to Stripe API
            ],
            frameSrc: [
                "'self'",
                "https://js.stripe.com" // Allow Stripe frames
            ]
        }
    }
}));

// Rate limiting with proxy-aware configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    trustProxy: true, // Explicitly trust proxy for this rate limiter
    keyGenerator: (req) => {
        // Use the real IP from proxy headers if available, fallback to connection IP
        return req.ip || req.connection.remoteAddress || 'unknown';
    }
});
app.use('/api/', limiter);

// Payment-specific rate limiting
const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 payment attempts per windowMs
    message: 'Too many payment attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    trustProxy: true, // Explicitly trust proxy for this rate limiter
    keyGenerator: (req) => {
        // Use the real IP from proxy headers if available, fallback to connection IP
        return req.ip || req.connection.remoteAddress || 'unknown';
    }
});

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (your website)
app.use(express.static('./', {
    index: 'index.html',
    extensions: ['html']
}));

// Initialize data directories
dataService.initializeDataDirectories();

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Demo booking endpoint
app.post('/api/book-demo', [
    body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
    body('lastName').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('frenchLevel').notEmpty().withMessage('French level is required'),
    body('preferredDate').isISO8601().withMessage('Valid date is required'),
    body('preferredTime').notEmpty().withMessage('Preferred time is required'),
    body('timezone').notEmpty().withMessage('Timezone is required')
], async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const demoData = req.body;
        const bookingId = await dataService.saveDemoBooking(demoData);

        // Send confirmation email
        await emailService.sendDemoConfirmation(demoData, bookingId);

        res.json({
            success: true,
            message: 'Demo lesson booked successfully!',
            bookingId: bookingId
        });

    } catch (error) {
        console.error('Demo booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to book demo lesson. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Registration with payment processing
app.use('/api/stripe', paymentLimiter);
app.use('/api', stripeRoutes);

// Get registration data (admin endpoint)
app.get('/api/registrations', (req, res) => {
    // In production, add authentication here
    try {
        const registrations = dataService.getRegistrations();
        res.json({
            success: true,
            data: registrations
        });
    } catch (error) {
        console.error('Error fetching registrations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch registrations'
        });
    }
});

// Get demo bookings (admin endpoint)
app.get('/api/demos', (req, res) => {
    // In production, add authentication here
    try {
        const demos = dataService.getDemoBookings();
        res.json({
            success: true,
            data: demos
        });
    } catch (error) {
        console.error('Error fetching demo bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch demo bookings'
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 FrenchTutor server running on port ${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
    console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    if (process.env.NODE_ENV !== 'production') {
        console.log('⚠️  Using development mode - remember to set up environment variables for production');
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully');
    process.exit(0);
});

module.exports = app; 