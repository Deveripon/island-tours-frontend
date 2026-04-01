import { getSiteTheme } from '@/app/_actions/settingsActions';
import { SmoothScroll } from '@/components/smooth-scroll';
import { ThemeProvider } from '@/components/theme-provider';
import DynamicThemeProvider from '@/provider/dynamicThemeProvider';
import AdminBar from '../components/admin-bar';
import Footer from '../components/common/footer';
import Header from '../components/common/header';
import InstagramFeed from '../components/home/instagram-section';
import AdminProvider from '../provider/admin-provider';

/* export async function generateMetadata({ params }) {
    const { tenantId } = await params;

    if (tenantId === 'demo') {
        return {
            title: 'Demo Travel Site',
            description: 'Demo travel website',
        };
    }

    const { data: seo } = await getTenantsSiteSeo(tenantId);
    const { result: siteInfo } = await getTenantsSiteInfo(tenantId);

    if (!seo) {
        return {
            title: 'Travel Site',
            description: 'Explore amazing destinations',
        };
    }

    const faviconUrl = siteInfo?.data?.favicon?.image?.url;

    const defaultTitle = 'Travel with Us';
    const defaultDescription = 'Explore amazing destinations around the world';

    return {
        title: {
            default: seo?.metaTitle || defaultTitle,
            template: `%s | ${seo?.metaTitle || defaultTitle}`,
        },
        description: seo?.metaDescription || defaultDescription,
        keywords: seo?.metaKeywords || 'travel, tourism, vacation, trips',

        robots: {
            index: seo?.robotsMeta?.includes('index') ?? true,
            follow: seo?.robotsMeta?.includes('follow') ?? true,
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

        openGraph: {
            type: 'website',
            locale: 'en_US',
            title: seo?.ogTitle || seo?.metaTitle || defaultTitle,
            description:
                seo?.ogDescription ||
                seo?.metaDescription ||
                defaultDescription,
            siteName: seo?.metaTitle || defaultTitle,
            images: seo?.ogImage?.image?.url
                ? [
                      {
                          url: seo.ogImage.image.url,
                          width: seo.ogImage.image.width || 1200,
                          height: seo.ogImage.image.height || 630,
                          alt:
                              seo.ogImage.altText ||
                              seo.ogTitle ||
                              defaultTitle,
                      },
                  ]
                : [],
        },

        twitter: {
            card: 'summary_large_image',
            title: seo?.twitterTitle || seo?.metaTitle || defaultTitle,
            description:
                seo?.twitterDescription ||
                seo?.metaDescription ||
                defaultDescription,
            images: seo?.twitterImage?.image?.url
                ? [seo.twitterImage.image.url]
                : [],
        },

        alternates: {
            canonical:
                seo?.canonicalUrl ||
                `${process.env.NEXT_PUBLIC_BASE_URL}/${tenantId}`,
        },

        verification: {
            google: seo?.googleSearchConsole || undefined,
        },
    };
} */

export default async function HomePageLayout({ children, params }) {

    const { data: theme } = await getSiteTheme();

    // Generate Organization Schema
    /*     const organizationSchema = !isDemo
        ? generateOrganizationSchema(tenantData, seoData)
        : null; */

    return (
        <>
            {/* SEO Scripts - Only for non-demo tenants */}

            <>
                {/* Organization Schema */}
                {/*     {organizationSchema && (
                        <script
                            type='application/ld+json'
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify(organizationSchema),
                            }}
                        />
                    )} */}

                {/* Custom Schema */}
                {/*         {seoData?.customSchema && (
                        <script
                            type='application/ld+json'
                            dangerouslySetInnerHTML={{
                                __html: seoData.customSchema,
                            }}
                        />
                    )} */}

                {/* Google Analytics */}
                {/*     {seoData?.googleAnalyticsId && (
                        <>
                            <Script
                                src={`https://www.googletagmanager.com/gtag/js?id=${seoData.googleAnalyticsId}`}
                                strategy='afterInteractive'
                            />
                            <Script
                                id={`ga-${tenantId}`}
                                strategy='afterInteractive'>
                                {`
                                    window.dataLayer = window.dataLayer || [];
                                    function gtag(){dataLayer.push(arguments);}
                                    gtag('js', new Date());
                                    gtag('config', '${seoData.googleAnalyticsId}', {
                                        page_path: window.location.pathname });
                                `}
                            </Script>
                        </>
                    )} */}

                {/* Google Tag Manager */}
                {/*    {seoData?.googleTagManagerId && (
                        <>
                            <Script
                                id={`gtm-${tenantId}`}
                                strategy='afterInteractive'>
                                {`
                                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                                    })(window,document,'script','dataLayer','${seoData.googleTagManagerId}');
                                `}
                            </Script>
                            <noscript>
                                <iframe
                                    src={`https://www.googletagmanager.com/ns.html?id=${seoData.googleTagManagerId}`}
                                    height='0'
                                    width='0'
                                    style={{
                                        display: 'none',
                                        visibility: 'hidden',
                                    }}
                                />
                            </noscript>
                        </>
                    )} */}

                {/* Facebook Pixel */}
                {/*    {seoData?.facebookPixelId && (
                        <>
                            <Script
                                id={`fb-pixel-${tenantId}`}
                                strategy='afterInteractive'>
                                {`
                                    !function(f,b,e,v,n,t,s)
                                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                                    n.queue=[];t=b.createElement(e);t.async=!0;
                                    t.src=v;s=b.getElementsByTagName(e)[0];
                                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                                    'https://connect.facebook.net/en_US/fbevents.js');
                                    fbq('init', '${seoData.facebookPixelId}');
                                    fbq('track', 'PageView');
                                `}
                            </Script>
                            <noscript>
                                <Image
                                    height='1'
                                    width='1'
                                    style={{ display: 'none' }}
                                    src={`https://www.facebook.com/tr?id=${seoData.facebookPixelId}&ev=PageView&noscript=1`}
                                    alt=''
                                />
                            </noscript>
                        </>
                    )} */}
            </>

            <ThemeProvider
                attribute='class'
                defaultTheme='system'
                enableSystem
                disableTransitionOnChange>
                <DynamicThemeProvider
                    theme={theme?.data}>
                    <AdminProvider>
                        <div className='bg-background'>
                            <AdminBar />
                            <Header
                                tenantId={tenantId}
                                preferences={tenantData?.preferences}
                                logo={tenantData?.tenantSiteInfo?.logo}
                            />
                            {children}
                            <InstagramFeed tenantSiteInfo={tenantData?.tenantSiteInfo} />

                            <Footer
                                companyInformations={tenantData?.companyInformations}
                                tenantId={tenantId}
                                logo={tenantData?.tenantSiteInfo?.logo}
                                preferences={tenantData?.preferences}
                                tenantSocialMedia={tenantData?.tenantSocialMedia}
                                destinations={destinations?.data}
                            />

                        </div>
                    </AdminProvider>
                    <SmoothScroll />
                </DynamicThemeProvider>
            </ThemeProvider>
        </>
    );
}
