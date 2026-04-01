import { Button } from '@/components/ui/button';
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Check, ChevronsUpDown, Eye, X } from 'lucide-react';

export const GuideActionButton = ({
    guide,
    isAssigned,
    isAssignedToOtherTrips,
    onAssign,
    onRemove,
    onViewProfile,
    onStatusChange }) => {
    // Determine if the guide can be assigned to this trip
    const canBeAssigned =
        guide.status === 'AVAILABLE' && !isAssigned && !isAssignedToOtherTrips;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    size='sm'
                    className='h-8 px-2 border-dashed'>
                    <span className='flex items-center gap-1'>
                        Actions{' '}
                        <ChevronsUpDown className='h-3.5 w-3.5 opacity-70' />
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-56 p-0' align='end'>
                <Command>
                    <CommandList>
                        <CommandGroup heading='Guide Actions'>
                            {guide.status === 'AVAILABLE' &&
                                !isAssigned &&
                                (isAssignedToOtherTrips ? (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className='px-2 py-1.5 text-sm text-gray-700 flex items-center gap-2 opacity-60 cursor-not-allowed'>
                                                    <Check className='h-4 w-4' />
                                                    <span>
                                                        Assign to this trip
                                                    </span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side='right'>
                                                <p className='text-sm max-w-[200px]'>
                                                    This guide is already
                                                    assigned to other trips and
                                                    cannot be assigned to this
                                                    trip.
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ) : (
                                    <CommandItem
                                        onSelect={() => onAssign(guide)}
                                        className='flex gap-2 items-center cursor-pointer'>
                                        <Check className='h-4 w-4' />
                                        <span>Assign to this trip</span>
                                    </CommandItem>
                                ))}

                            {isAssigned && (
                                <CommandItem
                                    onSelect={() => onRemove(guide.id)}
                                    className='flex gap-2 items-center cursor-pointer'>
                                    <X className='h-4 w-4' />
                                    <span>Remove from trip</span>
                                </CommandItem>
                            )}

                            <CommandItem
                                onSelect={() => onViewProfile(guide.id)}
                                className='flex gap-2 items-center cursor-pointer'>
                                <Eye className='h-4 w-4' />
                                <span>View profile</span>
                            </CommandItem>
                        </CommandGroup>

                        <CommandGroup heading='Update Status'>
                            {guide.status !== 'ON_LEAVE' && (
                                <CommandItem
                                    onSelect={() =>
                                        onStatusChange(guide.id, 'ON_LEAVE')
                                    }
                                    className='flex gap-2 items-center cursor-pointer text-yellow-600'>
                                    <span>Mark as on leave</span>
                                </CommandItem>
                            )}

                            {guide.status !== 'BLACKLISTED' && (
                                <CommandItem
                                    onSelect={() =>
                                        onStatusChange(guide.id, 'BLACKLISTED')
                                    }
                                    className='flex gap-2 items-center cursor-pointer text-red-600'>
                                    <span>Blacklist guide</span>
                                </CommandItem>
                            )}

                            {(guide.status === 'ON_LEAVE' ||
                                guide.status === 'BLACKLISTED') && (
                                <CommandItem
                                    onSelect={() =>
                                        onStatusChange(guide.id, 'AVAILABLE')
                                    }
                                    className='flex gap-2 items-center cursor-pointer text-green-600'>
                                    <span>Mark as available</span>
                                </CommandItem>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

