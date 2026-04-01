import { getTenantById } from '@/app/_actions/settingsActions';
import { notFound } from 'next/navigation';
import { SignUpForm } from '../components/sign-up-form';

export default async function Page({ params }) {
    const { tenantId } = await params;
    const res = await getTenantById(tenantId);

    if (res?.success === false || !res?.result?.data?.tenantId) {
        return notFound();
    }
    return (
        <div className='flex min-h-svh bg-muted w-full items-center justify-center p-6 md:p-10'>
            <div className='w-full max-w-sm'>
                <SignUpForm tenantid={tenantId} />
            </div>
        </div>
    );
}

