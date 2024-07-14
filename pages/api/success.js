import Stripe from 'stripe';
import { client } from '../../lib/client';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async (req, res) => {
  try {
    const { type, sn, notes, userId, session_id } = req.body;

    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === 'paid') {
      const request = await client.create({
        _type: 'unlockRequest',
        type,
        sn,
        notes,
        userId: userId,
      });

      res
        .status(201)
        .json({ message: `${request.sn} unlock request submitted` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
