# 🔍 How to Find Your Stripe Price IDs - Visual Guide

## The Problem
You're using "Business" and "Pro" as values, but Stripe needs the actual Price ID which looks like:
`price_1QRp5AHy8nR8fQSpP1234567`

## Step-by-Step Visual Guide

### Step 1: Open Stripe Products
Go to: https://dashboard.stripe.com/test/products

You'll see something like:
```
📦 Products
├── Business (prod_TWscYSsLOg8Ap6)
└── Pro (prod_TWsddILDrKpBOb)
```

### Step 2: Click on "Business" Product
When you click on the Business product, you'll see:

```
Product details
─────────────────
Name: Business
ID: prod_TWscYSsLOg8Ap6

Pricing
─────────────────
🏷️ $29.99 USD / month
   ID: price_1QRp5AHy8nR8fQSpP... ← THIS IS WHAT YOU NEED!
   └── Click to expand
```

### Step 3: Copy the Price ID
Click on the price or the three dots (...) next to it.
You'll see the full Price ID:
```
Price ID: price_1QRp5AHy8nR8fQSpP1234567
         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
         COPY THIS ENTIRE STRING!
```

### Step 4: Do the Same for "Pro" Product
Click on Pro product and find its Price ID.

### Step 5: Update Your constants.ts

Replace the empty strings with the actual Price IDs:

```javascript
export const STRIPE_PRICE_IDS = {
  // Business Plan: $29.99/month
  pro: 'price_1QRp5AHy8nR8fQSpP1234567',  // ← Actual Price ID from Business product

  // Pro Plan: $99.99/month
  enterprise: 'price_1QRp5BHy8nR8fQSpQ7890123',  // ← Actual Price ID from Pro product
};
```

## What the Stripe Dashboard Shows

### If You See This:
```
Products
└── Business
    └── Pricing
        └── $29.99/month
            └── Details:
                - Price ID: price_1QRp5AHy8nR8fQSpP1234567 ← COPY THIS
                - Product: prod_TWscYSsLOg8Ap6 (don't use this)
                - Currency: USD
                - Billing: Recurring monthly
```

### You Need to Copy:
`price_1QRp5AHy8nR8fQSpP1234567`

NOT:
- ❌ "Business" (product name)
- ❌ "prod_TWscYSsLOg8Ap6" (product ID)
- ❌ "$29.99" (price amount)

## Quick Check
Your Price IDs should:
- ✅ Start with `price_`
- ✅ Be about 30-40 characters long
- ✅ Contain random letters and numbers
- ❌ NOT be just "Business" or "Pro"
- ❌ NOT start with `prod_`

## Where Exactly in Stripe Dashboard?

1. **Main Products Page**: Shows product names and IDs
2. **Click Product Name**: Opens product details
3. **Look for "Pricing" Section**: Shows all prices
4. **Each Price Has**:
   - Amount ($29.99)
   - Interval (monthly)
   - **Price ID** (price_...) ← YOU NEED THIS!

## Still Can't Find It?

Try this URL pattern:
https://dashboard.stripe.com/test/products/prod_TWscYSsLOg8Ap6/prices

Replace `prod_TWscYSsLOg8Ap6` with your product ID.

## Example of What to Look For:

```
┌─────────────────────────────────────┐
│ Business                            │
│ prod_TWscYSsLOg8Ap6                │
│                                     │
│ Pricing                             │
│ ┌─────────────────────────────────┐ │
│ │ $29.99 / month                  │ │
│ │ price_1QRp5AHy8nR8fQSpP123... │ │ ← CLICK HERE
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

When you click, you'll see:
```
Price details
─────────────
ID: price_1QRp5AHy8nR8fQSpP1234567  ← COPY THIS ENTIRE ID
Product: Business
Amount: $29.99
```