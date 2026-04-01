import { getAllApiKeysofUser } from '@/app/_actions/apiKeysActions';
import { auth } from '@/auth';
import PageContent from './components/page-content';

export default async function CredentialsPage() {
    const session = await auth();
    const res = await getAllApiKeysofUser(session?.user?.id);

    const apiKeys = res?.data;


    return (
        <div className='container space-y-6'>
            <PageContent apiKeys={apiKeys ?? []} />
        </div>
    );
}
