import Logomarquee from '../logo-marque';
import SectionTitle from './section-title';

export default function OurPartner({ content, partnerImages }) {
    if (!partnerImages || partnerImages.length === 0) {
        return null;
    }

    return (
        <section id='trips' className='py-16 md:py-24 '>
            <div className='container mx-auto px-4 flex justify-center items-center flex-col'>
                <SectionTitle title='Meet Our' highlightedText='Partners' />

                <Logomarquee logos={partnerImages} />
            </div>
        </section>
    );
}

