import { ContactForm } from '../../components/contact-form';
import { ContactInfo } from '../../components/contatct-info';
import PageHero from '../../components/page-hero';

export const ContactPage = async ({ params }) => {
    const { tenantId } = await params;
    return (
        <div className='min-h-screen bg-background'>
            <PageHero
                flip={false}
                image='/activities.jpg'
                subtitle2='Contact'
                title='Contact Us'
                subtitle="Have a question or need assistance? We'd love to
                        hear from you."
            />
            <div className='container mx-auto px-4 py-16'>
                <div className='grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto'>
                    <div>
                        <ContactInfo tenantId={tenantId} />
                    </div>
                    <div>
                        <ContactForm tenantId={tenantId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
