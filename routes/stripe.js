const express = require('express');
const { body, validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const emailService = require('../services/email');
const dataService = require('../services/data');

const router = express.Router();

// Stripe Price IDs for monthly subscriptions


const SUBSCRIPTION_PRICES = {
    'elementary': process.env.STRIPE_ELEMENTARY_PRICE_ID,
    'middle': process.env.STRIPE_MIDDLE_PRICE_ID,
    'high': process.env.STRIPE_HIGH_PRICE_ID
};

// Registration with payment processing
router.post('/register', [
    body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
    body('lastName').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
    body('frenchLevel').notEmpty().withMessage('French level is required'),
    body('gradeLevel').isIn(['elementary', 'middle', 'high']).withMessage('Valid grade level is required'),
    body('paymentMethod').isIn(['card', 'upi', 'bank']).withMessage('Valid payment method is required')
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

        const registrationData = req.body;
        const amount = calculateAmount(registrationData);

        if (registrationData.paymentMethod === 'card') {
            // Process Stripe payment
            return await processStripePayment(req, res, registrationData, amount);
        } else if (registrationData.paymentMethod === 'upi') {
            // Process UPI payment
            return await processUPIPayment(req, res, registrationData, amount);
        } else if (registrationData.paymentMethod === 'bank') {
            // Handle bank transfer
            return await processBankTransfer(req, res, registrationData, amount);
        }

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Create payment intent for Stripe
router.post('/create-payment-intent', [
    body('registrationData').isObject().withMessage('Registration data is required'),
    body('amount').isInt({ min: 50 }).withMessage('Valid amount is required') // minimum ₹0.50
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { registrationData, amount } = req.body;

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe expects paise for INR
            currency: 'inr',
            description: `French Monthly Subscription - ${registrationData.gradeLevel} grade level`,
            metadata: {
                customerEmail: registrationData.email,
                customerName: `${registrationData.firstName} ${registrationData.lastName}`,
                gradeLevel: registrationData.gradeLevel,
                subscriptionType: 'monthly',
                specialties: JSON.stringify(registrationData.specialties || [])
            },
            receipt_email: registrationData.email
        });

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });

    } catch (error) {
        console.error('Payment intent creation error:', error);
        console.error('Error details:', {
            message: error.message,
            type: error.type,
            code: error.code,
            param: error.param
        });
        res.status(500).json({
            success: false,
            message: 'Failed to create payment intent',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            stripeError: process.env.NODE_ENV === 'development' ? {
                type: error.type,
                code: error.code,
                param: error.param
            } : undefined
        });
    }
});

// Confirm payment and complete registration
router.post('/confirm-payment', [
    body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required'),
    body('registrationData').isObject().withMessage('Registration data is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { paymentIntentId, registrationData } = req.body;

        // Retrieve the payment intent to confirm it succeeded
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            // Save registration to database
            const registrationId = await dataService.saveRegistration({
                ...registrationData,
                paymentIntentId,
                amount: paymentIntent.amount / 100, // Convert back from cents
                paymentStatus: 'completed',
                registrationDate: new Date().toISOString()
            });

            // Send confirmation email
            await emailService.sendRegistrationConfirmation(registrationData, registrationId, paymentIntent.amount / 100);

            res.json({
                success: true,
                message: 'Registration completed successfully!',
                registrationId: registrationId
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment was not successful',
                paymentStatus: paymentIntent.status
            });
        }

    } catch (error) {
        console.error('Payment confirmation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to confirm payment',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
        switch (event.type) {
            case 'customer.subscription.created':
                console.log('Subscription created:', event.data.object.id);
                await handleSubscriptionCreated(event.data.object);
                break;

            case 'invoice.payment_succeeded':
                console.log('Payment succeeded for subscription:', event.data.object.subscription);
                await handlePaymentSucceeded(event.data.object);
                break;

            case 'invoice.payment_failed':
                console.log('Payment failed for subscription:', event.data.object.subscription);
                await handlePaymentFailed(event.data.object);
                break;

            case 'customer.subscription.updated':
                console.log('Subscription updated:', event.data.object.id);
                await handleSubscriptionUpdated(event.data.object);
                break;

            case 'customer.subscription.deleted':
                console.log('Subscription cancelled:', event.data.object.id);
                await handleSubscriptionCancelled(event.data.object);
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (error) {
        console.error('Error handling webhook event:', error);
        return res.status(500).send('Webhook handler failed');
    }

    res.json({ received: true });
});

// Create UPI payment intent for Stripe
router.post('/create-upi-payment-intent', [
    body('registrationData').isObject().withMessage('Registration data is required'),
    body('amount').isInt({ min: 50 }).withMessage('Valid amount is required') // minimum ₹0.50
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { registrationData, amount } = req.body;

        // Create a PaymentIntent with UPI payment method for India
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe expects paise for INR
            currency: 'inr',
            payment_method_types: ['upi'],
            description: `French Monthly Subscription - ${registrationData.gradeLevel} grade (4 classes per month)`,
            metadata: {
                customerEmail: registrationData.email,
                customerName: `${registrationData.firstName} ${registrationData.lastName}`,
                gradeLevel: registrationData.gradeLevel,
                subscriptionType: 'monthly',
                classesPerMonth: '4',
                specialties: JSON.stringify(registrationData.specialties || [])
            },
            receipt_email: registrationData.email
        });

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });

    } catch (error) {
        console.error('UPI payment intent creation error:', error);
        console.error('Error details:', {
            message: error.message,
            type: error.type,
            code: error.code,
            param: error.param
        });
        res.status(500).json({
            success: false,
            message: 'Failed to create UPI payment intent',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            stripeError: process.env.NODE_ENV === 'development' ? {
                type: error.type,
                code: error.code,
                param: error.param
            } : undefined
        });
    }
});

// Create subscription instead of one-time payment intent
router.post('/create-subscription-intent', [
    body('registrationData').isObject(),
    body('registrationData.email').isEmail().withMessage('Valid email is required'),
    body('registrationData.gradeLevel').isIn(['elementary', 'middle', 'high']).withMessage('Valid grade level is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            message: 'Validation failed',
            errors: errors.array() 
        });
    }

    try {
        const { registrationData } = req.body;
        
        const priceId = SUBSCRIPTION_PRICES[registrationData.gradeLevel];
        
        if (!priceId) {
            return res.status(400).json({ 
                success: false,
                error: 'Invalid grade level or missing price configuration',
                gradeLevel: registrationData.gradeLevel,
                availableGrades: Object.keys(SUBSCRIPTION_PRICES)
            });
        }

        // Create or retrieve Stripe customer
        let customer;
        const existingCustomers = await stripe.customers.list({
            email: registrationData.email,
            limit: 1
        });

        if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
        } else {
            customer = await stripe.customers.create({
                email: registrationData.email,
                name: `${registrationData.firstName} ${registrationData.lastName}`,
                phone: registrationData.phone,
                metadata: {
                    gradeLevel: registrationData.gradeLevel,
                    registrationSource: 'website',
                    specialties: JSON.stringify(registrationData.specialties || [])
                }
            });
        }

        // Create setup intent for payment method collection
        const setupIntent = await stripe.setupIntents.create({
            customer: customer.id,
            payment_method_types: ['card'],
            usage: 'off_session',
            metadata: {
                gradeLevel: registrationData.gradeLevel,
                registrationData: JSON.stringify(registrationData)
            }
        });

        res.json({
            success: true,
            setupIntent: {
                id: setupIntent.id,
                client_secret: setupIntent.client_secret
            },
            customer: {
                id: customer.id,
                email: customer.email
            },
            priceId: priceId
        });

    } catch (error) {
        console.error('Error creating subscription setup:', error);
        res.status(500).json({ error: 'Failed to create subscription setup' });
    }
});

// Confirm subscription after payment method is attached
router.post('/confirm-subscription', [
    body('setupIntentId').notEmpty().withMessage('Setup Intent ID is required'),
    body('customerId').notEmpty().withMessage('Customer ID is required'),
    body('priceId').notEmpty().withMessage('Price ID is required'),
    body('registrationData').isObject()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { setupIntentId, customerId, priceId, registrationData } = req.body;

        // Retrieve the setup intent to get the payment method
        const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);
        
        if (setupIntent.status !== 'succeeded') {
            return res.status(400).json({ error: 'Payment method setup failed' });
        }

        // Create the subscription
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            default_payment_method: setupIntent.payment_method,
            collection_method: 'charge_automatically',
            expand: ['latest_invoice.payment_intent'],
            metadata: {
                gradeLevel: registrationData.gradeLevel,
                customerName: `${registrationData.firstName} ${registrationData.lastName}`,
                registrationSource: 'website'
            }
        });

        // Save registration data
        const registrationId = await dataService.saveRegistration({
            ...registrationData,
            customerId: customerId,
            subscriptionId: subscription.id,
            paymentStatus: subscription.status,
            registrationDate: new Date().toISOString()
        });

        // Send confirmation email
        const monthlyAmount = getMonthlyAmount(registrationData.gradeLevel);
        await emailService.sendSubscriptionConfirmation(registrationData, registrationId, monthlyAmount, subscription.id);

        res.json({
            success: true,
            subscription: {
                id: subscription.id,
                status: subscription.status,
                current_period_start: subscription.current_period_start,
                current_period_end: subscription.current_period_end
            },
            registrationId: registrationId
        });

    } catch (error) {
        console.error('Error creating subscription:', error);
        res.status(500).json({ error: 'Failed to create subscription' });
    }
});

// Helper functions
async function processStripePayment(req, res, registrationData, amount) {
    // For demonstration, we'll create a payment intent and return it
    // In production, you might want to separate this into multiple endpoints
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe expects paise for INR
            currency: 'inr',
            description: `French Monthly Subscription - ${registrationData.gradeLevel} grade level`,
            metadata: {
                customerEmail: registrationData.email,
                customerName: `${registrationData.firstName} ${registrationData.lastName}`,
                gradeLevel: registrationData.gradeLevel,
                subscriptionType: 'monthly'
            },
            receipt_email: registrationData.email
        });

        // Save pending registration
        const registrationId = await dataService.saveRegistration({
            ...registrationData,
            paymentIntentId: paymentIntent.id,
            amount: amount,
            paymentStatus: 'pending',
            registrationDate: new Date().toISOString()
        });

        res.json({
            success: true,
            message: 'Payment processing initiated',
            clientSecret: paymentIntent.client_secret,
            registrationId: registrationId
        });

    } catch (error) {
        throw error;
    }
}

async function processUPIPayment(req, res, registrationData, amount) {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe expects paise for INR
            currency: 'inr',
            payment_method_types: ['upi'],
            description: `French Monthly Subscription - ${registrationData.gradeLevel} grade (4 classes per month)`,
            metadata: {
                customerEmail: registrationData.email,
                customerName: `${registrationData.firstName} ${registrationData.lastName}`,
                gradeLevel: registrationData.gradeLevel,
                subscriptionType: 'monthly',
                classesPerMonth: '4'
            },
            receipt_email: registrationData.email
        });

        // Save pending registration
        const registrationId = await dataService.saveRegistration({
            ...registrationData,
            paymentIntentId: paymentIntent.id,
            amount: amount,
            paymentStatus: 'pending_upi',
            registrationDate: new Date().toISOString()
        });

        res.json({
            success: true,
            message: 'UPI payment processing initiated',
            clientSecret: paymentIntent.client_secret,
            registrationId: registrationId
        });

    } catch (error) {
        throw error;
    }
}

async function processBankTransfer(req, res, registrationData, amount) {
    try {
        // Save registration with bank transfer status
        const registrationId = await dataService.saveRegistration({
            ...registrationData,
            amount: amount,
            paymentStatus: 'pending_bank_transfer',
            registrationDate: new Date().toISOString()
        });

        // Send bank transfer instructions
        await emailService.sendBankTransferInstructions(registrationData, registrationId, amount);

        res.json({
            success: true,
            message: 'Registration saved! Check your email for bank transfer instructions.',
            registrationId: registrationId
        });

    } catch (error) {
        throw error;
    }
}

function calculateAmount(registrationData) {
    // Monthly subscription prices (in INR) for different grade levels
    const monthlySubscriptionPrices = {
        'elementary': 3500,
        'middle': 4500,
        'high': 5500
    };
    
    // Get monthly price for selected grade level
    const monthlyPrice = monthlySubscriptionPrices[registrationData.gradeLevel];
    
    return Math.max(monthlyPrice, 0); // Ensure non-negative amount
}

// Get subscription prices for different grade levels
function getMonthlyAmount(gradeLevel) {
    const amounts = {
        'elementary': 3500,
        'middle': 4500,
        'high': 5500
    };
    return amounts[gradeLevel] || 0;
}

// Webhook event handlers
async function handleSubscriptionCreated(subscription) {
    // Update registration record with subscription details
    try {
        await dataService.updateRegistrationBySubscription(subscription.id, {
            subscriptionStatus: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
        });
    } catch (error) {
        console.error('Error updating registration after subscription created:', error);
    }
}

async function handlePaymentSucceeded(invoice) {
    // Send payment confirmation email
    try {
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        const customer = await stripe.customers.retrieve(subscription.customer);
        
        // Send email notification
        await emailService.sendMonthlyPaymentConfirmation(
            customer.email,
            customer.name,
            invoice.amount_paid / 100, // Convert from paise to rupees
            new Date(invoice.created * 1000)
        );

        // Update registration record
        await dataService.updateRegistrationBySubscription(subscription.id, {
            lastPaymentDate: new Date(invoice.created * 1000),
            paymentStatus: 'active'
        });
    } catch (error) {
        console.error('Error handling successful payment:', error);
    }
}

async function handlePaymentFailed(invoice) {
    // Send payment failure notification
    try {
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        const customer = await stripe.customers.retrieve(subscription.customer);
        
        // Send email notification
        await emailService.sendPaymentFailedNotification(
            customer.email,
            customer.name,
            invoice.amount_due / 100, // Convert from paise to rupees
            new Date(invoice.due_date * 1000)
        );

        // Update registration record
        await dataService.updateRegistrationBySubscription(subscription.id, {
            paymentStatus: 'payment_failed',
            lastFailedPayment: new Date(invoice.created * 1000)
        });
    } catch (error) {
        console.error('Error handling failed payment:', error);
    }
}

async function handleSubscriptionUpdated(subscription) {
    // Update registration record with new subscription details
    try {
        await dataService.updateRegistrationBySubscription(subscription.id, {
            subscriptionStatus: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
        });
    } catch (error) {
        console.error('Error updating registration after subscription update:', error);
    }
}

async function handleSubscriptionCancelled(subscription) {
    // Update registration record and send cancellation email
    try {
        const customer = await stripe.customers.retrieve(subscription.customer);
        
        // Send cancellation confirmation email
        await emailService.sendSubscriptionCancelledNotification(
            customer.email,
            customer.name,
            new Date(subscription.canceled_at * 1000)
        );

        // Update registration record
        await dataService.updateRegistrationBySubscription(subscription.id, {
            subscriptionStatus: 'cancelled',
            cancelledAt: new Date(subscription.canceled_at * 1000)
        });
    } catch (error) {
        console.error('Error handling subscription cancellation:', error);
    }
}

// Student Portal Login API
router.post('/student-login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('subscriptionId').matches(/^sub_/).withMessage('Valid subscription ID is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Please provide valid email and subscription ID'
            });
        }

        const { email, subscriptionId } = req.body;

        // Check local registration data first
        const dataService = require('../services/data');
        const registrations = await dataService.searchRegistrations({ email: email });
        
        const registration = registrations.find(reg => 
            reg.subscriptionId === subscriptionId || 
            reg.email === email
        );

        if (!registration) {
            return res.status(400).json({
                success: false,
                message: 'No registration found with these credentials'
            });
        }

        // Verify subscription with Stripe (optional - for real-time status)
        let subscriptionStatus = 'active';
        try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            subscriptionStatus = subscription.status;
        } catch (stripeError) {
            console.log('Stripe verification failed, using local data:', stripeError.message);
        }

        // Return student and subscription data
        res.json({
            success: true,
            student: {
                firstName: registration.firstName,
                lastName: registration.lastName,
                email: registration.email,
                gradeLevel: registration.gradeLevel,
                registrationId: registration.id,
                registrationDate: registration.registrationDate
            },
            subscription: {
                id: subscriptionId,
                status: subscriptionStatus,
                gradeLevel: registration.gradeLevel,
                monthlyAmount: registration.amount,
                planName: `${registration.gradeLevel.charAt(0).toUpperCase() + registration.gradeLevel.slice(1)} School Plan`
            }
        });

    } catch (error) {
        console.error('Student login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

module.exports = router; 