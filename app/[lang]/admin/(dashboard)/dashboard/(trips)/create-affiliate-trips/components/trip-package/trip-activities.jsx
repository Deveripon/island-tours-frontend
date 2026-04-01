import { Permission } from '@/RBAC.config';
import { getAllActivityOfTenant } from '@/app/_actions/trips/activityActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRolePermission } from '@/hooks/useRolePermission';
import {
    ArrowDown01Icon,
    ArrowUp01Icon,
    InformationCircleIcon,
    Location01Icon,
    PlusSignIcon,
    Time01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import AddMoreButton from '../../../../components/common/add-more-button';

export function TripActivities() {
    const [activities, setActivities] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const hasCreatePermission = useRolePermission(Permission.CREATE_CATEGORY);

    const { control, watch } = useFormContext();
    const { tenant } = useParams();
    const locationId = watch('destinationId');

    useEffect(() => {
        if (tenant && locationId) {
            async function getActivities() {
                setLoading(true);
                try {
                    const res = await getAllActivityOfTenant(
                        tenant,
                        `limit=100&locationId=${locationId}`
                    );
                    if (res?.success) {
                        setActivities(res?.data || []);
                    }
                } catch (error) {
                    console.error('Error fetching activities:', error);
                } finally {
                    setLoading(false);
                }
            }
            getActivities();
        } else {
            setActivities([]);
        }
    }, [locationId, tenant]);

    const handleAddActivity = () => {
        window.location.href = `/${tenant}/dashboard/activities?open=true`;
    };

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <Card className='p-0'>
                <CollapsibleTrigger asChild>
                    <div className='flex cursor-pointer p-5 hover:bg-muted/50 transition-colors items-center justify-between'>
                        <CardTitle className='flex items-center gap-2'>
                            Select Trip Activities
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HugeiconsIcon
                                        icon={InformationCircleIcon}
                                        className='h-4 w-4 text-muted-foreground'
                                    />
                                </TooltipTrigger>
                                <TooltipContent className='max-w-xs bg-gray-900 text-white'>
                                    <p>
                                        Only available activities based on the
                                        location/destination of this trip
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </CardTitle>

                        <div className='flex items-center gap-2'>
                            {hasCreatePermission && (
                                <AddMoreButton
                                    text=''
                                    ButtonText='Add More Activities for This Trip'
                                    goToUrl={`/${tenant}/dashboard/activities?open=true`}
                                    className='p-0 border-0 place-content-end'
                                />
                            )}
                            {isOpen ? (
                                <HugeiconsIcon
                                    icon={ArrowUp01Icon}
                                    className='h-4 w-4 text-muted-foreground'
                                />
                            ) : (
                                <HugeiconsIcon
                                    icon={ArrowDown01Icon}
                                    className='h-4 w-4 text-muted-foreground'
                                />
                            )}
                        </div>
                    </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <CardContent className='space-y-6 pb-6'>
                        {loading ? (
                            <div className='text-center'>
                                <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]' />
                                <p className='mt-2 text-muted-foreground'>
                                    Loading...
                                </p>
                            </div>
                        ) : activities.length === 0 ? (
                            <div className='flex flex-col items-center justify-center py-12 px-4 bg-muted/30 rounded-lg border-2 border-dashed border-border'>
                                <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4'>
                                    <HugeiconsIcon
                                        icon={Location01Icon}
                                        className='h-8 w-8 text-muted-foreground'
                                    />
                                </div>
                                <h3 className='text-lg font-semibold text-foreground mb-2'>
                                    No Activities Available
                                </h3>
                                <p className='text-sm text-muted-foreground text-center mb-6 max-w-md'>
                                    {locationId
                                        ? 'There are currently no activities available for the selected destination. Create new activities to enhance this trip experience.'
                                        : 'Please select a destination first to see available activities for your trip.'}
                                </p>
                                {hasCreatePermission && locationId && (
                                    <Button
                                        type='button'
                                        onClick={handleAddActivity}
                                        className='gap-2'>
                                        <HugeiconsIcon
                                            icon={PlusSignIcon}
                                            className='h-4 w-4'
                                        />
                                        Add New Activity
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className='flex items-center justify-between mb-4'>
                                    <p className='text-sm text-muted-foreground'>
                                        {activities.length}{' '}
                                        {activities.length === 1
                                            ? 'activity'
                                            : 'activities'}{' '}
                                        available
                                    </p>
                                </div>

                                <FormField
                                    control={control}
                                    name='activities'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                                                    {activities.map(
                                                        activity => (
                                                            <ActivityCard
                                                                key={
                                                                    activity.id
                                                                }
                                                                activity={
                                                                    activity
                                                                }
                                                                isSelected={field.value?.includes(
                                                                    activity.id
                                                                )}
                                                                onToggle={checked => {
                                                                    const currentValue =
                                                                        field.value ||
                                                                        [];
                                                                    if (
                                                                        checked
                                                                    ) {
                                                                        field.onChange(
                                                                            [
                                                                                ...currentValue,
                                                                                activity.id,
                                                                            ]
                                                                        );
                                                                    } else {
                                                                        field.onChange(
                                                                            currentValue.filter(
                                                                                id =>
                                                                                    id !==
                                                                                    activity.id
                                                                            )
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}

function ActivityCard({ activity, isSelected, onToggle }) {
    const handleCardClick = e => {
        // Only toggle if not clicking on the checkbox itself
        if (e.target.closest('[role="checkbox"]')) {
            return;
        }
        onToggle(!isSelected);
    };

    return (
        <div className='relative cursor-pointer' onClick={handleCardClick}>
            <div
                className='absolute top-3 right-3 z-10'
                onClick={e => e.stopPropagation()}>
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={onToggle}
                    className='bg-background border-2 shadow-lg h-5 w-5 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground'
                />
            </div>

            <Card
                className={`overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group ${
                    isSelected ? 'ring-2 ring-primary' : ''
                }`}>
                <div className='relative h-[200px]'>
                    <Image
                        fill
                        src={activity.images?.[0]?.url || '/placeholder.jpg'}
                        alt={activity.name}
                        className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent' />
                    <div className='absolute inset-0 flex flex-col items-center justify-center px-4'>
                        <h3 className='text-xl font-dm-sans md:text-2xl font-normal mb-2 drop-shadow-lg text-white text-center'>
                            {activity.name}
                        </h3>
                        <div className='flex flex-wrap items-center justify-center gap-3 text-white text-xs md:text-sm'>
                            <span className='flex items-center gap-1'>
                                <HugeiconsIcon
                                    icon={Location01Icon}
                                    className='w-3 h-3'
                                />
                                {activity.location?.city ||
                                    activity.location?.name}
                            </span>
                            {activity.duration && (
                                <span className='flex items-center gap-1'>
                                    <HugeiconsIcon
                                        icon={Time01Icon}
                                        className='w-3 h-3'
                                    />
                                    {activity.duration}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

