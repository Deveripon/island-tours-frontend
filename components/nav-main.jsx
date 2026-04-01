'use client';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { ArrowDown01Icon, Home03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from './ui/badge';

export function NavMain({ items, tenant, lang, pendingInquries, pendingReviewsCount }) {
    const pathname = usePathname();
    const isHomeActive = pathname === `/${lang}/${tenant}/dashboard`;

    return (
        <SidebarGroup>
            <SidebarGroupContent className='flex flex-col gap-2 px-3'>
                {/* Quick Actions */}
                <SidebarMenu>
                    <SidebarMenuItem className='flex items-center gap-2 h-10'>
                        <SidebarMenuButton
                            tooltip='Dashboard'
                            className={cn(
                                `hover:bg-accent/80  min-w-8 duration-200 ease-linear rounded-lg !h-10`,
                                isHomeActive &&
                                    'bg-primary dark:bg-primary/50 text-white'
                            )}>
                            <Link
                                className='flex gap-2 justify-between items-center h-10'
                                href={`/${tenant}/dashboard/`}>
                                <HugeiconsIcon
                                    className='size-4'
                                    icon={Home03Icon}
                                />
                                <span className='font-medium'>Dashboard</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* Main Navigation */}
                <SidebarMenu className='gap-1'>
                    {items.map(item => {
                        const isActive = pathname?.includes(item.url);
                        const hasSubItems = item.items && item.items.length > 0;

                        // If item has sub-items, render as collapsible
                        if (hasSubItems) {
                            return (
                                <Collapsible
                                    key={item.title}
                                    asChild
                                    defaultOpen={item?.isActive || isActive}
                                    className='group/collapsible gap-5'>
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                tooltip={item.title}
                                                className={cn(
                                                    'h-10 rounded-lg hover:bg-accent/50 transition-all duration-200',
                                                    'data-[state=open]:bg-accent/30',
                                                    isActive && 'bg-accent/50'
                                                )}>
                                                {item.icon && (
                                                    <HugeiconsIcon
                                                        className='size-5 shrink-0'
                                                        icon={item.icon}
                                                    />
                                                )}
                                                <span className='font-medium text-sm'>
                                                    {item.title}
                                                </span>
                                                <HugeiconsIcon
                                                    className='ml-auto size-4 shrink-0 transition-transform duration-300 ease-out group-data-[state=open]/collapsible:rotate-180'
                                                    icon={ArrowDown01Icon}
                                                />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className='overflow-hidden transition-all duration-300 ease-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
                                            <SidebarMenuSub className='mt-1 ml-0 px-0 py-1 border-0 relative'>
                                                {/* Vertical line */}
                                                <div className='absolute left-[18px] top-0 bottom-0 w-[1.5px] bg-accent/30' />

                                                {item.items.map(
                                                    (subItem, index) => {
                                                        const isSubActive =
                                                            pathname?.includes(
                                                                subItem.url
                                                            );
                                                        const isLast =
                                                            index ===
                                                            item.items.length -
                                                                1;

                                                        return (
                                                            <SidebarMenuSubItem
                                                                key={
                                                                    subItem.title
                                                                }
                                                                className={cn(
                                                                    `mb-0.5 relative`,
                                                                    isSubActive &&
                                                                        '!text-white'
                                                                )}>
                                                                {/* Curved connector using SVG */}
                                                                <svg
                                                                    className='absolute left-[18px] top-0 w-6 h-10 text-accent/30'
                                                                    viewBox='0 0 24 40'
                                                                    fill='none'
                                                                    xmlns='http://www.w3.org/2000/svg'>
                                                                    <path
                                                                        d='M 1 0 L 1 20 Q 1 28 9 28 L 24 28'
                                                                        stroke='currentColor'
                                                                        strokeWidth='1.5'
                                                                        fill='none'
                                                                    />
                                                                </svg>

                                                                {/* Hide vertical line after last item */}
                                                                {isLast && (
                                                                    <div className='absolute left-[18px] top-0 w-[1.5px] h-5 bg-sidebar-background' />
                                                                )}

                                                                <SidebarMenuSubButton
                                                                    asChild
                                                                    isActive={
                                                                        isSubActive
                                                                    }
                                                                    className={cn(
                                                                        'h-10 rounded-lg ml-10 hover:bg-accent/50 transition-all duration-200',
                                                                        isSubActive &&
                                                                            '!bg-primary dark:!bg-primary/50 font-medium !text-white'
                                                                    )}>
                                                                    <Link
                                                                        href={`/${tenant}/dashboard/${subItem.url}`}>
                                                                        {subItem.icon && (
                                                                            <HugeiconsIcon
                                                                                className={cn(
                                                                                    'size-5 shrink-0',
                                                                                    isSubActive &&
                                                                                        '!text-white'
                                                                                )}
                                                                                icon={
                                                                                    subItem.icon
                                                                                }
                                                                            />
                                                                        )}
                                                                        <span className='text-sm'>
                                                                            {
                                                                                subItem.title
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
                                    </SidebarMenuItem>
                                </Collapsible>
                            );
                        }

                        // If item has no sub-items, render as regular link
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.title}
                                    isActive={isActive}
                                    className={cn(
                                        'h-10 rounded-lg   hover:bg-accent/50 transition-all duration-200 relative',
                                        isActive &&
                                            '!bg-primary dark:!bg-primary/50 font-medium !text-white'
                                    )}>
                                    <Link
                                        className='flex items-center  gap-2 h-10'
                                        href={`/${tenant}/dashboard/${item.url}`}>
                                        {item.icon && (
                                            <HugeiconsIcon
                                                className='size-5'
                                                icon={item.icon}
                                            />
                                        )}
                                        <span className='font-medium text-sm'>
                                            {item.title}
                                        </span>
                                        {item.url === 'enquires' &&
                                            pendingInquries > 0 && (
                                                <Badge
                                                    variant='destructive'
                                                    className='absolute  top-0 right-0'>
                                                    {pendingInquries}
                                                </Badge>
                                            )}
                                        {item.url === 'reviews' &&
                                            pendingReviewsCount > 0 && (
                                                <Badge
                                                    variant='destructive'
                                                    className='absolute  top-0 right-0'>
                                                    {pendingReviewsCount}
                                                </Badge>
                                            )}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
