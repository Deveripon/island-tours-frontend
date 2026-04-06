import { getUserById } from '@/app/_actions/userActions';
import { auth } from '@/auth';
import Profile from './components/profile';

async function ProfilePageForDashboard() {
    const session = await auth();
    const userId = session?.user?.id;
    const result = userId ? await getUserById(userId) : null;

    return <Profile user={result?.success === true ? result?.user : null} />;
}

export default ProfilePageForDashboard;

