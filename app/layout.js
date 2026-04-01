import { Providers } from '@/provider/Providers';
import { DM_Sans, Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { Toaster } from 'sonner';
import './globals.css';
const inter = Inter({ subsets: ['latin'] });

const dmSans = DM_Sans({
    variable: '--font-dm-sans',
    subsets: ['latin'],
    weight: ['400', '500', '600', '700']
});

const nyghtSerif = localFont({
    variable: '--font-nyght-serif',
    src: [
        {
            path: './fonts/NyghtSerif-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: './fonts/NyghtSerif-RegularItalic.woff2',
            weight: '400',
            style: 'italic',
        },
    ]
});

const generalSans = localFont({
    variable: '--font-general-sans',
    src: [
        {
            path: './fonts/GeneralSans-Variable.woff2',
            style: 'normal',
        },
        {
            path: './fonts/GeneralSans-VariableItalic.woff2',
            style: 'italic',
        },
    ]
});
/* export const metadata = {
    //  Base info
    metadataBase: new URL('https://frametheidea.xyz'),
    title: {
        default: 'Tripwheel - Smart Travel CRM',
        template: '%s | Tripwheel',
    },
    description:
        'Tripwheel is a multi-tenant travel booking CRM  that simplifies trip management, booking, and payments for modern businesses.',

    //  General SEO
    keywords: [
        'travel CRM',
        'trip management',
        'booking platform',
        'travel agency software',
        'Tripwheel',
    ],
    authors: [{ name: 'Tripwheel Team', url: 'https://frametheidea.xyz' }],
    creator: 'Tripwheel',
    publisher: 'Tripwheel Inc.',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },

    //  Open Graph (Facebook / LinkedIn)
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://frametheidea.xyz',
        siteName: 'Tripwheel',
        title: 'Tripwheel - Smart Travel Booking CRM',
        description:
            'All-in-one CRM solution for travel agencies to manage trips, bookings, and payments effortlessly.',
        images: [
            {
                url: '/footer-logo.png',
                width: 1200,
                height: 630,
                alt: 'Tripwheel Dashboard Preview',
            },
        ],
    },

    //  Twitter Cards
    twitter: {
        card: 'summary_large_image',
        title: 'Tripwheel - Smart Travel Booking CRM',
        description:
            'Manage your travel business with ease — bookings, payments, and analytics in one platform.',
        images: ['/footer-logo.png'],
        creator: '@tripwheel',
    },

    //  Manifest + PWA
    manifest: '/manifest.json',
    icons: {
        icon: '/footer-logo.png',
        apple: '/footer-logo.png',
        shortcut: '/favicon.ico',
    },

    //  Alternate Links (for SEO or language support)
    alternates: {
        canonical: 'https://frametheidea.xyz',
        languages: {
            'en-US': 'https://frametheidea.xyz',
            'bn-BD': 'https://frametheidea.xyz/bn',
        },
    },

    //  Verification (Google Search Console, etc.)
    verification: {
        google: 'YOUR-GOOGLE-SEARCH-CONSOLE-CODE',
    },
};
 */
export default async function RootLayout({ children }) {

    return (
        <html lang='en' suppressHydrationWarning={true}>
            <link rel='icon' href='/favicon.png' />

            <body
                className={`${inter.className} ${dmSans.variable} ${nyghtSerif.variable} ${generalSans.variable} antialiased`}
                suppressHydrationWarning={true}>
                <Providers>
                    {children}
                </Providers>
                <Toaster position="bottom-right" richColors />
                <script src="https://elfsightcdn.com/platform.js" async></script>
            </body>
        </html>
    );
}
