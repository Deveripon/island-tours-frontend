import { getTenantById } from '@/app/_actions/settingsActions';
import { auth } from '@/auth';
import { signOut } from 'next-auth/react';
import SettingsAndBilling from './components/settings-billing';

async function SettingsAndBillingPageForDashboard({ params }) {
    const session = await auth();
    const { tenant } = await params;
    if (session && session?.error === 'RefreshAccessTokenError') {
        await handleLogOut();
        signOut({
            redirectTo: '/'
        });
    }

    const res = await getTenantById(tenant);

    return (
        <div className='container'>
            <div className='flex  items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-semibold tracking-tight'>
                        Settings & Billings
                    </h1>

                    <p className='text-sm text-muted-foreground'>
                        Set up your company information, billing information, notification
                        preferences and language preferences.
                    </p>
                </div>
            </div>
            <SettingsAndBilling
                tenant={res?.result?.success === true ? res?.result?.data : null}
            />
        </div>
    );
}

export default SettingsAndBillingPageForDashboard;
