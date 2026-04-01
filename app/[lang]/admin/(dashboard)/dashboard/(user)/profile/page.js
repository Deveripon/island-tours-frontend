import { handleLogOut } from '@/app/_actions/authActions';
import { getUserById } from '@/app/_actions/userActions';
import { auth } from '@/auth';
import { signOut } from 'next-auth/react';
import Profile from './components/profile';

async function ProfilePageForDashboard() {
    const session = await auth();

    if (session && session?.error === 'RefreshAccessTokenError') {
        await handleLogOut();
        signOut({
            redirectTo: '/' });
    }
    const userId = session?.user?.id;
    const result = userId ? await getUserById(userId) : null;

    return <Profile user={result?.success === true ? result?.user : null} />;
}

export default ProfilePageForDashboard;

