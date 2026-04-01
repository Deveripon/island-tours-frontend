import { getDictionary } from '@/app/[lang]/_dictionaries/dictionaries';
import { getAllActivityOfTenant } from '@/app/_actions/trips/activityActions';
import ActivitiesSection from '../components/home/activities-section';
import CTASection from '../components/home/cta-section';
import FeaturedTrips from '../components/home/featured-trips';
import Features from '../components/home/features';
import HeroSection from '../components/home/hero-section';
import Partners from '../components/home/our-partner';
import PopularDestinations from '../components/home/populer-destinations';
import SupportSection from '../components/home/support-section';

export default async function Home({ params }) {
    const { lang } = await params;




    const language = await getDictionary(lang);

    const response = await getAllActivityOfTenant(tenantId);

    const activities =
        response?.data.filter(activity => activity?._count?.affiliateTrips > 0) || [];

    const faqs = res?.result?.data?.tenantSiteInfo?.faqs || [
        {
            question: 'How does cancellation work?',
            answer: 'You can cancel free of charge up to 24 hours before the tour. Cancellations within 24 hours are not eligible for a refund.',
        },
        {
            question: 'Can I pay later?',
            answer: 'Yes, you can reserve now and pay later. Pay 20% now and the rest before departure.',
        },
        {
            question: 'Is hotel pick-up included?',
            answer: 'Yes, hotel pick-up and drop-off are included in most of our tours.',
        },
        {
            question: 'Will I receive a voucher?',
            answer: 'Yes, you will receive a confirmation voucher by email immediately after booking.',
        },
    ];
    const enableWhatsAppChat =
        res?.result?.data?.tenantSiteInfo?.enableWhatsappChat || false;
    const whatsappNumber = res?.result?.data?.tenantSiteInfo?.whatsappNumber || '';

    const partnerImages = res?.result?.data?.tenantSiteInfo?.partners || [];

    return (
        <main className='min-h-screen bg-background'>
            <HeroSection
                content={language?.b2bSite?.homePage?.heroSection}
                preferences={res.result?.data?.preferences}
                tenantId={tenantId}
            />
            <Features content={language?.b2bSite?.homePage?.features} />
            <ActivitiesSection tenantId={tenantId} activities={activities} />
            <PopularDestinations
                isDemo={isDemo}
                tenantId={tenantId}
                content={language?.b2bSite?.homePage?.popularDestinations}
            />
            <FeaturedTrips
                isDemo={isDemo}
                content={language?.b2bSite?.homePage?.populerTrips}
                tenantId={tenantId}
            />
            <SupportSection
                tenantId={tenantId}
                faqs={faqs}
                enableWhatsAppChat={enableWhatsAppChat}
                whatsappNumber={whatsappNumber}
            />
            <Partners
                partnerImages={partnerImages}
                content={language?.b2bSite?.homePage?.partner}
            />
            {/*   <Testimonials content={language?.b2bSite?.homePage?.testimonial} /> */}
            <CTASection />
        </main>
    );
}
