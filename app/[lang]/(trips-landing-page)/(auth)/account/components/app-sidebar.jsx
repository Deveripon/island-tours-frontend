import { auth } from '@/auth';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import SidebarFooterMenu from './sidebar-footer';
import { SidebarNav } from './sidebar-nav';

// This is sample data.
const data = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: '/placeholder.svg?height=32&width=32',
    },
};

export default async function AppSidebar({ items, ...props }) {
    const session = await auth();

    return (
        <Sidebar
            className='max-w-[200px] bg-sidebar border-sidebar-border rounded-l-lg'
            variant='sidebar'
            collapsible='none'
            {...props}>
            <SidebarContent className='!h-auto mt-8 ml-4'>
                <SidebarNav loggedInUser={session?.data?.user} items={items} />
            </SidebarContent>

            <SidebarFooterMenu data={data} session={session} />
        </Sidebar>
    );
}

