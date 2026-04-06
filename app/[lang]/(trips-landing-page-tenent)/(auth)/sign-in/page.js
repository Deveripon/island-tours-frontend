import { notFound } from 'next/navigation';
import { SignInForm } from '../components/sign-in-form';

export default async function Page() {
    return (
        <div className='flex h-screen overflow-hidden w-full bg-muted items-center justify-center p-6 md:p-10'>
            <div className='w-full max-w-sm'>
                <SignInForm />
            </div>
        </div>
    );
}

