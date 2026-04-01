import SelectOptions from '@/app/[lang]/admin/(dashboard)/dashboard/components/common/select-options';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { tripPackageOptions } from '@/data/trip-options';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import useCategoryTypesData from '../../../../../../../../../../hooks/use-category-types-data';
import { CATEGORY_TYPES } from '../../../../categories/constants/category-types';
import { AgeCategoryPricing } from './age-category-pricing';

export function PricingTiers() {
    const { control, watch } = useFormContext();
    const startingDay = watch('datesAvailability.dateRangeStart');

    // Get Age Category Data
    const { isLoading, data, error } = useCategoryTypesData(
        CATEGORY_TYPES.AGE_CATEGORY
    );

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'pricingTiers',
    });

    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h3 className='text-sm font-medium'>Base Pricing Tiers</h3>
                <Button
                    type='button'
                    onClick={() =>
                        append({
                            name: 'Standard',
                            basePrice: watch('startingPrice'),
                            ageCategory: 'Adult',
                            groupSizeMin: 1,
                            groupSizeMax: null,
                            validFrom: null,
                            validUntil: null,
                            singleSupplement: null,
                            seasonType: null,
                        })
                    }
                    size='sm'
                    variant='outline'>
                    <Plus className='h-4 w-4 mr-2' />
                    Add Pricing Tier
                </Button>
            </div>

            {fields.length > 0 ? (
                <div className='space-y-6'>
                    {fields.map((field, index) => (
                        <Accordion
                            key={field.id}
                            type='single'
                            collapsible
                            className='border py-1 rounded-md'>
                            <AccordionItem
                                value='item-1'
                                className='border-b-0'>
                                <div className='flex items-center justify-between px-4'>
                                    <AccordionTrigger className='hover:no-underline py-2'>
                                        <h4 className='font-medium'>
                                            Pricing Tier #{index + 1}
                                        </h4>
                                    </AccordionTrigger>

                                    {fields.length > 1 && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        type='button'
                                                        variant='ghost'
                                                        size='sm'
                                                        onClick={() =>
                                                            remove(index)
                                                        }
                                                        className='h-7 w-7 p-0'>
                                                        <Trash2 className='h-4 w-4 text-gray-700' />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Delete pricing tier</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </div>
                                <AccordionContent className='px-4 pb-4 overflow-visible'>
                                    <div className='space-y-6'>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                            <FormField
                                                control={control}
                                                name={`pricingTiers.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Name{' '}
                                                            <span className='text-red-500'>
                                                                *
                                                            </span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder='e.g. Standard'
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            E.g., Standard, Peak
                                                            Season, Off Season
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={control}
                                                name={`pricingTiers.${index}.ageCategory`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Age Category
                                                        </FormLabel>

                                                        <SelectOptions
                                                            defaultValue='Adult'
                                                            defaultData={
                                                                tripPackageOptions.ageCategories
                                                            }
                                                            field={field}
                                                            dataArray={data}
                                                            placeholder='Select Age Category'
                                                            goToUrl='/dashboard/categories'
                                                        />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <p className='mb-0 bg-amber-50 border-dashed border-1 border-amber-200 px-4 rounded text-amber-800'>
                                            Your trip price started with{' '}
                                            <Badge className='bg-amber-50 rounded-sm text-amber-600 border-amber-200'>
                                                {watch('startingPrice')}
                                            </Badge>
                                            . Adjust your pricing tier based on
                                            starting price.
                                        </p>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                            <FormField
                                                control={control}
                                                name={`pricingTiers.${index}.basePrice`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Base Price{' '}
                                                            <span className='text-red-500'>
                                                                *
                                                            </span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type='number'
                                                                min={0}
                                                                step='0.01'
                                                                placeholder='1299.99'
                                                                {...field}
                                                                onChange={e =>
                                                                    field.onChange(
                                                                        parseFloat(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        ) ||
                                                                            watch(
                                                                                'startingPrice'
                                                                            )
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
                                                name={`pricingTiers.${index}.singleSupplement`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Single Supplement
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type='number'
                                                                min={0}
                                                                step='0.01'
                                                                placeholder='299.99'
                                                                {...field}
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                } // Ensure it's always a string, never undefined
                                                                onChange={e =>
                                                                    field.onChange(
                                                                        e.target
                                                                            .value ===
                                                                            ''
                                                                            ? null
                                                                            : parseFloat(
                                                                                  e
                                                                                      .target
                                                                                      .value
                                                                              ) ||
                                                                                  0
                                                                    )
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Additional cost for
                                                            single occupancy
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                            <FormField
                                                control={control}
                                                name={`pricingTiers.${index}.groupSizeMin`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Min Group Size
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type='number'
                                                                min={1}
                                                                placeholder='1'
                                                                {...field}
                                                                onChange={e =>
                                                                    field.onChange(
                                                                        parseInt(
                                                                            e
                                                                                .target
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
                                                name={`pricingTiers.${index}.groupSizeMax`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Max Group Size
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type='number'
                                                                min={1}
                                                                placeholder='10'
                                                                {...field}
                                                                value={
                                                                    field.value ===
                                                                    null
                                                                        ? ''
                                                                        : field.value
                                                                }
                                                                onChange={e =>
                                                                    field.onChange(
                                                                        e.target
                                                                            .value ===
                                                                            ''
                                                                            ? null
                                                                            : parseInt(
                                                                                  e
                                                                                      .target
                                                                                      .value,
                                                                                  10
                                                                              ) ||
                                                                                  1
                                                                    )
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 '>
                                            <FormField
                                                control={control}
                                                name={`pricingTiers.${index}.validFrom`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Valid From
                                                        </FormLabel>
                                                        <FormControl>
                                                            <FormDatePicker
                                                                {...field}
                                                                disablePastDates={
                                                                    true
                                                                }
                                                                minDate={
                                                                    new Date(
                                                                        startingDay
                                                                    )
                                                                }
                                                                className='flex-1'
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={control}
                                                name={`pricingTiers.${index}.validUntil`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Valid Until
                                                        </FormLabel>
                                                        <FormControl>
                                                            <FormDatePicker
                                                                {...field}
                                                                disablePastDates={
                                                                    true
                                                                }
                                                                minDate={
                                                                    new Date(
                                                                        watch(
                                                                            `pricingTiers.${index}.validFrom`
                                                                        )
                                                                    )
                                                                }
                                                                className='flex-1'
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={control}
                                            name={`pricingTiers.${index}.seasonType`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Season Type
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        value={
                                                            field.value || ''
                                                        }>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Select season type' />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value='null'>
                                                                Not specified
                                                            </SelectItem>
                                                            <SelectItem value='LOW'>
                                                                Low Season
                                                            </SelectItem>
                                                            <SelectItem value='SHOULDER'>
                                                                Shoulder Season
                                                            </SelectItem>
                                                            <SelectItem value='HIGH'>
                                                                High Season
                                                            </SelectItem>
                                                            <SelectItem value='PEAK'>
                                                                Peak Season
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription>
                                                        Season categorization
                                                        for this pricing tier
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    ))}
                </div>
            ) : (
                <div className='text-center p-8 border border-dashed rounded-md'>
                    <p className='text-gray-700'>No pricing tiers added yet.</p>
                    <Button
                        type='button'
                        onClick={() =>
                            append({
                                name: 'Standard',
                                basePrice: watch('startingPrice'),
                                ageCategory: 'Adult',
                                groupSizeMin: 1,
                                groupSizeMax: null,
                                validFrom: null,
                                validUntil: null,
                                singleSupplement: null,
                                seasonType: null,
                            })
                        }
                        variant='outline'
                        className='mt-2'>
                        <Plus className='h-4 w-4 mr-2' />
                        Add Pricing Tier
                    </Button>
                </div>
            )}

            {/* Add the Age Category Pricing component */}
            <AgeCategoryPricing />
        </div>
    );
}

