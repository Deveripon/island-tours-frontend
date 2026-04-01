import { Button } from '@/components/ui/button';
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
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

export function LengthOfStayPricing() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'pricingConfig.lengthOfStayPricing' });

    return (
        <div className='rounded-md border p-4'>
            <div className='flex justify-between items-center mb-4'>
                <h3 className='text-sm font-medium'>Length of Stay Pricing</h3>
                <Button
                    type='button'
                    onClick={() =>
                        append({
                            minNights: 1,
                            maxNights: null,
                            discountType: 'PERCENTAGE',
                            discountValue: 0 })
                    }
                    size='sm'
                    variant='outline'>
                    <Plus className='h-4 w-4 mr-2' />
                    Add Tier
                </Button>
            </div>

            {fields.length > 0 ? (
                <div className='space-y-4'>
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className='grid grid-cols-1 lg:grid-cols-4 gap-6 border rounded-md p-3 relative'>
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
                                name={`pricingConfig.lengthOfStayPricing.${index}.minNights`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Min Nights</FormLabel>
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name={`pricingConfig.lengthOfStayPricing.${index}.maxNights`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Max Nights</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                min={1}
                                                placeholder='Optional'
                                                {...field}
                                                value={
                                                    field.value === null
                                                        ? ''
                                                        : field.value
                                                }
                                                onChange={e =>
                                                    field.onChange(
                                                        e.target.value === ''
                                                            ? null
                                                            : parseInt(
                                                                  e.target
                                                                      .value,
                                                                  10
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
                                name={`pricingConfig.lengthOfStayPricing.${index}.discountType`}
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
                                name={`pricingConfig.lengthOfStayPricing.${index}.discountValue`}
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
                        No length of stay pricing tiers added yet.
                    </p>
                    <Button
                        type='button'
                        onClick={() =>
                            append({
                                minNights: 1,
                                maxNights: null,
                                discountType: 'PERCENTAGE',
                                discountValue: 0 })
                        }
                        variant='outline'
                        className='mt-2'
                        size='sm'>
                        <Plus className='h-4 w-4 mr-2' />
                        Add Tier
                    </Button>
                </div>
            )}
        </div>
    );
}

