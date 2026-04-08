import { logout } from '@/app/_actions/authActions';
import { getDashboardStats } from '@/app/_actions/dashboardActions';
import { getUserById } from '@/app/_actions/userActions';
import { auth, signOut } from '@/auth';
import PageComponents from './components/page-componets';

export default async function Page() {
    const session = await auth();
    const userRes = session?.user?.id
        ? await getUserById(session.user.id)
        : null;
    const loggedInUser = userRes?.result || null;
    const statsPromise = getDashboardStats();

    if (session && session?.error === 'RefreshAccessTokenError') {
        await logout();
        await signOut({
            redirectTo: '/',
        });
    }
    return (
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
            <PageComponents
                statsPromise={statsPromise}
                loggedInUser={loggedInUser}
            />
        </div>
    );
}

