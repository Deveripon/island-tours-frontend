import { getTenantById } from '@/app/_actions/settingsActions';
import { notFound } from 'next/navigation';
import { SignInForm } from '../components/sign-in-form';

export default async function Page({ params }) {
    const { tenantId } = await params;
    const res = await getTenantById(tenantId);

    if (res?.success === false || !res?.result?.data?.tenantId) {
        return notFound();
    }
    return (
        <div className='flex h-screen overflow-hidden w-full bg-muted items-center justify-center p-6 md:p-10'>
            <div className='w-full max-w-sm'>
                <SignInForm tenantid={tenantId} />
            </div>
        </div>
    );
}

