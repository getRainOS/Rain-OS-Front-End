
export interface Usage {
  count: number;
  limit: number;
}

export interface User {
  id: string;
  email: string;
  apiKey: string;
  subscriptionStatus: 'active' | 'cancelled' | 'past_due';
  usage: Usage;
}
