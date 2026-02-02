import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { BookingModel } from '../database/models/Booking';
import { requireAuth } from '../middleware/auth';

const router = Router();

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(secretKey);
};

router.post('/create-checkout', requireAuth, async (req: Request, res: Response) => {
  try {
    const { booking_id, success_url, cancel_url } = req.body;

    if (!booking_id || !success_url || !cancel_url) {
      res.status(400).json({ error: 'Booking ID, success URL, and cancel URL are required' });
      return;
    }

    const booking = await BookingModel.getById(booking_id);
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    if (booking.user_id !== req.user!.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    if (booking.status !== 'pending') {
      res.status(400).json({ error: 'Booking is not in pending status' });
      return;
    }

    const stripe = getStripe();

    let description = '';
    if (booking.booking_type === 'ticket') {
      description = `Zoo Tickets - ${booking.ticket_type || 'Standard'} x ${booking.quantity}`;
    } else {
      description = `Hotel Booking - ${booking.hotel_name || 'Room'} (${booking.room_type_name || 'Standard'})`;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'dkk',
            product_data: {
              name: 'Riget Zoo Adventures',
              description
            },
            unit_amount: Math.round(booking.total_price * 100)
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url,
      cancel_url,
      metadata: {
        booking_id: booking.id.toString()
      }
    });

    await BookingModel.updateStripeSessionId(booking.id, session.id);

    res.json({
      session_id: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Create checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const stripe = getStripe();
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured');
      res.status(500).json({ error: 'Webhook not configured' });
      return;
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      res.status(400).json({ error: 'Webhook signature verification failed' });
      return;
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.booking_id;

        if (bookingId) {
          await BookingModel.updateStatus(parseInt(bookingId), 'confirmed');
          console.log(`Booking ${bookingId} confirmed via Stripe webhook`);
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.booking_id;

        if (bookingId) {
          await BookingModel.updateStatus(parseInt(bookingId), 'cancelled');
          console.log(`Booking ${bookingId} cancelled due to expired checkout`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
