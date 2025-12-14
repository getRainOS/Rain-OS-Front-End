# How to Get Your Stripe Price IDs

## ⚠️ Important: Product ID vs Price ID

You're getting the error **"No such price: 'prod_TWsddILDrKpBOb'"** because you're using a **Product ID** instead of a **Price ID**.

- **Product ID**: Starts with `prod_` (e.g., `prod_TWsddILDrKpBOb`)
- **Price ID**: Starts with `price_` (e.g., `price_1OJ4K2Hy8nR8fQabc123`)

## Steps to Get Your Price IDs:

### 1. Go to Stripe Products Page
Navigate to: https://dashboard.stripe.com/test/products

### 2. Click on Your Product
You have two products:
- **prod_TWscYSsLOg8Ap6** (Business Plan)
- **prod_TWsddILDrKpBOb** (Pro Plan)

Click on each one.

### 3. Find the Price Section
Once you click on a product, you'll see:
```
Product details
├── Product name: Your Plan Name
├── Description: ...
└── Pricing:  <-- Look here!
    └── $29.99/month [price_1OJ4K2Hy8nR8...]  <-- This is your Price ID!
```

### 4. Copy the Price ID
Click on the price or look for the ID that starts with `price_`

### 5. Update Your constants.ts

```javascript
export const STRIPE_PRICE_IDS = {
  // Replace these with your actual Price IDs
  pro: 'price_xxxxxx',        // From prod_TWscYSsLOg8Ap6
  enterprise: 'price_yyyyyy',  // From prod_TWsddILDrKpBOb
};
```

## Visual Guide:

```
Stripe Dashboard
  └── Products
      └── prod_TWscYSsLOg8Ap6 (Business Plan)
          └── Pricing
              └── $29.99/month
                  └── Price ID: price_1OJ4K2... ← COPY THIS!

      └── prod_TWsddILDrKpBOb (Pro Plan)
          └── Pricing
              └── $99.99/month
                  └── Price ID: price_1OJ5L3... ← COPY THIS!
```

## Alternative: Create New Prices

If you can't find Price IDs, you may need to create prices:

1. Click on your product
2. Click **"Add another price"**
3. Set the price amount and billing period
4. Save and copy the new Price ID

## Verify Your Setup:

After updating constants.ts with the correct Price IDs, test:

1. Try upgrading to a plan
2. Use test card: `4242 4242 4242 4242`
3. Check if checkout page loads successfully

## Still Having Issues?

Make sure:
- You're in the correct mode (Test vs Live)
- The Price IDs match your Stripe dashboard mode
- Your backend `.env` has matching Stripe keys
- The prices have the correct metadata (`analysis_limit`)