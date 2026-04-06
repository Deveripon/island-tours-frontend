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
import { useMemo } from 'react';

export function AppSidebar({
    lang,
    preferences,
    menuItems = 'dashboardB2B',
    pendingInquiries,
    pendingReviewsCount,
    userRole,
    ...props
}) {
    const data = getNavigations(lang);

    const filteredNavigations = useMemo(() => {
        const userPermissions = ROLE_PERMISSIONS[userRole] || [];
        return filterNavigationByPermissions(data[menuItems], userPermissions);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userRole, lang]); // Use lang instead of data object
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
                                />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
            </div>
            <SidebarContent className='mb-16'>
                <NavMain
                    items={filteredNavigations}
                    lang={lang}
                    pendingInquiries={pendingInquiries}
                    pendingReviewsCount={pendingReviewsCount}
                />
                {/* <NavDocuments items={data.documents} />*/}
                {/* <NavSecondary items={data.navSecondary} className='mt-auto' />*/}
            </SidebarContent>
            <SidebarFooter>{/* <NavUser user={data.user} />*/}</SidebarFooter>
        </Sidebar>
    );
}
