import 'server-only';

import Stripe from 'stripe';

export const b2bStripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    appInfo: {
        name: 'TripWheel',
        version: '1.0.0',
        url: 'https://tripwheel.com',
    } });

