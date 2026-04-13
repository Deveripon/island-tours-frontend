'use client';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import {
    ArrowLeft02FreeIcons,
    ArrowRight01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SidebarNav({ loggedInUser, items }) {
    const pathname = usePathname();

    // Helper function to check if a path is active
    const basePath = `/account`;
    const isPathActive = url => {
        if (!url || url === '#') return false;

        // Special handling for root path - should be active only when exactly at basePath
        if (url === '/') {
            return pathname === basePath || pathname === `${basePath}/`;
        }

        // For non-root paths, try multiple approaches to match
        const cleanUrl = url.replace(/^\/+|\/+$/g, '');
        const approaches = [
            `${basePath}/${cleanUrl}`,
            `${basePath}/${url}`,
            pathname.endsWith(`/${cleanUrl}`),
            pathname.includes(`/${cleanUrl}`),
            pathname.split('/').pop() === cleanUrl,
            pathname.split('/').pop() === url,
        ];

        // Check if any approach matches
        return approaches.some(approach => {
            if (typeof approach === 'string') {
                return (
                    pathname === approach || pathname.startsWith(`${approach}/`)
                );
            }
            return approach; // for boolean results
        });
    };

    // Helper function to check if any child item is active
    const hasActiveChild = items => {
        if (!items || !Array.isArray(items)) return false;

        return items.some(item => {
            // Check if current item is active
            if (item.url && isPathActive(item.url)) {
                return true;
            }

            // Recursively check nested items
            if (item.items && Array.isArray(item.items)) {
                return hasActiveChild(item.items);
            }

            return false;
        });
    };

    // Helper function to determine if collapsible should be open
    const shouldBeOpen = item => {
        // Check if the item itself is explicitly marked as active
        if (item.isActive === true) return true;

        // Check if the item's direct URL is active
        if (item.url && isPathActive(item.url)) return true;

        // Check if any child items are active
        if (item.items && Array.isArray(item.items)) {
            return hasActiveChild(item.items);
        }

        return false;
    };

    // Helper function to check if item has children
    const hasChildren = item => {
        return item.items && item.items.length > 0;
    };

    return (
        <SidebarGroup className='px-0'>
            <SidebarMenu className='gap-y-2'>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        tooltip='Dashboard'
                        onClick={() => {
                            window.location.href = `/`;
                        }}
                        className='w-full h-9 px-3 border-l-4 py-2 rounded-none border-transparent text-sidebar-foreground/70 hover:text-sidebar-foreground transition-all duration-150 hover:border-primary hover:bg-sidebar-accent'>
                        <HugeiconsIcon
                            icon={ArrowLeft02FreeIcons}
                            className='w-5 h-5 shrink-0'
                        />
                        <span className='text-xs font-normal truncate'>
                            Back to Site
                        </span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                {items.map(item => {
                    const isItemActive = item.url
                        ? isPathActive(item.url)
                        : false;
                    const hasActiveChildren = hasActiveChild(item.items);
                    const isOpen = shouldBeOpen(item);
                    const itemHasChildren = hasChildren(item);

                    return (
                        <SidebarMenuItem key={item.title}>
                            {/* If item has children, render as collapsible */}
                            {itemHasChildren ? (
                                <Collapsible
                                    asChild
                                    defaultOpen={isOpen}
                                    className='group/collapsible'>
                                    <div>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                tooltip={item.title}
                                                className={cn(
                                                    'w-full h-9 px-3 border-l-4 py-2 rounded-none border-transparent',
                                                    'text-sidebar-foreground/70 hover:text-sidebar-foreground transition-all duration-150',
                                                    'hover:border-primary hover:bg-sidebar-accent'
                                                )}>
                                                {item.icon && (
                                                    <item.icon className='w-5 h-5 shrink-0' />
                                                )}
                                                <span className='text-xs font-normal truncate'>
                                                    {item.title}
                                                </span>
                                                <HugeiconsIcon
                                                    icon={ArrowRight01Icon}
                                                    className='ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90'
                                                />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className='bg-sidebar-accent/30 transition-all duration-200 ease-in-out'>
                                            <SidebarMenuSub>
                                                {item.items?.map(subItem => {
                                                    const isSubItemActive =
                                                        subItem.url
                                                            ? isPathActive(
                                                                  subItem.url
                                                              )
                                                            : false;
                                                    const hasActiveSubChildren =
                                                        hasActiveChild(
                                                            subItem.items
                                                        );
                                                    const isSubOpen =
                                                        shouldBeOpen(subItem);

                                                    return (
                                                        <SidebarMenuSubItem
                                                            className='m-0'
                                                            key={subItem.title}>
                                                            {/* Check if this second-level item has its own children */}
                                                            {subItem.items &&
                                                            subItem.items
                                                                .length > 0 ? (
                                                                <Collapsible
                                                                    asChild
                                                                    defaultOpen={
                                                                        isSubOpen
                                                                    }
                                                                    className='group/subcollapsible w-full'>
                                                                    <div>
                                                                        <CollapsibleTrigger
                                                                            asChild>
                                                                            <SidebarMenuSubButton
                                                                                className={cn(
                                                                                    'w-full h-8 pl-8 pr-3 py-1 rounded-none border-l-4 border-transparent',
                                                                                    'text-sidebar-foreground/60 hover:text-sidebar-foreground transition-all duration-150',
                                                                                    'hover:border-primary hover:bg-sidebar-accent',
                                                                                    'group-data-[state=open]/subcollapsible:bg-sidebar-accent/50',
                                                                                    // Active state styles
                                                                                    (isSubItemActive ||
                                                                                        hasActiveSubChildren) &&
                                                                                        'border-primary text-sidebar-foreground bg-sidebar-accent/50'
                                                                                )}>
                                                                                {subItem.icon && (
                                                                                    <subItem.icon className='w-4 h-4 shrink-0 mr-2' />
                                                                                )}
                                                                                <span className='text-xs truncate'>
                                                                                    {
                                                                                        subItem.title
                                                                                    }
                                                                                </span>
                                                                                <HugeiconsIcon
                                                                                    icon={
                                                                                        ArrowRight01Icon
                                                                                    }
                                                                                    className='ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/subcollapsible:rotate-90'
                                                                                />
                                                                            </SidebarMenuSubButton>
                                                                        </CollapsibleTrigger>
                                                                        <CollapsibleContent className='bg-sidebar-accent/40 transition-all duration-200 ease-in-out'>
                                                                            <SidebarMenuSub className='ml-0 pl-0 border-l-0'>
                                                                                {subItem.items.map(
                                                                                    thirdLevelItem => {
                                                                                        const isThirdLevelActive =
                                                                                            thirdLevelItem.url
                                                                                                ? isPathActive(
                                                                                                      thirdLevelItem.url
                                                                                                  )
                                                                                                : false;

                                                                                        return (
                                                                                            <SidebarMenuSubItem
                                                                                                className='m-0'
                                                                                                key={
                                                                                                    thirdLevelItem.title
                                                                                                }>
                                                                                                <SidebarMenuSubButton
                                                                                                    asChild
                                                                                                    className={cn(
                                                                                                        'w-full h-8 pl-12 pr-3 py-1 rounded-none border-l-4 border-transparent',
                                                                                                        'text-sidebar-foreground/60 hover:text-sidebar-foreground transition-all duration-150',
                                                                                                        'hover:border-primary hover:bg-sidebar-accent',
                                                                                                        // Active state styles
                                                                                                        isThirdLevelActive &&
                                                                                                            'border-primary text-sidebar-foreground bg-sidebar-accent/50'
                                                                                                    )}>
                                                                                                    <Link
                                                                                                        href={`${basePath}/${thirdLevelItem.url}`}>
                                                                                                        {thirdLevelItem.icon && (
                                                                                                            <thirdLevelItem.icon className='w-4 h-4 shrink-0 mr-2' />
                                                                                                        )}
                                                                                                        <span className='text-xs truncate'>
                                                                                                            {
                                                                                                                thirdLevelItem.title
                                                                                                            }
                                                                                                        </span>
                                                                                                    </Link>
                                                                                                </SidebarMenuSubButton>
                                                                                            </SidebarMenuSubItem>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </SidebarMenuSub>
                                                                        </CollapsibleContent>
                                                                    </div>
                                                                </Collapsible>
                                                            ) : (
                                                                // Second level without children
                                                                <SidebarMenuSubButton
                                                                    asChild
                                                                    className={cn(
                                                                        'w-full h-8 pl-8 pr-3 py-1 rounded-none border-l-4 border-transparent',
                                                                        'text-sidebar-foreground/60 hover:text-sidebar-foreground transition-all duration-150',
                                                                        'hover:border-primary hover:bg-sidebar-accent',
                                                                        // Active state styles
                                                                        isSubItemActive &&
                                                                            'border-primary text-sidebar-foreground bg-sidebar-accent/50'
                                                                    )}>
                                                                    <Link
                                                                        href={`${basePath}/${subItem.url}`}>
                                                                        {subItem.icon && (
                                                                            <subItem.icon className='w-4 h-4 shrink-0 mr-2' />
                                                                        )}
                                                                        <span className='text-xs truncate'>
                                                                            {
                                                                                subItem.title
                                                                            }
                                                                        </span>
                                                                    </Link>
                                                                </SidebarMenuSubButton>
                                                            )}
                                                        </SidebarMenuSubItem>
                                                    );
                                                })}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </div>
                                </Collapsible>
                            ) : /* If item has no children but has a URL, render as a link */
                            item.url && item.url !== '#' ? (
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.title}
                                    className={cn(
                                        'w-full h-9 px-3 py-2 rounded-none border-l-4 border-transparent',
                                        'text-sidebar-foreground/70 hover:text-sidebar-foreground transition-all duration-150',
                                        'hover:border-primary hover:bg-sidebar-accent',
                                        isItemActive &&
                                            'border-primary text-sidebar-foreground bg-sidebar-accent'
                                    )}>
                                    <Link href={`${basePath}/${item.url}`}>
                                        {item.icon && (
                                            <item.icon className='w-5 h-5 shrink-0' />
                                        )}
                                        <span className='text-xs font-normal truncate'>
                                            {item.title}
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            ) : (
                                /* If item has no children and no valid URL, render as disabled button */
                                <SidebarMenuButton
                                    tooltip={item.title}
                                    className={cn(
                                        'w-full h-9 px-3 py-2 rounded-none border-l-4 border-transparent',
                                        'text-muted-foreground opacity-60'
                                    )}>
                                    <Link href={`${basePath}/${item.url}`}>
                                        {item.icon && (
                                            <item.icon className='w-5 h-5 shrink-0' />
                                        )}
                                        <span className='text-xs font-normal truncate'>
                                            {item.title}
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

