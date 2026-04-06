import { getAllInquiries } from '@/app/_actions/inquiryActions';
import { getGroupedDataOfStatus } from '@/lib/utils';
import PageContent from './components/page-content';

export default async function EnquiresPage() {
    const inquiriesRes = await getAllInquiries();
    console.log(`inquiries`, inquiriesRes);

    const inquiriesData = (inquiriesRes?.result?.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const groupedData = getGroupedDataOfStatus(inquiriesData);

    return (
        <div className='container space-y-6'>
            <PageContent
                groupedInquiries={groupedData}
                inquiries={inquiriesData ?? []}
            />
        </div>
    );
}
