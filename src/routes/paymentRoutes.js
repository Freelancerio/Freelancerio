const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { job_title, total_pay } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'zar',
            product_data: {
              name: job_title,
            },
            unit_amount: parseInt(total_pay * 100), // Convert R500 to cents
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/pages/success.html',
    cancel_url: 'http://localhost:3000/pages/cancel.html',

    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
