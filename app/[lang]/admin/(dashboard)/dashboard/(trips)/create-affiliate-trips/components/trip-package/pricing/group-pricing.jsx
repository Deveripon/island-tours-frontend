import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    FormControl,
    FormDescription,
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
import { Switch } from '@/components/ui/switch';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

// Group Discounts Component
function GroupDiscounts() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'pricingConfig.groupDiscounts' });

    return (
        <div className='rounded-md border p-4'>
            <div className='flex justify-between items-center mb-4'>
                <h3 className='text-sm font-medium'>Volume Discounts</h3>
                <Button
                    type='button'
                    onClick={() =>
                        append({
                            minGroupSize: 8,
                            discountType: 'PERCENTAGE',
                            discountValue: 5 })
                    }
                    size='sm'
                    variant='outline'>
                    <Plus className='h-4 w-4 mr-2' />
                    Add Discount Tier
                </Button>
            </div>

            {fields.length > 0 ? (
                <div className='space-y-4'>
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className='grid grid-cols-1 lg:grid-cols-3 gap-6 border rounded-md p-3 relative'>
                            <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => remove(index)}
                                className='h-6 w-6 p-0 absolute top-2 right-2'>
                                <Trash2 className='h-4 w-4 text-gray-700' />
                            </Button>

                            <FormField
                                control={control}
                                name={`pricingConfig.groupDiscounts.${index}.minGroupSize`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Minimum Group Size
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                min={2}
                                                {...field}
                                                onChange={e =>
                                                    field.onChange(
                                                        parseInt(
                                                            e.target.value,
                                                            10
                                                        ) || 2
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            E.g., 8+ people, 12+ people
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name={`pricingConfig.groupDiscounts.${index}.discountType`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discount Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}>
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
                                name={`pricingConfig.groupDiscounts.${index}.discountValue`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discount Value</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                min={0}
                                                {...field}
                                                onChange={e =>
                                                    field.onChange(
                                                        parseFloat(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            E.g., 5%, 10%, 15%
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className='text-center p-4 border border-dashed rounded-md'>
                    <p className='text-gray-700 text-sm'>
                        No group discounts added yet. Add volume discounts like
                        5% off for groups of 8+.
                    </p>
                    <Button
                        type='button'
                        onClick={() =>
                            append({
                                minGroupSize: 8,
                                discountType: 'PERCENTAGE',
                                discountValue: 5 })
                        }
                        variant='outline'
                        className='mt-2'
                        size='sm'>
                        <Plus className='h-4 w-4 mr-2' />
                        Add Discount Tier
                    </Button>
                </div>
            )}
        </div>
    );
}

// Complimentary Policies Component
function ComplimentaryPolicies() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'pricingConfig.complimentaryPolicies' });

    return (
        <div className='rounded-md border p-4'>
            <div className='flex justify-between items-center mb-4'>
                <h3 className='text-sm font-medium'>Complimentary Spots</h3>
                <Button
                    type='button'
                    onClick={() =>
                        append({
                            thresholdGroupSize: 15,
                            complimentarySpots: 1 })
                    }
                    size='sm'
                    variant='outline'>
                    <Plus className='h-4 w-4 mr-2' />
                    Add Policy
                </Button>
            </div>

            {fields.length > 0 ? (
                <div className='space-y-4'>
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className='grid grid-cols-1 lg:grid-cols-2 gap-6 border rounded-md p-3 relative'>
                            <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => remove(index)}
                                className='h-6 w-6 p-0 absolute top-2 right-2'>
                                <Trash2 className='h-4 w-4 text-gray-700' />
                            </Button>

                            <FormField
                                control={control}
                                name={`pricingConfig.complimentaryPolicies.${index}.thresholdGroupSize`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Threshold Group Size
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                min={2}
                                                {...field}
                                                onChange={e =>
                                                    field.onChange(
                                                        parseInt(
                                                            e.target.value,
                                                            10
                                                        ) || 2
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            E.g., 15 paid guests = 1 free spot
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name={`pricingConfig.complimentaryPolicies.${index}.complimentarySpots`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Complimentary Spots
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                min={1}
                                                {...field}
                                                onChange={e =>
                                                    field.onChange(
                                                        parseInt(
                                                            e.target.value,
                                                            10
                                                        ) || 1
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Number of free spots given
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className='text-center p-4 border border-dashed rounded-md'>
                    <p className='text-gray-700 text-sm'>
                        No complimentary policies added yet. Example: 1 free for
                        every 15 paid guests.
                    </p>
                    <Button
                        type='button'
                        onClick={() =>
                            append({
                                thresholdGroupSize: 15,
                                complimentarySpots: 1 })
                        }
                        variant='outline'
                        className='mt-2'
                        size='sm'>
                        <Plus className='h-4 w-4 mr-2' />
                        Add Policy
                    </Button>
                </div>
            )}
        </div>
    );
}

// Corporate Rates Component
function CorporateRates() {
    const { control } = useFormContext();
    const isEnabled = useWatch({
        control,
        name: 'pricingConfig.corporateRates.isEnabled' });

    return (
        <div className='rounded-md border p-4'>
            <div className='flex justify-between items-center mb-4'>
                <h3 className='text-sm font-medium'>Corporate Rates</h3>
                <FormField
                    control={control}
                    name='pricingConfig.corporateRates.isEnabled'
                    render={({ field }) => (
                        <FormItem className='flex items-center space-x-2'>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>

            {isEnabled && (
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    <FormField
                        control={control}
                        name='pricingConfig.corporateRates.discountType'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Discount Type</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}>
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
                        name='pricingConfig.corporateRates.discountValue'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Discount Value</FormLabel>
                                <FormControl>
                                    <Input
                                        type='number'
                                        min={0}
                                        {...field}
                                        onChange={e =>
                                            field.onChange(
                                                parseFloat(e.target.value) || 0
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormDescription>
                                    Standard corporate discount
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            )}
        </div>
    );
}

// Family Packages Component
function FamilyPackages() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'pricingConfig.familyPackages' });

    // Add state to track open/closed state of each package
    const [openStates, setOpenStates] = useState([]);

    // Function to toggle a specific package's open state
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
                <h3 className='text-sm font-medium'>Family Packages</h3>
                <Button
                    type='button'
                    onClick={() => {
                        append({
                            description: 'Standard Family Package',
                            adultCount: 2,
                            childCount: 2,
                            discount: 10 });
                        setOpenStates(prev => [...prev, true]); // Open the new package by default
                    }}
                    size='sm'
                    variant='outline'>
                    <Plus className='h-4 w-4 mr-2' />
                    Add Family Package
                </Button>
            </div>

            {fields.length > 0 ? (
                <div className='space-y-4'>
                    {fields.map((field, index) => (
                        <Collapsible
                            key={field.id}
                            open={openStates[index]}
                            onOpenChange={() => toggleOpen(index)}
                            className='border rounded-md overflow-hidden'>
                            <CollapsibleTrigger asChild>
                                <div className='w-full bg-slate-50 p-3 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors'>
                                    <h3 className='font-medium text-slate-800 flex items-center'>
                                        <span className='flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-primary/20 text-primary font-semibold text-sm'>
                                            {index + 1}
                                        </span>
                                        {field.description ||
                                            `Family Package ${index + 1}`}
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
                                    <div className='col-span-1 lg:col-span-2'>
                                        <FormField
                                            control={control}
                                            name={`pricingConfig.familyPackages.${index}.description`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Package Description
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder='e.g. Family of 4 Special'
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                                        <FormField
                                            control={control}
                                            name={`pricingConfig.familyPackages.${index}.adultCount`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Adult Count
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='number'
                                                            min={1}
                                                            {...field}
                                                            onChange={e =>
                                                                field.onChange(
                                                                    parseInt(
                                                                        e.target
                                                                            .value,
                                                                        10
                                                                    ) || 1
                                                                )
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={control}
                                            name={`pricingConfig.familyPackages.${index}.childCount`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Child Count
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='number'
                                                            min={0}
                                                            {...field}
                                                            onChange={e =>
                                                                field.onChange(
                                                                    parseInt(
                                                                        e.target
                                                                            .value,
                                                                        10
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

                                    <FormField
                                        control={control}
                                        name={`pricingConfig.familyPackages.${index}.discount`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Discount Percentage
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='number'
                                                        min={0}
                                                        max={100}
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
                                                <FormDescription>
                                                    Total discount for the
                                                    family package (%)
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </div>
            ) : (
                <div className='text-center p-4 border border-dashed rounded-md'>
                    <p className='text-gray-700 text-sm'>
                        No family packages added yet. Create special rates for
                        families.
                    </p>
                    <Button
                        type='button'
                        onClick={() => {
                            append({
                                description: 'Standard Family Package',
                                adultCount: 2,
                                childCount: 2,
                                discount: 10 });
                            setOpenStates(prev => [...prev, true]); // Open the new package by default
                        }}
                        variant='outline'
                        className='mt-2'
                        size='sm'>
                        <Plus className='h-4 w-4 mr-2' />
                        Add Family Package
                    </Button>
                </div>
            )}
        </div>
    );
}

export function GroupPricing() {
    return (
        <div className='space-y-6'>
            <GroupDiscounts />
            <ComplimentaryPolicies />
            <CorporateRates />
            <FamilyPackages />
        </div>
    );
}

