import { getAllDestinations } from '@/app/_actions/trips/destinations/read';
import PageContent from './components/page-content';

export default async function DestinationPage() {
    const res = await getAllDestinations();

    const destinationsData = res?.result?.data || [];
    console.log(destinationsData);

    return (
        <div className='container space-y-6'>
            <PageContent destinations={destinationsData} />
        </div>
    );
}
