import { getAllReviews } from '@/app/_actions/reviewActions';
import PageContent from './components/page-content';

export default async function reviewsPage() {
    const res = await getAllReviews();

    const reviews = res?.data?.data?.data;

    return (
        <div className='container space-y-6'>
            <PageContent reviews={reviews ?? []} />
        </div>
    );
}
