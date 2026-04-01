import { getUserById } from '@/app/_actions/userActions';
import { auth } from '@/auth';

import { getDictionary } from '@/app/[lang]/_dictionaries/dictionaries';
import { getAllInquerysOfaTenant } from '@/app/_actions/inqueryActions';
import { getPendingReviewsCount } from '@/app/_actions/reviewActions';
import { getGroupedDataOfStatus } from '@/lib/utils';
import { ThemeProvider } from 'next-themes';
import { redirect } from 'next/navigation';
import ContentWrapper from './wrapper';
/* export async function generateMetadata({ params }) {
    const { tenant } = await params;

    return {
        title: `${tenant} Dashboard`,
        description: `Manage trips, bookings, and payments for ${tenant}.`,
        robots: {
            index: false, // Dashboard is private
            follow: false,
        },
        openGraph: {
            title: `${tenant} Dashboard | Tripwheel`,
            description: `Manage your travel business with Tripwheel dashboard for ${tenant}.`,
            url: `https://frametheidea.xyz/${tenant}/dashboard`,
            siteName: 'Tripwheel',
            images: [
                {
                    url: '', // tenantInfo.logo , // from /public/icons/
                    width: 512,
                    height: 512,
                    //alt: `${tenant} Logo`,
                },
            ],
        },
        twitter: {
            card: 'summary',
            title: `${tenant} Dashboard`,
            description: `Manage your bookings and trips on Tripwheel dashboard.`,
            //  images: [tenantInfo.logo],
        },
    };
}
 */
export default async function DashboardLayout({ children, params }) {
    const session = await auth();
    const { tenant, lang } = await params;
    const language = await getDictionary(lang);

    const loggedInUser = await getUserById(session?.user?.id);


    const inquries = await getAllInquerysOfaTenant(tenant);

    const inquriesData = inquries?.data?.data;
    const pendingInquries = getGroupedDataOfStatus(inquriesData)['PENDING']?.length || 0;

    // Fetch pending reviews count
    const pendingReviewsResponse = await getPendingReviewsCount(tenant);

    const pendingReviewsCount = pendingReviewsResponse?.success ? pendingReviewsResponse?.count || 0 : 0;


    // Handle case where user doesn't exist in database
    if (!loggedInUser?.user) {
        redirect('/');
    }


    const tenantId =
        loggedInUser?.user?.tenant?.tenantId || loggedInUser?.user?.createdByTenantId;

    if (!tenantId) {
        redirect('/');
    }
    if (tenantId !== tenant) {
        redirect('/');
    }

    return (
        <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange>
            <ContentWrapper
                content={language?.userDashboard}
                lang={lang}
                preferences={loggedInUser?.user?.preferences}
                key={loggedInUser?.user?.id}
                loggedInUser={loggedInUser.user}
                tenant={tenant}
                pendingInquries={pendingInquries}
                pendingReviewsCount={pendingReviewsCount}
            >
                <div className='rounded-xl dark:bg-[#1E2A3D]'>{children}</div>
            </ContentWrapper>
        </ThemeProvider>   
    );
}
