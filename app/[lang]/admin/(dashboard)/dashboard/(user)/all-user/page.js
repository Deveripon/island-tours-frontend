import { getAllUsers } from '@/app/_actions/userActions';
import PageContent from './components/page-content';

export default async function MembersPage() {
    const res = await getAllUsers();
    
    const sortingOrder = {
        ADMIN: 1,
        EDITOR: 2,
        STAFF: 3,
        GUIDE: 4,
        USER: 5,
    };

    const users = res?.result || [];
    const sortedUser = [...users].sort(
        (a, b) => (sortingOrder[a.role] || 99) - (sortingOrder[b.role] || 99)
    );

    return (
        <div className='container space-y-6'>
            <PageContent users={sortedUser} />
        </div>
    );
}
