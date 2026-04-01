import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { FormDatePicker } from '@/components/ui/date-picker';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

// Special Event Surcharges Component
function SpecialEventSurcharges() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'pricingConfig.specialEventSurcharges' });

    // Add state to track open/closed state of each event
    const [openStates, setOpenStates] = useState([]);

    // Function to toggle a specific event's open state
    const toggleOpen = index => {
        setOpenStates(prev => {
            const newState = [...prev];
            newState[index] = !newState[index];
            return newState;
        });
    };

    return (
        <div className='rounded-md border p-4'>
            <div className='flex justify-between items-center mb-4'>
                <h3 className='text-sm font-medium'>
                    Special Event Surcharges
                </h3>
                <Button
                    type='button'
                    onClick={() => {
                        append({
                            eventName: '',
                            startDate: '',
                            endDate: '',
                            discountType: 'PERCENTAGE',
                            discountValue: 10 });
                        setOpenStates(prev => [...prev, true]); // Open the new event by default
                    }}
                    size='sm'
                    variant='outline'>
                    <Plus className='h-4 w-4 mr-2' />
                    Add Event Surcharge
                </Button>
            </div>

            {fields.length > 0 ? (
                <div className='space-y-4'>
                    {fields.map((field, index) => (
                        <Collapsible
                            key={field.id}
                            open={openStates[index]}
                            onOpenChange={() => toggleOpen(index)}
                            className='border rounded-md overflow-visible'>
                            <CollapsibleTrigger asChild>
                                <div className='w-full bg-slate-50 p-3 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors'>
                                    <h3 className='font-medium text-slate-800 flex items-center'>
                                        <span className='flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-primary/20 text-primary font-semibold text-sm'>
                                            {index + 1}
                                        </span>
                                        {field.eventName ||
                                            `Event ${index + 1}`}
                                    </h3>
                                    <div className='flex justify-center items-center'>
                                        {openStates[index] ? (
                                            <ChevronDown className='w-4 h-4 text-slate-500' />
                                        ) : (
                                            <ChevronUp className='w-4 h-4 text-slate-500' />
                                        )}
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='sm'
                                            onClick={e => {
                                                e.stopPropagation();
                                                remove(index);
                                                setOpenStates(prev =>
                                                    prev.filter(
                                                        (_, i) => i !== index
                                                    )
                                                );
                                            }}
                                            className='h-6 w-6 p-0 ml-2 rounded-full text-slate-500 hover:text-red-500 hover:bg-red-50'>
                                            <Trash2 className='h-4 w-4' />
                                        </Button>
                                    </div>
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className='p-3 space-y-4 bg-background'>
                                    <FormField
                                        control={control}
                                        name={`pricingConfig.specialEventSurcharges.${index}.eventName`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Event Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. New Year's Eve, Festival"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        <FormField
                                            control={control}
                                            name={`pricingConfig.specialEventSurcharges.${index}.startDate`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Start Date
                                                    </FormLabel>
                                                    <FormControl>
                                                        <FormDatePicker
                                                            disablePastDates={
                                                                true
                                                            }
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
                                            name={`pricingConfig.specialEventSurcharges.${index}.endDate`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        End Date
                                                    </FormLabel>
                                                    <FormControl>
                                                        <FormDatePicker
                                                            disablePastDates={
                                                                true
                                                            }
                                                            {...field}
                                                            placeholder='Select end date'
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        <FormField
                                            control={control}
                                            name={`pricingConfig.specialEventSurcharges.${index}.discountType`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Adjustment Type
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Select type' />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value='PERCENTAGE'>
                                                                Percentage
                                                            </SelectItem>
                                                            <SelectItem value='FIXED'>
                                                                Fixed Amount
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={control}
                                            name={`pricingConfig.specialEventSurcharges.${index}.discountValue`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Adjustment Value
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='number'
                                                            min={0}
                                                            {...field}
                                                            onChange={e =>
                                                                field.onChange(
                                                                    parseFloat(
                                                                        e.target
                                                                            .value
                                                                    ) || 0
                                                                )
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </div>
            ) : (
                <div className='text-center p-4 border border-dashed rounded-md'>
                    <p className='text-gray-700 text-sm'>
                        No special event surcharges added yet.
                    </p>
                    <Button
                        type='button'
                        onClick={() => {
                            append({
                                eventName: '',
                                startDate: '',
                                endDate: '',
                                discountType: 'PERCENTAGE',
                                discountValue: 10 });
                            setOpenStates(prev => [...prev, true]); // Open the new event by default
                        }}
                        variant='outline'
                        className='mt-2'
                        size='sm'>
                        <Plus className='h-4 w-4 mr-2' />
                        Add Event Surcharge
                    </Button>
                </div>
            )}
        </div>
    );
}

// Holiday Surcharges Component
function HolidaySurcharges() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'pricingConfig.holidaySurcharges' });

    // Add state to track open/closed state of each holiday
    const [openStates, setOpenStates] = useState([]);

    // Function to toggle a specific holiday's open state
    const toggleOpen = index => {
        setOpenStates(prev => {
            const newState = [...prev];
            newState[index] = !newState[index];
            return newState;
        });
    };

    return (
        <div className='rounded-md border p-4'>
            <div className='flex justify-between items-center mb-4'>
                <h3 className='text-sm font-medium'>Holiday Surcharges</h3>
                <Button
                    type='button'
                    onClick={() => {
                        append({
                            holidayName: '',
                            date: '',
                            discountType: 'PERCENTAGE',
                            discountValue: 15 });
                        setOpenStates(prev => [...prev, true]); // Open the new holiday by default
                    }}
                    size='sm'
                    variant='outline'>
                    <Plus className='h-4 w-4 mr-2' />
                    Add Holiday Surcharge
                </Button>
            </div>

            {fields.length > 0 ? (
                <div className='space-y-4'>
                    {fields.map((field, index) => (
                        <Collapsible
                            key={field.id}
                            open={openStates[index]}
                            onOpenChange={() => toggleOpen(index)}
                            className='border rounded-md overflow-visible'>
                            <CollapsibleTrigger asChild>
                                <div className='w-full bg-slate-50 p-3 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors'>
                                    <h3 className='font-medium text-slate-800 flex items-center'>
                                        <span className='flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-primary/20 text-primary font-semibold text-sm'>
                                            {index + 1}
                                        </span>
                                        {field.holidayName ||
                                            `Holiday ${index + 1}`}
                                    </h3>
                                    <div className='flex justify-center items-center'>
                                        {openStates[index] ? (
                                            <ChevronDown className='w-4 h-4 text-slate-500' />
                                        ) : (
                                            <ChevronUp className='w-4 h-4 text-slate-500' />
                                        )}
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='sm'
                                            onClick={e => {
                                                e.stopPropagation();
                                                remove(index);
                                                setOpenStates(prev =>
                                                    prev.filter(
                                                        (_, i) => i !== index
                                                    )
                                                );
                                            }}
                                            className='h-6 w-6 p-0 ml-2 rounded-full text-slate-500 hover:text-red-500 hover:bg-red-50'>
                                            <Trash2 className='h-4 w-4' />
                                        </Button>
                                    </div>
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className='p-3 space-y-4 bg-background'>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <FormField
                                            control={control}
                                            name={`pricingConfig.holidaySurcharges.${index}.holidayName`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Holiday Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder='e.g. Christmas, Thanksgiving'
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={control}
                                            name={`pricingConfig.holidaySurcharges.${index}.date`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Date</FormLabel>
                                                    <FormControl>
                                                        <FormDatePicker
                                                            disablePastDates={
                                                                true
                                                            }
                                                            {...field}
                                                            placeholder='Select date'
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <FormField
                                            control={control}
                                            name={`pricingConfig.holidaySurcharges.${index}.discountType`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Adjustment Type
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Select type' />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value='PERCENTAGE'>
                                                                Percentage
                                                            </SelectItem>
                                                            <SelectItem value='FIXED'>
                                                                Fixed Amount
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={control}
                                            name={`pricingConfig.holidaySurcharges.${index}.discountValue`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Adjustment Value
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='number'
                                                            min={0}
                                                            {...field}
                                                            onChange={e =>
                                                                field.onChange(
                                                                    parseFloat(
                                                                        e.target
                                                                            .value
                                                                    ) || 0
                                                                )
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </div>
            ) : (
                <div className='text-center p-4 border border-dashed rounded-md'>
                    <p className='text-gray-700 text-sm'>
                        No holiday surcharges added yet.
                    </p>
                    <Button
                        type='button'
                        onClick={() => {
                            append({
                                holidayName: '',
                                date: '',
                                discountType: 'PERCENTAGE',
                                discountValue: 15 });
                            setOpenStates(prev => [...prev, true]); // Open the new holiday by default
                        }}
                        variant='outline'
                        className='mt-2'
                        size='sm'>
                        <Plus className='h-4 w-4 mr-2' />
                        Add Holiday Surcharge
                    </Button>
                </div>
            )}
        </div>
    );
}

export function SeasonalPricing() {
    return (
        <div className='space-y-6'>
            <SpecialEventSurcharges />
            <HolidaySurcharges />
        </div>
    );
}

