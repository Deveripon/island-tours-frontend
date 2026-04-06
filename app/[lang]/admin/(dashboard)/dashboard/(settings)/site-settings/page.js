import {
    getSMTPConfig,
    getSiteInfo,
    getSiteSeo,
    getSiteTheme,
    getSocialMedia,
} from '@/app/_actions/settingsActions';
import { logout } from '@/app/_actions/authActions';
import { auth } from '@/auth';
import { signOut } from 'next-auth/react';
import SiteManagement from './components/site-management';

async function SettingsAndBillingPageForDashboard() {
    const session = await auth();

    if (session && session?.error === 'RefreshAccessTokenError') {
        await logout();
        signOut({
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

    const data = {
        siteInfo: siteInfoRes?.result?.data,
        smtp: smtpRes?.result?.data,
        siteSEO: seoRes?.result?.data,
        siteTheme: {
            ...themeRes?.result?.data,
            primaryColor: themeRes?.result?.data?.primaryColor || '#FF0000',
        },
        socialMedia: socialRes?.result?.data,
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

