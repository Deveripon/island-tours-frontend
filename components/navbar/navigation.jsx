'use client';
import { Button } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ChevronDown, Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { getNavigations } from '@/navigations/navigations';
import { ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
function NavigationBar({ lang }) {
    const [isOpen, setIsOpen] = useState(false);
    const [openMobileMenu, setOpenMobileMenu] = useState(null);
    const pathname = usePathname();
    const isOnboarding = pathname.includes('/onboarding');

    const handleLinkClick = () => {
        setIsOpen(false);
        setOpenMobileMenu(null);
    };

    const toggleMobileSubmenu = index => {
        setOpenMobileMenu(openMobileMenu === index ? null : index);
    };

    let navigationItems = getNavigations(lang);

    return (
        <>
            {/* Desktop Navigation */}
            <NavigationMenu className='mx-6 hidden lg:flex'>
                <NavigationMenuList>
                    {navigationItems.mainNavigations.map((item, index) => (
                        <NavigationMenuItem key={index}>
                            {item.items && item.items.length > 0 ? (
                                // Mega Menu for items with sub-items
                                <>
                                    <NavigationMenuTrigger className='bg-transparent !text-sm'>
                                        {item.name}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className='grid gap-3 p-6 w-[500px] lg:w-[600px] lg:grid-cols-2 bg-sass-primary/10'>
                                            {item.items.map(
                                                (subItem, subIndex) => (
                                                    <NavigationMenuLink
                                                        key={subIndex}
                                                        href={subItem.url}
                                                        className={cn(
                                                            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                                                        )}>
                                                        <div className='flex items-center gap-3'>
                                                            {subItem.icon && (
                                                                <subItem.icon className='h-5 w-5 text-sass-primary' />
                                                            )}
                                                            <div>
                                                                <div className='text-sm font-medium leading-none'>
                                                                    {
                                                                        subItem.name
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </NavigationMenuLink>
                                                )
                                            )}
                                        </div>
                                    </NavigationMenuContent>
                                </>
                            ) : (
                                // Regular link for items without sub-items
                                <NavigationMenuLink
                                    href={item.url}
                                    className={
                                        navigationMenuTriggerStyle() +
                                        ' bg-transparent !text-sm'
                                    }>
                                    {item.name}
                                </NavigationMenuLink>
                            )}
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>

            {/* Mobile Navigation */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className='lg:hidden ml-auto mr-2'>
                    <Button variant='ghost' size='icon'>
                        <Menu className='h-6 w-6' />
                    </Button>
                </SheetTrigger>
                <SheetContent
                    side='right'
                    className='w-[300px] overflow-auto sm:w-[400px]'>
                    <nav className='flex flex-col gap-2 mt-6'>
                        {navigationItems.mainNavigations.map((item, index) => (
                            <div key={index} className='space-y-2'>
                                {item.items && item.items.length > 0 ? (
                                    // Mobile accordion for items with sub-items
                                    <div>
                                        <button
                                            onClick={() =>
                                                toggleMobileSubmenu(index)
                                            }
                                            className='flex items-center justify-between w-full px-2 py-2 text-sm hover:text-sass-primary transition-colors'>
                                            <span>{item.name}</span>
                                            <ChevronDown
                                                className={cn(
                                                    'h-4 w-4 transition-transform duration-200',
                                                    openMobileMenu === index &&
                                                        'rotate-180'
                                                )}
                                            />
                                        </button>
                                        {openMobileMenu === index && (
                                            <div className='pl-4 space-y-2 border-l-2 border-gray-200 ml-2'>
                                                {item.items.map(
                                                    (subItem, subIndex) => (
                                                        <Link
                                                            key={subIndex}
                                                            href={subItem.url}
                                                            className='flex items-center gap-3 px-2 py-2 text-base hover:text-sass-primary transition-colors'
                                                            onClick={
                                                                handleLinkClick
                                                            }>
                                                            {subItem.icon && (
                                                                <subItem.icon className='h-4 w-4' />
                                                            )}
                                                            {subItem.name}
                                                        </Link>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    // Regular link for items without sub-items
                                    <Link
                                        href={item.url}
                                        className='block px-2 py-2 text-sm hover:text-sass-primary transition-colors'
                                        onClick={handleLinkClick}>
                                        {item.name}
                                    </Link>
                                )}
                            </div>
                        ))}

                        {!isOnboarding && (
                            <div className='block mt-6 space-y-3 text-left'>
                                {' '}
                                <Link
                                    href='/sign-in'
                                    className='px-6 py-2 xs:px-6 xs:py-3 flex items-center justify-center gap-2 rounded-lg  text-gray-600 leading-relaxed text-sm sm:text-base border-2 border-gray-200 hover:bg-sass-primary/90 transition-colors duration-300 tracking-tighter hover:text-white    '>
                                    Sign In
                                </Link>
                                <Link
                                    href='/sign-up'
                                    className='px-6 py-2 xs:px-6 xs:py-3 flex items-center justify-center gap-2 rounded-lg bg-sass-primary text-white leading-relaxed text-sm tracking-tighter sm:text-base hover:bg-sass-primary/90'>
                                    Start Free Trial
                                    <ArrowRight size={16} className='w-4 h-4' />
                                </Link>
                                <Link
                                    target='_blank'
                                    href={
                                        process.env
                                            .NEXT_PUBLIC_MEETING_LINK_FOR_DEMO
                                    }
                                    className='px-6 py-2 xs:px-6 xs:py-3 flex items-center justify-center gap-2 rounded-lg  text-gray-600 leading-relaxed text-sm sm:text-base border-2 border-gray-200 hover:bg-sass-primary/90 transition-colors duration-300 tracking-tighter hover:text-white'>
                                    Book a Demo
                                    <ArrowRight size={16} className='w-4 h-4' />
                                </Link>
                            </div>
                        )}
                    </nav>
                </SheetContent>
            </Sheet>
        </>
    );
}

export default NavigationBar;

