
import { auth } from '@/auth';
import { Suspense } from 'react';
import PageTitleDescription from '../../components/common/page-title-description';
import { CreateTripPackageForm } from './components/trip-package/create-trip-package-form';

export default async function CreateTripPackage({ params }) {
    const session = await auth();
    const { tenant } = await params;
    return (
        <div className=' flex flex-col rounded-xl overflow-visible'>
            <main className=''>

                <div className="flex max-w-7xl justify-between items-center">
                    <PageTitleDescription
                        description={
                            'Fill out the form below to create a comprehensive trip package.'
                        }
                        title='Create New Trip Package'
                    />

                </div>

                <Suspense fallback='Loading....'>
                    <CreateTripPackageForm
                        userId={session?.user?.id || 'anonymous'}
                        tenant={tenant}
                    />
                </Suspense>
            </main>
        </div>
    );
}
