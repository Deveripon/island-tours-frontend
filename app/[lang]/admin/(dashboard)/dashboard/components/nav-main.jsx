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
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

export function NavMain({ tenant, items }) {
    const pathname = usePathname();
    const router = useRouter();
    const [hoveredItem, setHoveredItem] = useState(null);
    const [hoveredSubItem, setHoveredSubItem] = useState(null);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const [subPopupPosition, setSubPopupPosition] = useState({
        top: 0,
        left: 0 });
    const [expandedItems, setExpandedItems] = useState(new Set());
    const timeoutRef = useRef(null);
    const subTimeoutRef = useRef(null);

    // Helper function to check if a path is active (simplified version)
    const isPathActive = url => {
        if (!url || url === '#') return false;

        // Try multiple approaches to match
        const cleanUrl = url.replace(/^\/+|\/+$/g, '');
        const approaches = [
            `/${tenant}/dashboard/${cleanUrl}`,
            `/${tenant}/dashboard/${url}`,
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
            if (item.url && isPathActive(item.url)) {
                return true;
            }
            if (item.items && Array.isArray(item.items)) {
                return hasActiveChild(item.items);
            }
            return false;
        });
    };

    // Helper function to determine if collapsible should be open
    const shouldBeOpen = item => {
        if (item.isActive === true) return true;
        if (item.url && isPathActive(item.url)) return true;
        if (item.items && Array.isArray(item.items)) {
            return hasActiveChild(item.items);
        }
        return false;
    };

    // Helper function to check if item has children
    const hasChildren = item => {
        return item.items && item.items.length > 0;
    };

    // Helper function to find the first navigable submenu item
    const findFirstNavigableItem = items => {
        if (!items || !Array.isArray(items)) return null;

        for (const item of items) {
            if (item.url && item.url !== '#') {
                return item;
            }
            // If this item has children, recursively search
            if (item.items && item.items.length > 0) {
                const found = findFirstNavigableItem(item.items);
                if (found) return found;
            }
        }
        return null;
    };

    // Track expanded state changes with single expansion logic
    const handleCollapsibleChange = (itemTitle, isOpen) => {
        setExpandedItems(prev => {
            const newSet = new Set();
            if (isOpen) {
                // Only keep this item expanded, collapse all others
                newSet.add(itemTitle);
            }
            // If isOpen is false, the set remains empty (all collapsed)
            return newSet;
        });
    };

    // Handle collapsible trigger click
    const handleCollapsibleTriggerClick = (item, currentlyOpen) => {
        if (!currentlyOpen && hasChildren(item)) {
            // If opening and has children, navigate to first submenu item
            const firstItem = findFirstNavigableItem(item.items);
            if (firstItem) {
                router.push(`/${tenant}/dashboard/${firstItem.url}`);
            }
        }
    };

    // Handle menu button click for items without children
    const handleMenuButtonClick = item => {
        if (item.url && item.url !== '#') {
            // Collapse all expanded items when navigating to a direct link
            setExpandedItems(new Set());
            router.push(`/${tenant}/dashboard/${item.url}`);
        }
    };

    // Handle hover for main menu items
    const handleMainItemHover = (item, event) => {
        // Don't show tooltip if the item is already expanded
        if (expandedItems.has(item.title) || shouldBeOpen(item)) {
            return;
        }

        if (hasChildren(item)) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            const rect = event.currentTarget.getBoundingClientRect();
            setPopupPosition({
                top: rect.top,
                left: rect.right + 8 });
            setHoveredItem(item);
        }
    };

    const handleMainItemLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setHoveredItem(null);
            setHoveredSubItem(null);
        }, 300);
    };

    // Handle hover for submenu items
    const handleSubItemHover = (subItem, event) => {
        if (hasChildren(subItem)) {
            if (subTimeoutRef.current) {
                clearTimeout(subTimeoutRef.current);
            }

            const rect = event.currentTarget.getBoundingClientRect();
            setSubPopupPosition({
                top: rect.top,
                left: rect.right + 8 });
            setHoveredSubItem(subItem);
        }
    };

    const handleSubItemLeave = () => {
        subTimeoutRef.current = setTimeout(() => {
            setHoveredSubItem(null);
        }, 200);
    };

    const handlePopupHover = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (subTimeoutRef.current) {
            clearTimeout(subTimeoutRef.current);
        }
    };

    const handlePopupLeave = () => {
        setHoveredItem(null);
        setHoveredSubItem(null);
    };

    // Handle submenu click in tooltip - expand the main menu and close tooltip
    const handleTooltipSubmenuClick = (parentItem, subItem) => {
        // Expand the parent item (and collapse others)
        setExpandedItems(prev => new Set([parentItem.title]));

        // Close tooltips
        setHoveredItem(null);
        setHoveredSubItem(null);

        // Clear any pending timeouts
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (subTimeoutRef.current) {
            clearTimeout(subTimeoutRef.current);
        }
    };

    return (
        <>
            <SidebarGroup className='px-0'>
                <SidebarMenu className='gap-y-2'>
                    {items.map(item => {
                        const isItemActive = item.url
                            ? isPathActive(item.url)
                            : false;
                        const hasActiveChildren = hasActiveChild(item.items);
                        const isOpen =
                            shouldBeOpen(item) || expandedItems.has(item.title);
                        const itemHasChildren = hasChildren(item);

                        return (
                            <SidebarMenuItem key={item.title}>
                                {/* WordPress-style parent item with children */}
                                {itemHasChildren ? (
                                    <Collapsible
                                        open={isOpen}
                                        onOpenChange={open =>
                                            handleCollapsibleChange(
                                                item.title,
                                                open
                                            )
                                        }
                                        className='group/collapsible'>
                                        <div>
                                            <CollapsibleTrigger
                                                asChild
                                                aria-expanded={isOpen}
                                                onClick={() =>
                                                    handleCollapsibleTriggerClick(
                                                        item,
                                                        isOpen
                                                    )
                                                }>
                                                <SidebarMenuButton
                                                    tooltip={item.title}
                                                    onMouseEnter={e =>
                                                        handleMainItemHover(
                                                            item,
                                                            e
                                                        )
                                                    }
                                                    onMouseLeave={
                                                        handleMainItemLeave
                                                    }
                                                    className={cn(
                                                        // WordPress base styles
                                                        'w-full h-9 px-3 border-l-6  py-2 rounded-none  border-transparent',
                                                        'text-slate-300 hover:text-white transition-all duration-150',
                                                        ' hover:border-primary hover:text-white'
                                                    )}>
                                                    {item.icon && (
                                                        <item.icon className='w-5 h-5 shrink-0 ' />
                                                    )}
                                                    <span className='text-xs font-normal truncate'>
                                                        {item.title}
                                                    </span>
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className='bg-slate-800/30 transition-all duration-200 ease-in-out'>
                                                <SidebarMenuSub>
                                                    {item.items?.map(
                                                        subItem => {
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
                                                                shouldBeOpen(
                                                                    subItem
                                                                );

                                                            return (
                                                                <SidebarMenuSubItem
                                                                    className='m-0'
                                                                    key={
                                                                        subItem.title
                                                                    }>
                                                                    {/* Second level with children */}
                                                                    {subItem.items &&
                                                                    subItem
                                                                        .items
                                                                        .length >
                                                                        0 ? (
                                                                        <Collapsible
                                                                            asChild
                                                                            defaultOpen={
                                                                                isSubOpen
                                                                            }
                                                                            className='group/subcollapsible w-full'>
                                                                            <div>
                                                                                <CollapsibleTrigger
                                                                                    asChild
                                                                                    aria-expanded={
                                                                                        isSubOpen
                                                                                    }
                                                                                    onClick={() => {
                                                                                        if (
                                                                                            !isSubOpen &&
                                                                                            hasChildren(
                                                                                                subItem
                                                                                            )
                                                                                        ) {
                                                                                            const firstSubItem =
                                                                                                findFirstNavigableItem(
                                                                                                    subItem.items
                                                                                                );
                                                                                            if (
                                                                                                firstSubItem
                                                                                            ) {
                                                                                                router.push(
                                                                                                    `/${tenant}/dashboard/${firstSubItem.url}`
                                                                                                );
                                                                                            }
                                                                                        }
                                                                                    }}>
                                                                                    <SidebarMenuSubButton
                                                                                        className={cn(
                                                                                            // WordPress sub-item styles
                                                                                            'w-full h-8 pl-8 pr-3 py-1 rounded-none border-l-6 border-transparent',
                                                                                            'text-slate-400 hover:text-white transition-all duration-150',
                                                                                            'hover:border-left border-l-6 hover:border-primary hover:text-white',
                                                                                            'focus:border-left border-l-6 focus:border-primary focus:text-white',
                                                                                            'group-data-[state=open]/subcollapsible:bg-slate-700/20',
                                                                                            // Active state styles
                                                                                            (isSubItemActive ||
                                                                                                hasActiveSubChildren) &&
                                                                                                'border-left border-l-6 border-primary text-white bg-slate-700/20'
                                                                                        )}>
                                                                                        <span className='text-xs truncate'>
                                                                                            {
                                                                                                subItem.title
                                                                                            }
                                                                                        </span>
                                                                                    </SidebarMenuSubButton>
                                                                                </CollapsibleTrigger>
                                                                                <CollapsibleContent className='bg-slate-900/20 transition-all duration-200 ease-in-out'>
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
                                                                                                                // WordPress third level styles
                                                                                                                'w-full h-8 pl-12 pr-3 py-1 rounded-none border-l-6 border-transparent',
                                                                                                                'text-slate-400 hover:text-white transition-all duration-150',
                                                                                                                'hover:border-left border-l-6 hover:border-primary hover:text-white',
                                                                                                                'focus:border-left border-l-6 focus:border-primary focus:text-white',
                                                                                                                // Active state styles
                                                                                                                isThirdLevelActive &&
                                                                                                                    'border-left border-l-6 border-primary text-white bg-slate-900/20'
                                                                                                            )}>
                                                                                                            <Link
                                                                                                                href={`/${tenant}/dashboard/${thirdLevelItem.url}`}>
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
                                                                                // WordPress sub-item styles
                                                                                'w-full h-8 pl-8 pr-3 py-1 rounded-none border-l-6 border-transparent',
                                                                                'text-slate-400 hover:text-white transition-all duration-150',
                                                                                'hover:border-left border-l-6 hover:border-primary hover:text-white',
                                                                                'focus:border-left border-l-6 focus:border-primary focus:text-white',
                                                                                // Active state styles
                                                                                isSubItemActive &&
                                                                                    'border-left border-l-6 border-primary text-white bg-slate-700/20'
                                                                            )}>
                                                                            <Link
                                                                                href={`/${tenant}/dashboard/${subItem.url}`}>
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
                                                        }
                                                    )}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </div>
                                    </Collapsible>
                                ) : /* Top level item without children */
                                item.url && item.url !== '#' ? (
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        onClick={() =>
                                            handleMenuButtonClick(item)
                                        }
                                        className={cn(
                                            // WordPress base styles
                                            'w-full h-9 px-3 py-2 rounded-none border-l-6 border-transparent',
                                            'text-slate-300 hover:text-white transition-all duration-150',
                                            'hover:border-primary hover:text-white',
                                            isItemActive &&
                                                'border-left border-l-6 border-primary text-white bg-slate-800'
                                        )}>
                                        <Link
                                            href={`/${tenant}/dashboard/${item.url}`}>
                                            {item.icon && (
                                                <item.icon className='w-5 h-5 shrink-0 ' />
                                            )}
                                            <span className='text-xs font-normal truncate'>
                                                {item.title}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                ) : (
                                    // Disabled item
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        className={cn(
                                            'w-full h-9 px-3 py-2 rounded-none border-l-6 border-transparent',
                                            'text-slate-500 cursor-not-allowed opacity-60'
                                        )}>
                                        {item.icon && (
                                            <item.icon className='w-5 h-5 shrink-0 ' />
                                        )}
                                        <span className='text-xs font-normal truncate'>
                                            {item.title}
                                        </span>
                                    </SidebarMenuButton>
                                )}
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroup>

            {/* Hover Popup for Main Menu */}
            {hoveredItem && (
                <div className='relative'>
                    <div
                        className='fixed z-50 bg-slate-900 backdrop-blur-sm border border-slate-700/50 shadow-2xl rounded-lg py-1 min-w-48 max-w-64'
                        style={{
                            top: `${popupPosition.top}px`,
                            left: `${popupPosition.left}px`,
                            boxShadow:
                                '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
                        }}
                        onMouseEnter={handlePopupHover}
                        onMouseLeave={handlePopupLeave}>
                        {/* Tooltip Arrow */}
                        <div className='absolute -left-1 top-4 w-4 h-4 bg-slate-900 border-l border-b border-slate-700/50 transform rotate-45'></div>

                        {hoveredItem.items?.map((subItem, index) => (
                            <div
                                key={subItem.title}
                                className='relative'
                                onMouseEnter={e =>
                                    handleSubItemHover(subItem, e)
                                }
                                onMouseLeave={handleSubItemLeave}>
                                {subItem.items && subItem.items.length > 0 ? (
                                    <div
                                        className='px-3 py-1 text-slate-200 hover:border-left border-l-6 border-transparent hover:border-primary hover:text-white cursor-pointer transition-all duration-200 ease-out flex items-center justify-between group mx-1'
                                        onClick={() =>
                                            handleTooltipSubmenuClick(
                                                hoveredItem,
                                                subItem
                                            )
                                        }>
                                        <span className='text-xs font-normal'>
                                            {subItem.title}
                                        </span>
                                        <svg
                                            className='w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'>
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M9 5l7 7-7 7'
                                            />
                                        </svg>
                                    </div>
                                ) : subItem.url ? (
                                    <Link
                                        href={`/${tenant}/dashboard/${subItem.url}`}
                                        className='block px-3 py-1 text-slate-200 hover:border-left border-l-6 border-transparent hover:border-primary hover:text-white transition-all duration-200 ease-out mx-1'
                                        onClick={() =>
                                            handleTooltipSubmenuClick(
                                                hoveredItem,
                                                subItem
                                            )
                                        }>
                                        <span className='text-xs font-normal'>
                                            {subItem.title}
                                        </span>
                                    </Link>
                                ) : (
                                    <div className='px-3 py-1 text-slate-500 cursor-not-allowed opacity-60 mx-1'>
                                        <span className='text-xs'>
                                            {subItem.title}
                                        </span>
                                    </div>
                                )}

                                {/* Subtle separator between items */}
                                {index < hoveredItem.items.length - 1 && (
                                    <div className='mx-3 border-b border-slate-700/30'></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Hover Popup for Submenu */}
            {hoveredSubItem && hoveredSubItem.items && (
                <div
                    className='fixed z-60 bg-slate-900 backdrop-blur-sm border border-slate-700/50 shadow-2xl rounded-lg py-1 min-w-48 max-w-64'
                    style={{
                        top: `${subPopupPosition.top}px`,
                        left: `${subPopupPosition.left}px`,
                        boxShadow:
                            '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
                    }}
                    onMouseEnter={handlePopupHover}
                    onMouseLeave={handlePopupLeave}>
                    {/* Tooltip Arrow */}
                    <div className='absolute -left-1 top-4 w-4 h-4 bg-slate-900 border-l border-b border-slate-700/50 transform rotate-45'></div>

                    {hoveredSubItem.items.map((thirdLevelItem, index) => (
                        <div key={thirdLevelItem.title}>
                            {thirdLevelItem.url ? (
                                <Link
                                    href={`/${tenant}/dashboard/${thirdLevelItem.url}`}
                                    className='block px-3 py-1 text-slate-200 hover:border-left border-l-6 hover:border-primary hover:text-white transition-all duration-200 ease-out rounded-md mx-1 group'
                                    onClick={() =>
                                        handleTooltipSubmenuClick(
                                            hoveredItem,
                                            hoveredSubItem
                                        )
                                    }>
                                    <div className='flex items-center'>
                                        {thirdLevelItem.icon && (
                                            <thirdLevelItem.icon className='w-4 h-4 mr-2 opacity-70 group-hover:opacity-100 transition-opacity' />
                                        )}
                                        <span className='text-xs font-normal'>
                                            {thirdLevelItem.title}
                                        </span>
                                    </div>
                                </Link>
                            ) : (
                                <div className='px-3 py-1 text-slate-500 cursor-not-allowed opacity-60 mx-1'>
                                    <span className='text-xs'>
                                        {thirdLevelItem.title}
                                    </span>
                                </div>
                            )}

                            {/* Subtle separator between items */}
                            {index < hoveredSubItem.items.length - 1 && (
                                <div className='mx-3 border-b border-slate-700/30'></div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

