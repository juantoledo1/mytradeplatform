export const SERVER_URL = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://mytradeplatform-backend.onrender.com";

export const cloudflareTurnstilSiteKey = "0x4AAAAAABkXYVb_SCYSZVp4";

// Stripe Configuration
export const STRIPE_PUBLISHABLE_KEY = "pk_test_your_stripe_publishable_key_here";

// API Configuration
export const API_CONFIG = {
  BASE_URL: SERVER_URL,
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Feature flags
export const FEATURES = {
  ENABLE_ESCROW: true,
  ENABLE_SHIPPING: true,
  ENABLE_CHAT: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_DISPUTES: true,
};
