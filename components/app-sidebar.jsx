'use client';

import { LogoWithDropdown } from '@/app/[lang]/admin/(dashboard)/dashboard/components/logo-with-dropdown';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { filterNavigationByPermissions } from '@/lib/rbac-utils';
import { getNavigations } from '@/navigations/navigations';
import { ROLE_PERMISSIONS } from '@/RBAC.config';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

export function AppSidebar({
    lang,
    tenant,
    preferences,
    menuItems = 'dashboardB2B',
    pendingInquries,
    pendingReviewsCount,
    ...props
}) {
    const { data: session, status } = useSession();
    const data = getNavigations(lang);

    const filteredNavigations = useMemo(() => {
        // Return empty array during loading to prevent flash
        if (status === 'loading') return [];

        const userRole = session?.user?.role;
        const userPermissions = ROLE_PERMISSIONS[userRole] || [];
        return filterNavigationByPermissions(data[menuItems], userPermissions);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user?.role, status, lang]); // Use lang instead of data object

    // Show loading skeleton during initial load
    if (status === 'loading') {
        return (
            <Sidebar
                className='mt-8 min-w-[230px]'
                collapsible='icon'
                {...props}>
                <SidebarContent className='hide-scrollbar mt-4'>
                    <div className='space-y-4 p-2'>
                        {[...Array(14)].map((_, i) => (
                            <div
                                key={i}
                                className='h-4 bg-slate-600 rounded animate-pulse'
                            />
                        ))}
                    </div>
                </SidebarContent>
            </Sidebar>
        );
    }
    return (
        <Sidebar collapsible='offcanvas' {...props}>
            <div className='ml-4'>
                {' '}
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                className='data-[slot=sidebar-menu-button]:!p-1.5'>
                                <LogoWithDropdown
                                    preferences={preferences}
                                    tenant={tenant}
                                />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
            </div>
            <SidebarContent className='mb-16'>
                <NavMain
                    tenant={tenant}
                    items={filteredNavigations}
                    lang={lang}
                    pendingInquries={pendingInquries}
                    pendingReviewsCount={pendingReviewsCount}
                />
                {/* <NavDocuments items={data.documents} />*/}
                {/* <NavSecondary items={data.navSecondary} className='mt-auto' />*/}
            </SidebarContent>
            <SidebarFooter>{/* <NavUser user={data.user} />*/}</SidebarFooter>
        </Sidebar>
    );
}
