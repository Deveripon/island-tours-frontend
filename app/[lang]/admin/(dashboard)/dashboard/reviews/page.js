import { getAllReviewsOfaTenant } from '@/app/_actions/reviewActions';
import PageContent from './components/page-content';

export default async function reviewsPage({ params }) {
    const { tenant } = await params;
    const res = await getAllReviewsOfaTenant(tenant);

    const reviews = res?.data?.data?.data;

    return (
        <div className='container space-y-6'>
            <PageContent tenant={tenant} reviews={reviews ?? []} />
        </div>
    );
}
