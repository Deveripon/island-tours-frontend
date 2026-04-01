import { getTenantById } from '@/app/_actions/settingsActions';
import { auth } from '@/auth';
import { signOut } from 'next-auth/react';
import SiteManagement from './components/site-management';

async function SettingsAndBillingPageForDashboard({ params }) {
    const { tenant } = await params;
    const session = await auth();

    if (session && session?.error === 'RefreshAccessTokenError') {
        await handleLogOut();
        signOut({
            redirectTo: '/'
        });
    }
    const res = await getTenantById(tenant);
    const data = res?.result?.data
        ? {
            tenantSiteInfo: res?.result?.data?.tenantSiteInfo,
            tenantSMTP: res?.result?.data?.tenantSMTP,
            tenantSiteSEO: res?.result?.data?.tenantSiteSEO,
            tenantSiteTheme: {
                ...res?.result?.data?.tenantSiteTheme,
                primaryColor:
                    res?.result?.data?.tenantSiteTheme?.primaryColor ||
                    res?.result?.data?.preferences?.primary_color ||
                    '#FF0000',
            },
            tenantSocialMedia: res?.result?.data?.tenantSocialMedia,
        }
        : {};
    console.log(`site info`, data?.tenantSiteInfo);


    return (
        <div className='container '>
            <div className='flex  items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-semibold tracking-tight'>Site Settings</h1>
                    <p className='text-sm text-muted-foreground'>
                        Set up your site information, branding, and SEO information to
                        make your website stand out.
                    </p>
                </div>
            </div>
            <SiteManagement data={data} tenant={tenant} />
        </div>
    );
}

export default SettingsAndBillingPageForDashboard;
