import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const { type, sn, notes, user, categories } = req.body;
  const { _id, currency } = user;
  const title = type.replace(/[^a-zA-Z0-9 ]/g, '');

  try {
    const params = {
      submit_type: 'pay',
      mode: 'payment',
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      line_items: categories
        .filter((itemTitle) => itemTitle.title === type)
        .map((item) => {
          return {
            price_data: {
              currency: currency,
              product_data: {
                name: item.title,
              },
              unit_amount: item.price * 100,
            },
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
            },
            quantity: 1,
          };
        }),
      success_url: `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=${title}&sn=${sn}&notes=${notes}&userId=${_id}`,
      cancel_url: `${req.headers.origin}/account`,
    };

    const session = await stripe.checkout.sessions.create(params);
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
