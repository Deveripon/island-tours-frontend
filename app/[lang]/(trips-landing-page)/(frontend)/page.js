import { getDictionary } from '@/app/[lang]/_dictionaries/dictionaries';
import { getAllActivities } from '@/app/_actions/trips/activityActions';
import { getSiteInfo } from '@/app/_actions/settingsActions';
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

    const [activitiesRes, siteInfoRes] = await Promise.all([
        getAllActivities(),
        getSiteInfo()
    ]);

    const activities =
        activitiesRes?.result?.data?.filter(activity => activity?._count?.affiliateTrips > 0) || [];

    const siteInfo = siteInfoRes?.data;

    const faqs = siteInfo?.faqs || [
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

    const enableWhatsAppChat = siteInfo?.enableWhatsappChat || false;
    const whatsappNumber = siteInfo?.whatsappNumber || '';
    const partnerImages = siteInfo?.partners || [];

    return (
        <main className='min-h-screen bg-background'>
            <HeroSection
                content={language?.b2bSite?.homePage?.heroSection}
            />
            <Features content={language?.b2bSite?.homePage?.features} />
            <ActivitiesSection activities={activities} />
            <PopularDestinations
                content={language?.b2bSite?.homePage?.popularDestinations}
            />
            <FeaturedTrips
                content={language?.b2bSite?.homePage?.populerTrips}
            />
            <SupportSection
                faqs={faqs}
                enableWhatsAppChat={enableWhatsAppChat}
                whatsappNumber={whatsappNumber}
            />
            <Partners
                partnerImages={partnerImages}
                content={language?.b2bSite?.homePage?.partner}
            />
            <CTASection />
        </main>
    );
}

