import { getAllUsers } from '@/app/_actions/userActions';
import PageContent from './components/page-content';

export default async function MembersPage() {
    const res = await getAllUsers();

    const sortingOrder = {
        SUPER_ADMIN: 1,
        ADMIN: 2,
        EDITOR: 3,
        STAFF: 4,
        GUIDE: 5,
        USER: 6,
    };

    const users = res?.result?.users || [];
    console.log(`users`, users);

    const sortedUser = [...users].sort(
        (a, b) => (sortingOrder[a.role] || 99) - (sortingOrder[b.role] || 99)
    );

    return (
        <div className='container space-y-6'>
            <PageContent users={sortedUser} />
        </div>
    );
}
