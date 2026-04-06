import { getUserById } from '@/app/_actions/userActions';
import { auth } from '@/auth';

import { getDictionary } from '@/app/[lang]/_dictionaries/dictionaries';
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
import { getAllInquiries } from '@/app/_actions/inqueryActions';
import { getPendingReviewsCount } from '@/app/_actions/reviewActions';

export default async function DashboardLayout({ children, params }) {
    const session = await auth();
    const { lang } = await params;
    const language = await getDictionary(lang);

    const loggedInUser = await getUserById(session?.user?.id);

    // Handle case where user doesn't exist in database
    if (!loggedInUser?.user) {
        redirect('/');
    }

    const inquries = await getAllInquiries();
    const inquriesData = inquries?.result?.data;
    const pendingInquries = getGroupedDataOfStatus(inquriesData)['PENDING']?.length || 0;

    // Fetch pending reviews count
    const pendingReviewsResponse = await getPendingReviewsCount();
    const pendingReviewsCount = pendingReviewsResponse?.success ? pendingReviewsResponse?.count || 0 : 0;

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
                pendingInquries={pendingInquries}
                pendingReviewsCount={pendingReviewsCount}
            >
                <div className='rounded-xl dark:bg-[#1E2A3D]'>{children}</div>
            </ContentWrapper>
        </ThemeProvider>   
    );
}
