# Stripe Setup Guide for FrenchTutor

## Step 1: Get Your Stripe API Keys

1. Create a Stripe account at https://stripe.com
2. Go to Developers > API Keys
3. Copy your **Publishable key** and **Secret key** (use test keys for development)

## Step 2: Set Up Environment Variables

Create a `.env` file in your project root:

```
PORT=3001
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Email settings (optional, for registration confirmations)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
```

## Step 3: Update Frontend Stripe Key

In `script.js`, update the Stripe publishable key:

```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_publishable_key_here';
```

## Step 4: Set Up Stripe Products and Prices for Monthly Subscriptions

### Option A: Using Stripe Dashboard (Recommended for beginners)

1. **Go to Stripe Dashboard → Products**
2. **Create 3 Products:**

   **Product 1: Elementary School French**
   - Name: `Elementary School French`
   - Description: `Monthly French lessons for 3rd-5th grade students`
   - Create Price: `₹3,500` recurring monthly
   - Copy the Price ID (e.g., `price_1ABC123...`)

   **Product 2: Middle School French**
   - Name: `Middle School French`  
   - Description: `Monthly French lessons for 6th-8th grade students`
   - Create Price: `₹4,500` recurring monthly
   - Copy the Price ID (e.g., `price_2DEF456...`)

   **Product 3: High School French**
   - Name: `High School French`
   - Description: `Monthly French lessons for 9th-12th grade students`
   - Create Price: `₹5,500` recurring monthly
   - Copy the Price ID (e.g., `price_3GHI789...`)

3. **Add Price IDs to your `.env` file:**

```env
STRIPE_ELEMENTARY_PRICE_ID=price_1ABC123...
STRIPE_MIDDLE_PRICE_ID=price_2DEF456...
STRIPE_HIGH_PRICE_ID=price_3GHI789...
```

### Option B: Using Stripe CLI or API

```bash
# Create Products and Prices via Stripe CLI
stripe products create --name "Elementary School French" --description "Monthly French lessons for 3rd-5th grade"
stripe prices create --product prod_ABC123 --currency inr --recurring[interval]=month --unit-amount 350000

stripe products create --name "Middle School French" --description "Monthly French lessons for 6th-8th grade"  
stripe prices create --product prod_DEF456 --currency inr --recurring[interval]=month --unit-amount 450000

stripe products create --name "High School French" --description "Monthly French lessons for 9th-12th grade"
stripe prices create --product prod_GHI789 --currency inr --recurring[interval]=month --unit-amount 550000
```

## Step 5: Set Up Stripe Webhooks

**Important**: For production subscriptions, you MUST set up webhooks to handle subscription events.

1. **Go to Stripe Dashboard → Webhooks**
2. **Add endpoint**: `https://yoursite.com/api/stripe-webhook`
3. **Select events to send**:
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. **Copy the webhook signing secret** → Add to `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Step 6: Test Your Setup

1. Start your server: `npm start`
2. Go to `http://localhost:3001/register.html`
3. Complete registration with test card: `4242 4242 4242 4242`
4. Check Stripe Dashboard → Customers and Subscriptions to verify

## Payment Methods

The system supports:
- **Credit/Debit Cards**: Via Stripe Elements
- **UPI**: For Indian customers (via Stripe)
- **Bank Transfer**: Manual bank transfer with instructions

## Test Cards

For testing payments:
- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **UPI Test**: Use any valid UPI ID in test mode

## Going Live

1. Replace test API keys with live keys
2. Update webhook endpoint to production URL
3. Test all payment flows in live mode
4. Set up proper SSL certificate for your domain

## Monthly Subscription Flow

Once properly set up:

1. **Student registers** → Stripe Customer created
2. **Payment processed** → Stripe Subscription created  
3. **Monthly billing** → Automatic via Stripe
4. **Student portal** → Manage subscription, view invoices
5. **Email notifications** → Payment confirmations, failures 