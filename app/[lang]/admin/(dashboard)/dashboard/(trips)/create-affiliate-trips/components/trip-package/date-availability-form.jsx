import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormDatePicker } from '@/components/ui/date-picker';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Cancel01Icon, PlusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import WeekDaySelector from './weekdays-selector';

export function DatesAvailabilityForm() {
    const {
        control,
        setValue,
        getValues,
        watch,
        formState: { errors },
    } = useFormContext();

    // Watch the fixed departure field to conditionally show fields
    const isFixedDeparture = watch('datesAvailability.isFixedDeparture', false);
    // Watch onlyUponRequeste field to conditionally show fields
    const onlyUponRequest = watch('datesAvailability.onlyUponRequest', false);

    // Get initial values from form or use defaults
    const initialDepartureDates = getValues(
        'datesAvailability.departureDates'
    ) || [''];
    const initialDepartureTimes = getValues(
        'datesAvailability.departureTimes'
    ) || ['07:30:00'];
    const initialBlackoutDates =
        getValues('datesAvailability.blackoutDates') || [];

    // State for departure dates, times and blackout dates
    const [departureDates, setDepartureDates] = useState(initialDepartureDates);
    const [departureTimes, setDepartureTimes] = useState(initialDepartureTimes);
    const [blackoutDates, setBlackoutDates] = useState(initialBlackoutDates);

    // When fixed departure changes, ensure at least one date input exists
    useEffect(() => {
        if (isFixedDeparture && departureDates.length === 0) {
            const newDates = [''];
            setDepartureDates(newDates);
            setValue('datesAvailability.departureDates', newDates);
        }
    }, [isFixedDeparture, departureDates.length, setValue]);

    // Add a new departure date input
    const addDepartureDate = () => {
        const newDepartureDates = [...departureDates, ''];
        setDepartureDates(newDepartureDates);
        setValue('datesAvailability.departureDates', newDepartureDates);
    };

    // Remove a departure date input
    const removeDepartureDate = index => {
        const newDepartureDates = [...departureDates];
        newDepartureDates.splice(index, 1);
        setDepartureDates(newDepartureDates);
        setValue('datesAvailability.departureDates', newDepartureDates);
    };

    // Update a departure date
    const updateDepartureDate = (index, value) => {
        const newDepartureDates = [...departureDates];
        newDepartureDates[index] = value;
        setDepartureDates(newDepartureDates);
        setValue('datesAvailability.departureDates', newDepartureDates);
    };

    // Add a new departure time
    const addDepartureTime = () => {
        const newDepartureTimes = [...departureTimes, '07:30:00'];
        setDepartureTimes(newDepartureTimes);
        setValue('datesAvailability.departureTimes', newDepartureTimes);
    };

    // Remove a departure time
    const removeDepartureTime = index => {
        const newDepartureTimes = [...departureTimes];
        newDepartureTimes.splice(index, 1);
        setDepartureTimes(newDepartureTimes);
        setValue('datesAvailability.departureTimes', newDepartureTimes);
    };

    // Update a departure time
    const updateDepartureTime = (index, value) => {
        const newDepartureTimes = [...departureTimes];
        newDepartureTimes[index] = value;
        setDepartureTimes(newDepartureTimes);
        setValue('datesAvailability.departureTimes', newDepartureTimes);
    };

    // Add a new blackout date
    const addBlackoutDate = () => {
        const newBlackoutDates = [...blackoutDates, ''];
        setBlackoutDates(newBlackoutDates);
        setValue('datesAvailability.blackoutDates', newBlackoutDates);
    };

    // Remove a blackout date
    const removeBlackoutDate = index => {
        const newBlackoutDates = [...blackoutDates];
        newBlackoutDates.splice(index, 1);
        setBlackoutDates(newBlackoutDates);
        setValue('datesAvailability.blackoutDates', newBlackoutDates);
    };

    // Update a blackout date
    const updateBlackoutDate = (index, value) => {
        const newBlackoutDates = [...blackoutDates];
        newBlackoutDates[index] = value;
        setBlackoutDates(newBlackoutDates);
        setValue('datesAvailability.blackoutDates', newBlackoutDates);
    };

    // Get nested error messages
    const getDepartureDatesError = () => {
        return errors?.datesAvailability?.departureDates?.message;
    };
    const startingDay = watch('datesAvailability.dateRangeStart');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Dates & Availability</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
                <FormField
                    control={control}
                    name='datesAvailability.onlyUponRequest'
                    render={({ field }) => (
                        <FormItem className='flex flex-row items-center justify-between rounded-lg border border-border p-4'>
                            <div className='space-y-0.5'>
                                <FormLabel className='text-base'>
                                    Only Upon Request
                                </FormLabel>
                                <FormDescription>
                                    Enable if the tour only runs only upon
                                    request
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {!onlyUponRequest && (
                    <FormField
                        control={control}
                        name='datesAvailability.isFixedDeparture'
                        render={({ field }) => (
                            <FormItem className='flex flex-row items-center justify-between rounded-lg border border-border p-4'>
                                <div className='space-y-0.5'>
                                    <FormLabel className='text-base'>
                                        Fixed Departure Dates
                                    </FormLabel>
                                    <FormDescription>
                                        Enable if the tour only runs on specific
                                        dates
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                )}
                {isFixedDeparture ? (
                    <div className='space-y-4'>
                        <div className='flex justify-between items-center'>
                            <FormLabel className='text-base'>
                                Departure Dates{' '}
                                <span className='text-destructive'>*</span>
                            </FormLabel>
                            <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                onClick={addDepartureDate}>
                                <HugeiconsIcon
                                    icon={PlusSignIcon}
                                    className='h-4 w-4 mr-2'
                                />
                                Add Date
                            </Button>
                        </div>

                        {departureDates.map((date, index) => (
                            <div
                                key={index}
                                className='flex items-center gap-2'>
                                <FormDatePicker
                                    disablePastDates={true}
                                    disabledDates={departureDates}
                                    value={date}
                                    onChange={value =>
                                        updateDepartureDate(index, value)
                                    }
                                    placeholder='Select departure date'
                                    className='flex-1 min-w-xs'
                                />

                                {departureDates.length > 1 && (
                                    <Button
                                        type='button'
                                        variant='ghost'
                                        size='icon'
                                        onClick={() =>
                                            removeDepartureDate(index)
                                        }>
                                        <HugeiconsIcon
                                            icon={Cancel01Icon}
                                            className='h-4 w-4'
                                        />
                                    </Button>
                                )}
                            </div>
                        ))}

                        {getDepartureDatesError() && (
                            <div className='text-sm font-medium text-destructive'>
                                {getDepartureDatesError()}
                            </div>
                        )}
                    </div>
                ) : !onlyUponRequest ? (
                    <div className='space-y-6'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <FormField
                                control={control}
                                name='datesAvailability.dateRangeStart'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Available From{' '}
                                            <span className='text-destructive'>
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <FormDatePicker
                                                disablePastDates={true}
                                                {...field}
                                                placeholder='Select start date'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name='datesAvailability.dateRangeEnd'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Available Until</FormLabel>
                                        <FormControl>
                                            <FormDatePicker
                                                minDate={new Date(startingDay)}
                                                {...field}
                                                placeholder='Select end date'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={control}
                            name='datesAvailability.daysOfTheWeek'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Days of the Week</FormLabel>
                                    <FormControl>
                                        <WeekDaySelector
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='space-y-4'>
                            <div className='flex justify-between items-center'>
                                <FormLabel className='text-base'>
                                    Departure Times
                                </FormLabel>
                                <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={addDepartureTime}>
                                    <HugeiconsIcon
                                        icon={PlusSignIcon}
                                        className='h-4 w-4 mr-2'
                                    />
                                    Add Time Slot
                                </Button>
                            </div>

                            {departureTimes.map((time, index) => (
                                <div
                                    key={index}
                                    className='flex items-center gap-2'>
                                    <Input
                                        type='time'
                                        step='1'
                                        value={time}
                                        onChange={e =>
                                            updateDepartureTime(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        placeholder='Select departure time'
                                        className='flex flex-col max-w-xs bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
                                    />

                                    {departureTimes.length > 1 && (
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='icon'
                                            onClick={() =>
                                                removeDepartureTime(index)
                                            }>
                                            <HugeiconsIcon
                                                icon={Cancel01Icon}
                                                className='h-4 w-4'
                                            />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className='space-y-4'>
                            <div className='flex justify-between items-center'>
                                <FormLabel className='text-base'>
                                    Blackout Dates
                                </FormLabel>
                                <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={addBlackoutDate}>
                                    <HugeiconsIcon
                                        icon={PlusSignIcon}
                                        className='h-4 w-4 mr-2'
                                    />
                                    Add Blackout Date
                                </Button>
                            </div>

                            {blackoutDates.map((date, index) => (
                                <div
                                    key={index}
                                    className='flex items-center gap-2'>
                                    <FormDatePicker
                                        value={date}
                                        disablePastDates={true}
                                        disabledDates={[
                                            ...blackoutDates,
                                            startingDay,
                                        ]}
                                        onChange={value =>
                                            updateBlackoutDate(index, value)
                                        }
                                        placeholder='Select blackout date'
                                        className='flex-1'
                                    />
                                    <Button
                                        type='button'
                                        variant='ghost'
                                        size='icon'
                                        onClick={() =>
                                            removeBlackoutDate(index)
                                        }>
                                        <HugeiconsIcon
                                            icon={Cancel01Icon}
                                            className='h-4 w-4'
                                        />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    ''
                )}
                {/*    {!onlyUponRequest && (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <FormField
                            control={control}
                            name='datesAvailability.minAdvanceBooking'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Min. Days for Advance Booking
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            min={0}
                                            placeholder='e.g. 30'
                                            {...field}
                                            value={field.value || ''}
                                            onChange={e =>
                                                field.onChange(
                                                    e.target.value === ''
                                                        ? undefined
                                                        : parseInt(
                                                              e.target.value,
                                                              10
                                                          )
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        How many days in advance must customers
                                        book?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name='datesAvailability.maxLastMinute'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Max. Days for Last-Minute Booking
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            min={0}
                                            placeholder='e.g. 3'
                                            {...field}
                                            value={field.value || ''}
                                            onChange={e =>
                                                field.onChange(
                                                    e.target.value === ''
                                                        ? undefined
                                                        : parseInt(
                                                              e.target.value,
                                                              10
                                                          )
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        How close to departure can customers
                                        book?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )} */}
            </CardContent>
        </Card>
    );
}

