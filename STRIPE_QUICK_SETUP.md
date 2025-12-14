# Quick Stripe Setup Guide

## Step 1: Create Your Stripe Products & Prices

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/products)
2. Click **"+ Add product"**
3. Create these 2 products:

### Pro Plan
- **Product Name:** Pro Plan
- **Description:** 200 analyses per month
- **Price:** $29.99 per month
- **After creating the price, add metadata:**
  - Key: `analysis_limit`
  - Value: `100`

### Enterprise Plan
- **Product Name:** Enterprise Plan
- **Description:** Unlimited analyses
- **Price:** $99.99 per month
- **After creating the price, add metadata:**
  - Key: `analysis_limit`
  - Value: `500`

## Step 2: Get Your Price IDs

1. Click on each product in Stripe Dashboard
2. Copy the Price ID (starts with `price_`)
3. Update `/constants.ts`:

```javascript
export const STRIPE_PRICE_IDS = {
  pro: 'price_YOUR_PRO_ID_HERE',      // Replace with actual Pro price ID
  enterprise: 'price_YOUR_ENTERPRISE_ID_HERE', // Replace with actual Enterprise price ID
};
```

## Step 3: Get Your API Keys

1. Go to [API Keys](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Create a `.env` file in the frontend root:

```bash
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

## Step 4: Test The Integration

1. Start your backend server (should be running on port 3001)
2. Start the frontend: `npm start`
3. Go to the Billing page
4. Try upgrading using test card: `4242 4242 4242 4242`

## Pricing Structure

| Plan | Price | Analyses/Month | Who's it for |
|------|-------|----------------|--------------|
| **Free** | $0 | 5 | Testing & small personal sites |
| **Pro** | $29.99 | 200 | Growing businesses & agencies |
| **Enterprise** | $99.99 | Unlimited | Large organizations |

## Troubleshooting

If you see "No such price" error:
- Make sure you're using Price IDs (start with `price_`), not Product IDs
- Ensure you're in the correct mode (test vs live) in Stripe Dashboard
- Check that the price IDs in `constants.ts` match exactly

## Important Notes

- The Free plan (5 analyses) is handled by the application, no Stripe price needed
- Make sure your backend `.env` has matching Stripe keys
- Use test mode first before going live