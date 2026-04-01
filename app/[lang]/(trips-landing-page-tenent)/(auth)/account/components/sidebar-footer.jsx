'use client';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowUpDownIcon } from '@hugeicons/core-free-icons';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { signOut } from 'next-auth/react';

const SidebarFooterMenu = ({ data, session, tanentid }) => {

    return (
        <SidebarFooter className='!h-auto'>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size='lg'
                                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
                                <Avatar className='h-8 w-8 rounded-lg'>
                                    {/*           <AvatarImage
                                        src={
                                            data.user.avatar ||
                                            '/placeholder.svg'
                                        }
                                        alt={session?.user?.name}
                                    /> */}
                                    <AvatarFallback className='rounded-lg bg-primary text-primary-foreground'>
                                        {session?.user?.name?.charAt(0) ||
                                            session?.user?.email?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className='grid flex-1 text-left text-xs leading-tight'>
                                    <span className='truncate font-semibold'>
                                        {session?.user?.name}
                                    </span>
                                    <span className='truncate text-xs'>
                                        {session?.user?.email}
                                    </span>
                                </div>
                                <HugeiconsIcon icon={ArrowUpDownIcon} className='ml-auto size-4' />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                            side='bottom'
                            align='end'
                            sideOffset={4}>
                            <DropdownMenuLabel className='p-0 font-normal'>
                                <div className='flex items-center gap-2 px-1 py-1.5 text-left text-xs'>
                                    <Avatar className='h-8 w-8 rounded-lg'>
                                        {/*        <AvatarImage
                                            src={
                                                data.user.avatar ||
                                                '/placeholder-user.jpg'
                                            }
                                            alt={session?.user?.name}
                                        /> */}
                                        <AvatarFallback className='rounded-lg bg-primary text-primary-foreground'>
                                            {session?.user?.name?.charAt(0) ||
                                                session?.user?.email?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className='grid flex-1 text-left text-xs leading-tight'>
                                        <span className='truncate font-semibold'>
                                            {session?.user?.name}
                                        </span>
                                        <span className='truncate text-xs'>
                                            {session?.user?.email}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() =>
                                    signOut({
                                        redirectTo: `/site/${tanentid}/sign-in` })
                                }>
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    );
};

export default SidebarFooterMenu;

