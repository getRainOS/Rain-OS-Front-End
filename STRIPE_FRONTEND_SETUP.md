# Stripe Frontend Integration Guide for Rain OS

## Overview
This guide explains how to set up Stripe payments in the Rain OS frontend to work with the backend payment system.

## Prerequisites
- Rain OS Backend running with Stripe configured
- Stripe account with products and prices created
- Node.js and npm installed

## Setup Steps

### 1. Environment Configuration

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Update the values in `.env`:
```env
# Your backend API URL
REACT_APP_API_BASE_URL=http://localhost:3001/api

# Your Stripe publishable key
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 2. Get Your Stripe Price IDs

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Products** section
3. Click on each product to see its prices
4. Copy the Price ID (starts with `price_`)

### 3. Update Price IDs in constants.ts

Edit `/src/constants.ts` and replace the placeholder price IDs:

```typescript
export const STRIPE_PRICE_IDS = {
  // Basic Plan: $29.99/month - 50 analyses
  basic: 'price_YOUR_BASIC_PRICE_ID',

  // Pro Plan: $99.99/month - 200 analyses
  pro: 'price_YOUR_PRO_PRICE_ID',

  // Enterprise Plan: $299.99/month - Unlimited
  enterprise: 'price_YOUR_ENTERPRISE_PRICE_ID',
};
```

### 4. Subscription Plans

The application supports three subscription tiers:

| Plan | Price | Analyses/Month | Features |
|------|-------|----------------|----------|
| **Free** | $0 | 5 | Basic features |
| **Basic** | $29.99 | 50 | Email support, Analytics |
| **Pro** | $99.99 | 200 | Priority support, Multiple sites, API access |
| **Enterprise** | $299.99 | Unlimited | Dedicated support, Custom integration, White label |

### 5. Testing Payments

For testing, use Stripe test mode:

1. Use test API keys (start with `pk_test_` and `sk_test_`)
2. Use test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Authentication: `4000 0025 0000 3155`
3. Any future expiry date and any 3-digit CVC

### 6. Payment Flow

The payment flow works as follows:

1. User clicks "Upgrade" on a plan
2. Frontend calls `/api/stripe/create-checkout-session` with price ID
3. Backend creates Stripe Checkout session
4. User is redirected to Stripe Checkout
5. After payment, user returns to `/dashboard?status=success`
6. Frontend shows success message and refreshes user data
7. Backend webhook updates user subscription in database

### 7. Managing Subscriptions

Users can manage their subscriptions through:

1. **Billing Portal**: Click "Manage Subscription" button
2. **Available actions**:
   - Update payment method
   - Change subscription plan
   - Cancel subscription
   - View invoices

### 8. API Endpoints Used

The frontend uses these backend endpoints:

- `POST /api/stripe/create-checkout-session` - Start subscription
- `POST /api/stripe/create-portal-session` - Manage subscription
- `GET /api/users/me` - Get user subscription status

### 9. Troubleshooting

#### Common Issues:

**"No checkout URL received"**
- Check backend is running
- Verify API_BASE_URL is correct
- Check price ID exists in Stripe

**"Failed to start upgrade process"**
- Verify user is authenticated
- Check API key is valid
- Ensure backend Stripe keys are configured

**Subscription not updating**
- Check webhook is configured in Stripe
- Verify webhook endpoint is accessible
- Check webhook secret is correct

### 10. Production Deployment

For production:

1. Switch to live Stripe keys
2. Update environment variables
3. Use HTTPS for all endpoints
4. Configure production webhook URL
5. Test with real payment methods

### 11. Security Notes

- Never expose secret keys in frontend code
- Always use environment variables for sensitive data
- Validate webhook signatures on backend
- Use HTTPS in production
- Implement proper error handling

## Components Overview

### Key Files:

- `/services/stripe.ts` - Stripe service functions
- `/components/dashboard/BillingPage.tsx` - Subscription plans UI
- `/components/dashboard/DashboardHomePage.tsx` - User subscription status
- `/constants.ts` - Stripe configuration

### Functions:

- `createCheckoutSession(priceId)` - Start subscription checkout
- `createPortalSession()` - Open billing portal
- `handleCheckoutRedirect()` - Handle return from Stripe
- `getSubscriptionTier(limit)` - Determine user's plan
- `formatSubscriptionStatus(status)` - Format status for display

## Support

For issues or questions:
- Check backend logs for API errors
- Review Stripe Dashboard logs
- Ensure webhook events are being received
- Contact support with error messages and logs