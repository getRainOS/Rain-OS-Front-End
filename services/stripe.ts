// Stripe-related service functions
import { api } from './api';
import { STRIPE_PUBLISHABLE_KEY ,PRICE_ID_TO_PLAN, PLAN_DETAILS} from '../constants';

export interface CheckoutSessionResponse {
  url: string;
}

export interface PortalSessionResponse {
  url: string;
}

/**
 * Creates a Stripe Checkout session for subscribing to a plan
 * @param priceId The Stripe Price ID for the subscription plan
 * @returns The checkout session URL to redirect the user to
 */
export async function createCheckoutSession(priceId: string): Promise<string> {
  try {
    const response = await api.post<CheckoutSessionResponse>(
      '/stripe/create-checkout-session',
      { priceId }
    );

    if (!response.url) {
      throw new Error('No checkout URL received from server');
    }

    return response.url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Creates a Stripe Billing Portal session for managing subscriptions
 * @returns The portal session URL to redirect the user to
 */
export async function createPortalSession(): Promise<string> {
  try {
    const response = await api.post<PortalSessionResponse>(
      '/stripe/create-portal-session',
      {}
    );

    if (!response.url) {
      throw new Error('No portal URL received from server');
    }

    return response.url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}

/**
 * Handles redirect after Stripe checkout completion
 * Parses URL parameters to determine success/cancel status
 */
export function handleCheckoutRedirect(): { status: 'success' | 'cancelled' | null; message?: string } {
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('status');

  if (status === 'success') {
    return {
      status: 'success',
      message: 'Subscription successful! Your plan has been activated.'
    };
  } else if (status === 'cancelled') {
    return {
      status: 'cancelled',
      message: 'Subscription cancelled. You can try again anytime.'
    };
  }

  return { status: null };
}

/**
 * Loads Stripe.js dynamically (optional - for advanced integrations)
 * Not needed for redirect-based checkout, but useful for embedded checkout
 */
export async function loadStripe() {
  // This would require @stripe/stripe-js package
  // For now, we're using redirect-based checkout which doesn't need this
  if (!STRIPE_PUBLISHABLE_KEY) {
    throw new Error('Stripe publishable key is not configured');
  }

  // If you want to use embedded checkout in the future:
  // import { loadStripe } from '@stripe/stripe-js';
  // return loadStripe(STRIPE_PUBLISHABLE_KEY);
}

/**
 * Helper function to determine subscription tier from usage limit or price ID
 * Based on backend configuration:
 * - Free: 5 Answer Engine Optimizations/month
 * - Business: 100 Answer Engine Optimizations/month ($29.99)
 * - Pro: 500 Answer Engine Optimizations/month ($99.99)
 */
export function getSubscriptionTier(limit: number): string {
  if (limit <= 5) return 'Free';
  if (limit <= 100) return 'Business';
  if (limit <= 500) return 'Pro';
  return 'Pro'; // Fallback to Pro for any higher limits
}

/**
 * Get subscription plan name from price ID
 */
export function getPlanFromPriceId(priceId?: string): string {
  if (!priceId) return 'Free';

  // Import from constants
  const { PRICE_ID_TO_PLAN } = require('../constants');

  const plan = PRICE_ID_TO_PLAN[priceId];
  return plan?.name || 'Free';
}

/**
 * Get current user's plan details
 */
export function getCurrentPlanDetails(user: { stripePriceId?: string; usage: { limit: number } }) {


  // If user has a price ID, use that to determine the plan
  if (user.stripePriceId && PRICE_ID_TO_PLAN[user.stripePriceId]) {
    const plan = PRICE_ID_TO_PLAN[user.stripePriceId];
    return {
      name: plan.name,
      limit: plan.limit,
      priceId: user.stripePriceId,
    };
  }

  // Fall back to limit-based detection
  const tier = getSubscriptionTier(user.usage.limit);
  if (tier === 'Business') {
    return PLAN_DETAILS.business;
  } else if (tier === 'Pro') {
    return PLAN_DETAILS.pro;
  }

  return PLAN_DETAILS.free;
}

/**
 * Helper to format subscription status for display
 */
export function formatSubscriptionStatus(status: string): {
  label: string;
  color: string;
} {
  switch (status) {
    case 'active':
      return { label: 'Active', color: 'green' };
    case 'cancelled':
      return { label: 'Cancelled', color: 'yellow' };
    case 'past_due':
      return { label: 'Past Due', color: 'red' };
    default:
      return { label: 'Inactive', color: 'gray' };
  }
}