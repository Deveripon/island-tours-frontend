import 'server-only';

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    appInfo: {
        name: 'TripWheel',
        version: '1.0.0',
        url: 'https://tripwheel.com',
    },
});

