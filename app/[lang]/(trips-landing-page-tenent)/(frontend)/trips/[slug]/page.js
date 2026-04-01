import { DummySingleTrip } from '@/app/[lang]/(trips-landing-page-tenent)/data/data';
import { getSingleAffiliateTripBySlug } from '@/app/_actions/trips/affiliateTripsAction';

import {
    getTenantPaymentConfiguration,
    getTenantsSiteInfo,
} from '@/app/_actions/settingsActions';
import BreadCrumbs from './components/breadcrumbs';
import ReletedTrips from './components/releted-trips-list';
import TripContentWrapper from './components/trip-content-wrapper';

/* export async function generateMetadata({ params }) {
    const { slug, tenantId } = await params;

    const res = await getSingleAffiliateTripBySlug(slug);
    const seo = res.success ? res.trip.data?.seo : null;

    const { result: siteInfo } = await getTenantsSiteInfo(tenantId);
    const faviconUrl = siteInfo?.data?.favicon?.image?.url;
    // Fallback values
    const defaultTitle = res.trip?.data?.title || 'Trip Details';
    const defaultDescription =
        res.trip?.data?.description || 'Explore amazing destinations';

    return {
        title: seo?.title || defaultTitle,
        description: seo?.description || defaultDescription,

        // Keywords
        keywords: seo?.focusKeyword || '',

        // Robots meta tag
        robots: {
            index: seo?.robots?.includes('index') ?? true,
            follow: seo?.robots?.includes('follow') ?? true,
        },

        // Favicon and app icons
        icons: {
            icon: [
                { url: faviconUrl, sizes: '32x32', type: 'image/x-icon' },
                { url: faviconUrl, sizes: '16x16', type: 'image/x-icon' },
            ],
            shortcut: faviconUrl,
            apple: [{ url: faviconUrl, sizes: '180x180', type: 'image/png' }],
            other: [
                {
                    rel: 'icon',
                    type: 'image/png',
                    sizes: '192x192',
                    url: faviconUrl,
                },
                {
                    rel: 'icon',
                    type: 'image/png',
                    sizes: '512x512',
                    url: faviconUrl,
                },
            ],
        },
        // Open Graph
        openGraph: {
            type: 'website',
            title: seo?.ogTitle || seo?.title || defaultTitle,
            description: seo?.ogDescription || seo?.description || defaultDescription,
            images: seo?.ogImage?.image?.url
                ? [
                      {
                          url: seo.ogImage.image.url,
                          width: seo.ogImage.image.width,
                          height: seo.ogImage.image.height,
                          alt: seo.ogTitle || defaultTitle,
                      },
                  ]
                : [],
        },

        // Twitter Card
        twitter: {
            card: seo?.twitterCard || 'summary_large_image',
            title: seo?.twitterTitle || seo?.title || defaultTitle,
            description:
                seo?.twitterDescription || seo?.description || defaultDescription,
            images: seo?.ogImage?.image?.url ? [seo.ogImage.image.url] : [],
        },

        // Canonical URL
        alternates: {
            canonical:
                seo?.canonical || `${process.env.NEXT_PUBLIC_BASE_URL}/trips/${slug}`,
        },
    };
} */
export default async function TripDetailsPage({ params }) {
    const { slug, tenantId } = await params;
    const isDemo = tenantId === 'demo';

    let trip;

    if (isDemo) {
        trip = DummySingleTrip;
    } else {
        const res = await getSingleAffiliateTripBySlug(slug);
        trip = res.success ? res.trip.data : null;
        console.log(`res`, res);
    }

    const tenantPaymentConfig =
        !isDemo && (await getTenantPaymentConfiguration(tenantId));
    /*  const jsonLd = generateTripSchema(trip, tenantId, slug); */

    const siteInfo = !isDemo && (await getTenantsSiteInfo(tenantId));
    const bookingForm = trip?.bookingForm || siteInfo?.result?.data?.bookingForm || 'v2';

    return (
        <>
            {/* JSON-LD Schema */}
            {/*           <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            /> */}
            <div className='min-h-screen bg-background '>
                <div className='container mx-auto md:px-12 px-4 py-8'>
                    <BreadCrumbs last={trip?.title} />

                    <TripContentWrapper
                        paymentMethod={tenantPaymentConfig?.result?.preferedPaymentMethod}
                        trip={trip}
                        tenantId={tenantId}
                        bookingForm={bookingForm}>
                        <ReletedTrips trip={trip} tenantId={tenantId} />
                    </TripContentWrapper>
                </div>
            </div>
        </>
    );
}
