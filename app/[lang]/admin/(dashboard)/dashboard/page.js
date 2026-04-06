
import { getDashboardStats } from '@/app/_actions/dashboardActions';
import { getUserById } from '@/app/_actions/userActions';
import { auth } from '@/auth';
import PageComponents from './components/page-componets';

export default async function Page() {
    const session = await auth();
    const userRes = session?.user?.id ? await getUserById(session.user.id) : null;
    const loggedInUser = userRes?.result || null;
    const statsPromise = getDashboardStats();

    return (
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
            <PageComponents
                statsPromise={statsPromise}
                loggedInUser={loggedInUser}
            />
        </div>
    );
}
