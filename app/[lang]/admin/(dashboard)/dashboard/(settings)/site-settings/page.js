import { logout } from '@/app/_actions/authActions';
import {
    getSMTPConfig,
    getSiteInfo,
    getSiteSeo,
    getSiteTheme,
    getSocialMedia,
} from '@/app/_actions/settingsActions';
import { auth, signOut } from '@/auth';
import SiteManagement from './components/site-management';

async function SettingsAndBillingPageForDashboard() {
    const session = await auth();

    if (session && session?.error === 'RefreshAccessTokenError') {
        await logout();
        await signOut({
            redirectTo: '/',
        });
    }
    const [siteInfoRes, smtpRes, seoRes, themeRes, socialRes] =
        await Promise.all([
            getSiteInfo(),
            getSMTPConfig(),
            getSiteSeo(),
            getSiteTheme(),
            getSocialMedia(),
        ]);
    console.log(`siteInfo`, siteInfoRes);
    console.log(`smtpRes`, smtpRes);
    console.log(`seoRes`, seoRes);
    console.log(`themeRes`, themeRes);
    console.log(`socialRes`, socialRes);

    const data = {
        siteInfo: siteInfoRes?.data,
        smtp: smtpRes?.data,
        siteSEO: seoRes?.data,
        siteTheme: {
            ...themeRes?.data,
            primaryColor: themeRes?.data?.primaryColor || '#FF0000',
        },
        socialMedia: socialRes?.data,
    };



    return (
        <div className='container '>
            <div className='flex  items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-semibold tracking-tight'>
                        Site Settings
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Set up your site information, branding, and SEO
                        information to make your website stand out.
                    </p>
                </div>
            </div>
            <SiteManagement data={data} />
        </div>
    );
}

export default SettingsAndBillingPageForDashboard;

