import ProfileDropdown from '@/app/[lang]/admin/(dashboard)/dashboard/components/user-profile-dropdown';
import WeatherSlide from '@/app/[lang]/admin/(dashboard)/dashboard/components/weather-slider';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Notification01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import LanguageSwitcher from './language-switcher';
import { ModeToggle } from './theme-switcher';

export function SiteHeader({ preferences, loggedInUser }) {
    return (
        <header
            className='flex h-[70px] bg-white    dark:bg-sidebar shadow-none
            shrink-0 items-center gap-2  transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[70px]'>
            <div className='flex flex-1 items-center justify-between gap-1 px-2 md:px-4'>
                <div className='flex items-center gap-1'>
                    <SidebarTrigger className='-ml-1' />
                    <Separator
                        orientation='vertical'
                        className='mx-2 data-[orientation=vertical]:h-4'
                    />
                    <div className='w-28 sm:w-56 overflow-hidden transition-all duration-300'>
                        <WeatherSlide
                            loggedInUser={loggedInUser}
                        />
                    </div>
                </div>

                <div className='flex items-center gap-2 md:gap-4'>
                    <ModeToggle />
                    <HugeiconsIcon
                        className='cursor-pointer'
                        icon={Notification01Icon}
                    />
                    <LanguageSwitcher />

                    <ProfileDropdown
                        className='items-end'
                        loggedInUser={loggedInUser}
                    />
                </div>
            </div>
        </header>
    );
}
