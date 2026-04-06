import { SidebarProvider } from '@/components/ui/sidebar';
import { getNavigations } from '@/navigations/navigations';
import AppSidebar from './components/app-sidebar';

export default async function Dashboard({ children, params }) {
    const { lang } = await params;
    const navigations = getNavigations(lang);
    return (
        <div className='pt-12 container rounded mx-auto mb-12 flex flex-1'>
            <SidebarProvider className='min-h-[90vh] bg-muted rounded-lg shadow-sm'>
                <AppSidebar
                    items={navigations.dashboardB2C}
                />
                <main className='flex-1 p-8 bg-background rounded-r-lg'>{children}</main>
            </SidebarProvider>
        </div>
    );
}

