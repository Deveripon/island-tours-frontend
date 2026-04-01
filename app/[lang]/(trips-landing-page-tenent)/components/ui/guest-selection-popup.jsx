import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { UserGroupIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const GuestSelecetionPopup = ({
    guests,
    setGuests,
    className,
    content = {} }) => {
    // Check if liquid-glass class is present
    const isLiquidGlass = className?.includes('liquid-glass');

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    className={cn(
                        'justify-start h-10 text-left font-normal border shadow',
                        isLiquidGlass
                            ? 'border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white/20'
                            : 'border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700',
                        className
                    )}>
                    <HugeiconsIcon icon={UserGroupIcon} className={cn(
                            'mr-2 h-4 w-4',
                            isLiquidGlass
                                ? 'text-white/80'
                                : 'dark:text-gray-400'
                        )} />
                    {guests.adults + guests.children}{' '}
                    {content?.guest || 'Guest'}
                    {guests.adults + guests.children !== 1 ? 's' : ''}
                    {guests.infants > 0 &&
                        `, ${guests.infants} Infant${
                            guests.infants !== 1 ? 's' : ''
                        }`}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className={cn(
                    'w-80',
                    isLiquidGlass
                        ? 'bg-white/10 backdrop-blur-md border-white/20 text-white'
                        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                )}>
                <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p
                                className={cn(
                                    'font-medium',
                                    isLiquidGlass
                                        ? 'text-white'
                                        : 'text-gray-900 dark:text-gray-100'
                                )}>
                                {content?.adult || 'Adults'}
                            </p>
                            <p
                                className={cn(
                                    'text-sm',
                                    isLiquidGlass
                                        ? 'text-white/70'
                                        : 'text-gray-700 dark:text-gray-400'
                                )}>
                                {content?.age || 'Age'} 13+
                            </p>
                        </div>
                        <div className='flex items-center space-x-3'>
                            <Button
                                variant='outline'
                                size='icon'
                                className={cn(
                                    isLiquidGlass
                                        ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                                        : 'dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                )}
                                onClick={() =>
                                    setGuests({
                                        ...guests,
                                        adults: Math.max(1, guests.adults - 1) })
                                }>
                                -
                            </Button>
                            <span
                                className={cn(
                                    isLiquidGlass
                                        ? 'text-white'
                                        : 'text-gray-900 dark:text-gray-100'
                                )}>
                                {guests.adults}
                            </span>
                            <Button
                                variant='outline'
                                size='icon'
                                className={cn(
                                    isLiquidGlass
                                        ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                                        : 'dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                )}
                                onClick={() =>
                                    setGuests({
                                        ...guests,
                                        adults: guests.adults + 1 })
                                }>
                                +
                            </Button>
                        </div>
                    </div>

                    <div className='flex items-center justify-between'>
                        <div>
                            <p
                                className={cn(
                                    'font-medium',
                                    isLiquidGlass
                                        ? 'text-white'
                                        : 'text-gray-900 dark:text-gray-100'
                                )}>
                                {content?.children || 'Children'}
                            </p>
                            <p
                                className={cn(
                                    'text-sm',
                                    isLiquidGlass
                                        ? 'text-white/70'
                                        : 'text-gray-700 dark:text-gray-400'
                                )}>
                                {content?.ages || 'Ages'} 2-12
                            </p>
                        </div>
                        <div className='flex items-center space-x-3'>
                            <Button
                                variant='outline'
                                size='icon'
                                className={cn(
                                    isLiquidGlass
                                        ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                                        : 'dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                )}
                                onClick={() =>
                                    setGuests({
                                        ...guests,
                                        children: Math.max(
                                            0,
                                            guests.children - 1
                                        ) })
                                }>
                                -
                            </Button>
                            <span
                                className={cn(
                                    isLiquidGlass
                                        ? 'text-white'
                                        : 'text-gray-900 dark:text-gray-100'
                                )}>
                                {guests.children}
                            </span>
                            <Button
                                variant='outline'
                                size='icon'
                                className={cn(
                                    isLiquidGlass
                                        ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                                        : 'dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                )}
                                onClick={() =>
                                    setGuests({
                                        ...guests,
                                        children: guests.children + 1 })
                                }>
                                +
                            </Button>
                        </div>
                    </div>

                    <div className='flex items-center justify-between'>
                        <div>
                            <p
                                className={cn(
                                    'font-medium',
                                    isLiquidGlass
                                        ? 'text-white'
                                        : 'text-gray-900 dark:text-gray-100'
                                )}>
                                {content?.infant || 'Infants'}
                            </p>
                            <p
                                className={cn(
                                    'text-sm',
                                    isLiquidGlass
                                        ? 'text-white/70'
                                        : 'text-gray-700 dark:text-gray-400'
                                )}>
                                {content?.under || 'Under'} 2
                            </p>
                        </div>
                        <div className='flex items-center space-x-3'>
                            <Button
                                variant='outline'
                                size='icon'
                                className={cn(
                                    isLiquidGlass
                                        ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                                        : 'dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                )}
                                onClick={() =>
                                    setGuests({
                                        ...guests,
                                        infants: Math.max(
                                            0,
                                            guests.infants - 1
                                        ) })
                                }>
                                -
                            </Button>
                            <span
                                className={cn(
                                    isLiquidGlass
                                        ? 'text-white'
                                        : 'text-gray-900 dark:text-gray-100'
                                )}>
                                {guests.infants}
                            </span>
                            <Button
                                variant='outline'
                                size='icon'
                                className={cn(
                                    isLiquidGlass
                                        ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                                        : 'dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                )}
                                onClick={() =>
                                    setGuests({
                                        ...guests,
                                        infants: guests.infants + 1 })
                                }>
                                +
                            </Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default GuestSelecetionPopup;

