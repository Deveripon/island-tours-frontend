import { getAllUserOfTenant } from '@/app/_actions/membersActions';
import PageContent from './components/page-content';

export default async function CouponPage({ params }) {
    const { tenant } = await params;

    const res = await getAllUserOfTenant(tenant);
    const sortingOrder = {
        ADMIN: 1,
        EDITOR: 2,
        STAFF: 3,
        GUIDE: 4,
        USER: 5,
    };

    const result = res?.users;
    const sortedUser = result.users?.sort(
        (a, b) => sortingOrder[a.role] - sortingOrder[b.role]
    );

    return (
        <div className='container space-y-6'>
            <PageContent tenantId={tenant} users={sortedUser ?? []} />
        </div>
    );
}
