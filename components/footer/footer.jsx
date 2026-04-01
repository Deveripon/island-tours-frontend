import { getNavigations } from '@/navigations/navigations';
import footerLogo from '@/public/footer-logo.png';
import Logo from '../navbar/Logo';
import FooterNavigation from './footer-navigation';
import SocialLinks from './social-links';
const Footer = ({ lang }) => {
    const navigationItems = getNavigations(lang);
    const features = navigationItems.mainNavigations.find(
        item => item.name === 'Features'
    );
    const resourses = navigationItems.mainNavigations.find(
        item => item.name === 'Resourses'
    );
    const leagals = navigationItems.legalLinks;
    return (
        <footer className='bg-gray-800 text-white py-16'>
            <div className='container mx-auto px-4'>
                <div className='grid md:grid-cols-4 gap-8'>
                    <div className='space-y-4'>
                        <div className='flex items-center space-x-2'>
                            <Logo logoImage={footerLogo} className='text-lg' />
                        </div>
                        <p className='text-gray-300 text-sm'>
                            The easiest way to build great booking websites and
                            increase online bookings for tour operators and
                            activity providers.
                        </p>
                    </div>

                    <div>
                        <h4 className='font-semibold mb-4'>Features</h4>
                        <FooterNavigation navigations={features} />
                    </div>

                    <div>
                        <h4 className='font-semibold mb-4'>Resourses</h4>
                        <FooterNavigation navigations={resourses} />
                    </div>

                    <div>
                        <h4 className='font-semibold mb-4'>Company</h4>
                        <FooterNavigation navigations={leagals} />
                    </div>
                </div>
                <div className='mt-12 pt-8 border-t'>
                    <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                        <p className='text-sm text-white'>
                            © 2025 Tripwheel. All rights reserved.
                        </p>
                        <SocialLinks />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

