
// export const API_BASE_URL = 'https://356109ff0353.ngrok-free.app/api';
export const API_BASE_URL = 'https://rainosheadlessaeoanalysisengine-production-a3e4.up.railway.app/api';


// Stripe Price IDs for subscription plans
// Free plan (5 analyses/month) is handled by application logic, no Stripe price needed
export const STRIPE_PRICE_IDS = {
  // Business Plan: $29.99/month - 100 analyses per month
  business: 'price_1SeCJH3NMjs4uYdgpi0xB0XN',

  // Pro Plan: $99.99/month - 500 analyses per month
  pro: 'price_1SeCKM3NMjs4uYdgcBRhgIhD',
};

// Reverse mapping to get plan name from price ID
export const PRICE_ID_TO_PLAN: Record<string, { name: string; limit: number }> = {
  'price_1SeCJH3NMjs4uYdgpi0xB0XN': { name: 'Business', limit: 100 },
  'price_1SeCKM3NMjs4uYdgcBRhgIhD': { name: 'Pro', limit: 500 },
};

// Plan details for display
export const PLAN_DETAILS = {
  free: {
    name: 'Free',
    limit: 5,
    price: '$0',
    description: 'Great for hobbyists looking to experiment. Get full access to our 3 Pillar Framework.',
  },
  business: {
    name: 'Business',
    limit: 100,
    price: '$29.99',
    priceId: 'price_1SeCJH3NMjs4uYdgpi0xB0XN',
    description: 'Perfect for local businesses, early-stage startups, product teams and solo-creators optimizing for Gemini, Perplexity, Claude and the emerging ChatGPT shopping experience.',
  },
  pro: {
    name: 'Pro',
    limit: 500,
    price: '$99.99',
    priceId: 'price_1SeCKM3NMjs4uYdgcBRhgIhD',
    description: 'Ideal for enterprises, scaling SaaS brands, product teams and other power users optimizing for Gemini, Perplexity, Claude and the emerging ChatGPT shopping experience.',
  },
};

// Stripe publishable key (for client-side)
// Get this from https://dashboard.stripe.com/test/apikeys
export const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '';
