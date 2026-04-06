import { notFound } from 'next/navigation';

export default async function Dashboard() {
    return (
        <div className='flex flex-1 flex-col gap-4'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-semibold tracking-tight text-foreground'>
                        Dashboard
                    </h1>
                    <p className='text-sm text-muted-foreground mt-1'>
                        Welcome to your account dashboard!
                    </p>
                </div>
            </div>
        </div>
    );
}

