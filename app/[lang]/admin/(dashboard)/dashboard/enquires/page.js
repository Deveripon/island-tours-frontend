import { getAllInquerysOfaTenant } from '@/app/_actions/inqueryActions';
import { getGroupedDataOfStatus } from '@/lib/utils';
import PageContent from './components/page-content';

export default async function EnquiresPage({ params }) {
    const { tenant } = await params;
    const inquries = await getAllInquerysOfaTenant(tenant);
    console.log(`inquries`, inquries);

    const inquriesData = inquries?.data?.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const groupedData = getGroupedDataOfStatus(inquriesData);

    return (
        <div className='container space-y-6'>
            <PageContent
                tenant={tenant}
                groupedInquries={groupedData}
                inquries={inquriesData ?? []}
            />
        </div>
    );
}
