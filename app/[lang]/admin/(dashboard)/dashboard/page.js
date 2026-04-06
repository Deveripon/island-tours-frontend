import { getStatsofTenant } from '@/app/_actions/settingsActions';
import { getUserById } from '@/app/_actions/userActions';
import { auth, signOut } from '@/auth';
import { getTrialExpirationInfo } from '@/lib/utils';
import NotificationWithOTPModal from './components/notification-with-otp-modal';
import PageComponents from './components/page-componets';

export default async function Page({ params }) {
    const session = await auth();
    const { tenant } = await params;
    // Early return for authentication failures - prevents any content rendering
    if (!session?.user?.id || session?.error === 'RefreshAccessTokenError') {
        signOut();
        redirect('/');
    }

    const loggedInUser = await getUserById(session.user.id);

    const trialInfo = getTrialExpirationInfo(loggedInUser?.user?.createdAt, 30);
    const res = getStatsofTenant(tenant);


    return (
        <div className='flex flex-1 flex-col gap-4 pt-0 overflow-scroll hide-scrollbar'>
            {loggedInUser?.user.isVerified === false && (
                <NotificationWithOTPModal
                    className='mt-5 '
                    loggedInUser={loggedInUser}
                />
            )}
            {/*
            <TrialPeriodAlert
                expirationDate={trialInfo.expirationDate}
                state='warning'
                upgradeUrl='/#pricing'
            />*/}

            <PageComponents
                statsPromise={res}
                tenant={tenant}
                loggedInUser={loggedInUser}
            />
        </div>
    );
}
