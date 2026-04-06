
import { getDictionary } from '@/app/[lang]/_dictionaries/dictionaries';
import { getGroupedDataOfStatus } from '@/lib/utils';
import { ThemeProvider } from 'next-themes';
import ContentWrapper from './wrapper';

import { getAllInquiries } from '@/app/_actions/inquiryActions';
import { getPendingReviewsCount } from '@/app/_actions/reviewActions';
import { getSiteInfo } from '@/app/_actions/settingsActions';
import { getUserById } from '@/app/_actions/userActions';
import { auth } from '@/auth';

export default async function DashboardLayout({ children, params }) {
    const { lang } = await params;
    const sessionPromise = auth();
    const dictionaryPromise = getDictionary(lang);
    const inquiriesPromise = getAllInquiries();
    const reviewsPromise = getPendingReviewsCount();
    const siteInfoPromise = getSiteInfo();

    const [session, language, inquiries, reviewsResponse, siteInfoResponse] = await Promise.all([
        sessionPromise,
        dictionaryPromise,
        inquiriesPromise,
        reviewsPromise,
        siteInfoPromise
    ]);

    const loggedInUserResponse = session?.user?.id ? await getUserById(session.user.id) : null;
    const loggedInUser = loggedInUserResponse?.result;
    const siteInfo = siteInfoResponse?.data;

    const inquiriesData = inquiries?.result?.data;
    const pendingInquiries = getGroupedDataOfStatus(inquiriesData)['PENDING']?.length || 0;
    const pendingReviewsCount = reviewsResponse?.success ? reviewsResponse?.count || 0 : 0;

    return (
        <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange>
            <ContentWrapper
                content={language?.userDashboard}
                lang={lang}
                preferences={siteInfo}
                key={loggedInUser?.id}
                loggedInUser={loggedInUser}
                pendingInquiries={pendingInquiries}
                pendingReviewsCount={pendingReviewsCount}
            >
                <div className='rounded-xl dark:bg-[#1E2A3D]'>{children}</div>
            </ContentWrapper>
        </ThemeProvider>
    );
}
