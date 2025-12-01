import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';

const BillingPage: React.FC = () => {
  const { user, isLoading } = useAuth() as any;
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Heuristic to determine whether the user is on a paid plan.
  // This is intentionally permissive to work with different auth shapes.
  const isPaid = Boolean(
    user && (
      user.isPaid ||
      user.plan === 'paid' ||
      user.subscription?.status === 'active' ||
      (user.plan && typeof user.plan === 'string' && user.plan.toLowerCase() !== 'free')
    )
  );

  const openCustomerPortal = async () => {
    setError(null);
    setLoadingPortal(true);
    try {
      // Endpoint - adjust server route if different. Expecting { url }
      const resp = await api.post('/billing/create-portal-session');
      const url = resp?.data?.url || resp?.url || null;
      if (!url) throw new Error('Customer portal URL not returned from server');
      window.location.href = url;
    } catch (err: any) {
      console.error('Failed to open customer portal', err);
      setError(err?.message || 'Unable to open customer portal. Please try again later.');
    } finally {
      setLoadingPortal(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <h2>Billing</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2 style={{ margin: 0 }}>Billing</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
        <div>
          <Card>
            <h3 style={{ marginTop: 0 }}>Subscription</h3>
            {!user && <p>Sign in to manage your subscription.</p>}

            {user && (
              <div style={{ display: 'grid', gap: 12 }}>
                <p>
                  {isPaid
                    ? 'Thanks for being a paid subscriber! Manage your subscription and billing details below.'
                    : 'You are currently on the free plan.'}
                </p>

                {isPaid && (
                  <Card>
                    <h4 style={{ marginTop: 0 }}>Manage Subscription</h4>
                    <ul>
                      <li>Cancel subscription</li>
                      <li>Update payment method</li>
                      <li>View and download invoices</li>
                    </ul>
                    <div style={{ marginTop: 12 }}>
                      <Button onClick={openCustomerPortal} disabled={loadingPortal}>
                        {loadingPortal ? 'Opening...' : 'Open Customer Portal'}
                      </Button>
                    </div>
                    {error && (
                      <p style={{ color: 'var(--danger, #c00)', marginTop: 8 }}>{error}</p>
                    )}
                    <p style={{ marginTop: 8, color: 'var(--muted, #666)' }}>
                      The Stripe Customer Portal lets you manage subscription details including
                      cancellations, payment methods, and invoice history.
                    </p>
                  </Card>
                )}

                {!isPaid && (
                  <div style={{ display: 'grid', gap: 8 }}>
                    <p>If you'd like to upgrade, visit your account page to choose a paid plan.</p>
                  </div>
                )}
              </div>
            )}
          </Card>

          <Card style={{ marginTop: 16 }}>
            <h3 style={{ marginTop: 0 }}>Billing Support</h3>
            <p>
              Need help with refunds, plan changes, or billing questions? Our billing team is
              happy to assist.
            </p>
            <Button as="a" href="mailto:support@getrainos.com" style={{ marginTop: 12 }}>
              Contact Billing Support
            </Button>
          </Card>

          <Card style={{ marginTop: 16 }}>
            <h3 style={{ marginTop: 0 }}>FAQ</h3>
            <div>
              <h4 style={{ marginBottom: 6 }}>How do I cancel?</h4>
              <p style={{ marginTop: 0 }}>
                To cancel your subscription, click "Open Customer Portal" and choose the
                cancellation option. If you need help, email support@getrainos.com.
              </p>

              <h4 style={{ marginBottom: 6, marginTop: 12 }}>Where are my invoices?</h4>
              <p style={{ marginTop: 0 }}>
                Invoices are available in the Customer Portal where you can view and download
                past invoices for your records.
              </p>

              <h4 style={{ marginBottom: 6, marginTop: 12 }}>Can I change my payment method?</h4>
              <p style={{ marginTop: 0 }}>
                Yes — open the Customer Portal to update your card or payment details securely.
              </p>
            </div>
          </Card>
        </div>

        <aside>
          <Card>
            <h3 style={{ marginTop: 0 }}>Account Summary</h3>
            {user ? (
              <div>
                <p style={{ margin: '6px 0' }}>
                  <strong>Email:</strong> {user.email}
                </p>
                <p style={{ margin: '6px 0' }}>
                  <strong>Plan:</strong> {isPaid ? 'Paid' : 'Free'}
                </p>
                <p style={{ margin: '6px 0' }}>
                  <strong>Status:</strong> {user.subscription?.status || 'N/A'}
                </p>
              </div>
            ) : (
              <p>Not signed in</p>
            )}
          </Card>

          <Card style={{ marginTop: 16 }}>
            <h3 style={{ marginTop: 0 }}>Need immediate help?</h3>
            <p style={{ marginBottom: 8 }}>Email: <a href="mailto:support@getrainos.com">support@getrainos.com</a></p>
            <Button as="a" href="mailto:support@getrainos.com">Email Support</Button>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default BillingPage;