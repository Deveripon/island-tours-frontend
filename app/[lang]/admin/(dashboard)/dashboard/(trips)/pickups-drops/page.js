import { getAllPickups } from '@/app/_actions/pickupActions/read';
import PageContent from './components/page-content';

export default async function PickupsPage() {
    const res = await getAllPickups();

    // The data is inside res.result.data based on ApiResponse interface
    const pickupData = res?.result?.data;
    console.log(`pickupData`, pickupData);
    return (
        <div className='container space-y-6'>
            <PageContent pickups={pickupData ?? []} />
        </div>
    );
}
