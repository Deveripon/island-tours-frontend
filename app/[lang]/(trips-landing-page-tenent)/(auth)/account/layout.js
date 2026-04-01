import { getTenantById } from '@/app/_actions/settingsActions';
import { SidebarProvider } from '@/components/ui/sidebar';
import { getNavigations } from '@/navigations/navigations';
import { notFound } from 'next/navigation';
import AppSidebar from './components/app-sidebar';

export default async function Dashboard({ children, params }) {
    const { tenantId, lang } = await params;
    const res = await getTenantById(tenantId);

    if (res?.success === false || !res?.result?.data?.tenantId) {
        return notFound();
    }
    const navigations = getNavigations(lang);
    return (
        <div className='pt-12 container rounded mx-auto mb-12 flex flex-1'>
            <SidebarProvider className='min-h-[90vh] bg-muted rounded-lg shadow-sm'>
                <AppSidebar
                    items={navigations.dashboardB2C}
                    tanentid={tenantId}
                />
                <main className='flex-1 p-8 bg-background rounded-r-lg'>{children}</main>
            </SidebarProvider>
        </div>
    );
}

