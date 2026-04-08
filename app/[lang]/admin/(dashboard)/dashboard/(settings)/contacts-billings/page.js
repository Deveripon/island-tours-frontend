import { logout } from '@/app/_actions/authActions';
import {
    getBillingInformation,
    getCompanyInfo,
    getNotificationPreferences,
} from '@/app/_actions/settingsActions';
import { auth, signOut } from '@/auth';
import SettingsAndBilling from './components/settings-billing';

async function SettingsAndBillingPageForDashboard() {
    const session = await auth();
    if (session && session?.error === 'RefreshAccessTokenError') {
        await logout();
        await signOut({
            redirectTo: '/',
        });
    }

    const [companyRes, billingRes, notificationsRes] = await Promise.all([
        getCompanyInfo(),
        getBillingInformation(),
        getNotificationPreferences(),
    ]);

    const data = {
        companyInformations: companyRes?.data,
        billingInformations: billingRes?.data,
        notificationPreferences: notificationsRes?.data,
    };
    console.log(`data`, data);


    return (
        <div className='container'>
            <div className='flex  items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-semibold tracking-tight'>
                        Settings & Billings
                    </h1>

                    <p className='text-sm text-muted-foreground'>
                        Set up your company information, billing information,
                        notification preferences and language preferences.
                    </p>
                </div>
            </div>
            <SettingsAndBilling data={data} />
        </div>
    );
}

export default SettingsAndBillingPageForDashboard;

