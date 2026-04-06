import { getTripBySlug } from '@/app/_actions/trips/affiliateTripsAction';

import {
    getSiteInfo,
    getTripPaymentPreferences,
} from '@/app/_actions/settingsActions';
import BreadCrumbs from './components/breadcrumbs';
import ReletedTrips from './components/releted-trips-list';
import TripContentWrapper from './components/trip-content-wrapper';

export async function generateMetadata({ params }) {
    const { slug } = await params;

    const [tripRes, siteInfoRes] = await Promise.all([
        getTripBySlug(slug),
        getSiteInfo()
    ]);

    const trip = tripRes?.result?.data;
    const siteInfo = siteInfoRes?.data;
    const seo = trip?.seo;
    const faviconUrl = siteInfo?.favicon?.image?.url;

    const defaultTitle = trip?.title || 'Trip Details';
    const defaultDescription = trip?.description || 'Explore amazing destinations';

    return {
        title: seo?.title || defaultTitle,
        description: seo?.description || defaultDescription,
        keywords: seo?.focusKeyword || '',
        robots: {
            index: seo?.robots?.includes('index') ?? true,
            follow: seo?.robots?.includes('follow') ?? true,
        },
        icons: {
            icon: [
                { url: faviconUrl, sizes: '32x32', type: 'image/x-icon' },
                { url: faviconUrl, sizes: '16x16', type: 'image/x-icon' },
            ],
            shortcut: faviconUrl,
            apple: [{ url: faviconUrl, sizes: '180x180', type: 'image/png' }],
        },
        openGraph: {
            type: 'website',
            title: seo?.ogTitle || seo?.title || defaultTitle,
            description: seo?.ogDescription || seo?.description || defaultDescription,
            images: seo?.ogImage?.url
                ? [
                    {
                        url: seo.ogImage.url,
                        width: seo.ogImage.width,
                        height: seo.ogImage.height,
                        alt: seo.ogTitle || defaultTitle,
                    },
                ]
                : [],
        },
        twitter: {
            card: seo?.twitterCard || 'summary_large_image',
            title: seo?.twitterTitle || seo?.title || defaultTitle,
            description: seo?.twitterDescription || seo?.description || defaultDescription,
            images: seo?.ogImage?.url ? [seo.ogImage.url] : [],
        },
        alternates: {
            canonical: seo?.canonical || `${process.env.NEXT_PUBLIC_BASE_URL}/trips/${slug}`,
        },
    };
}

export default async function TripDetailsPage({ params }) {
    const { slug } = await params;

    const [tripRes, paymentPrefsRes, siteInfoRes] = await Promise.all([
        getTripBySlug(slug),
        getTripPaymentPreferences(),
        getSiteInfo(),
    ]);

    const trip = tripRes?.result?.data;
    const paymentPrefs = paymentPrefsRes?.data;
    const siteInfo = siteInfoRes?.data;

    const bookingForm = trip?.bookingForm || siteInfo?.bookingForm || 'v2';

    return (
        <div className='min-h-screen bg-background '>
            <div className='container mx-auto md:px-12 px-4 py-8'>
                <BreadCrumbs last={trip?.title} />

                <TripContentWrapper
                    paymentMethod={paymentPrefs?.preferedPaymentMethod}
                    trip={trip}
                    bookingForm={bookingForm}>
                    <ReletedTrips trip={trip} />
                </TripContentWrapper>
            </div>
        </div>
    );
}

