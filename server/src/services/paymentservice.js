// server/src/services/PaymentService.ts
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

export const createPaymentIntent = async (amount: number, bookingId: string) => {
  return await stripe.paymentIntents.create({
    amount: amount * 100, // Stripe works in cents
    currency: 'usd',
    metadata: { bookingId },
    automatic_payment_methods: { enabled: true },
  });
};