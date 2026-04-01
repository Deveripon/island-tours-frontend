import { getAllCategoriesOfTenant } from '@/app/_actions/trips/category';
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
import { tripPackageOptions } from '@/data/trip-options';
import { getGroupedDataOfCategories } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import SelectOptions from '../../../../../components/common/select-options';
import { AgeCategoryPricing } from './age-category-pricing';

export function BasicPricingConfig() {
    const [categories, setCategories] = useState({});
    const { control, watch, setValue } = useFormContext();
    // Get Currency Data
    const defaultCurrencies = tripPackageOptions.currencies;
    const { tenant } = useParams();

    useEffect(() => {
        const affiliateCommissionType = watch(
            'pricingConfig.affiliateCommission.commissionType'
        );
        if (!affiliateCommissionType) {
            setValue(
                'pricingConfig.affiliateCommission.commissionType',
                'PERCENTAGE'
            );
        }
    });

    useEffect(() => {
        if (tenant) {
            async function fetchCategories() {
                const res = await getAllCategoriesOfTenant(tenant);
                if (res?.success) {
                    const groupedData = getGroupedDataOfCategories(
                        res?.result?.data
                    );
                    setCategories(groupedData);
                }
            }

            fetchCategories();
        }
    }, [tenant]);

    return (
        <div className='space-y-6'>
            <div className='rounded-md border border-border p-4'>
                <h3 className='text-sm font-medium mb-3'>
                    General Pricing Options
                </h3>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    <FormField
                        control={control}
                        name='pricingConfig.pricingModel'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pricing Model</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select pricing model' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value='PER_PERSON'>
                                            Per Person
                                        </SelectItem>
                                        <SelectItem value='TOTAL_PACKAGE'>
                                            Total Package
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    How your prices are calculated for customers
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name='pricingConfig.currency'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Currency</FormLabel>
                                <SelectOptions
                                    defaultData={defaultCurrencies}
                                    field={field}
                                    dataArray={categories?.CURRENCY}
                                    emptyStateText=''
                                    placeholder='Select Currency'
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <AgeCategoryPricing />
            </div>

            {/*      <DepositSettings />
            <EarlyBirdDiscount />
            <LastMinuteRates /> */}
            <TaxSettings />
            <ServiceChargeSettings />
            <div className='rounded-md border border-border p-4'>
                <h3 className='text-sm font-medium mb-3'>
                    Affiliate Commission Options
                </h3>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    <FormField
                        control={control}
                        name='pricingConfig.affiliateCommission.commissionType'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Commission Type</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value || 'PERCENTAGE'}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select payment type' />
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
                                <FormDescription>
                                    How you charge
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name='pricingConfig.affiliateCommission.commissionValue'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Commission Value</FormLabel>
                                <FormControl>
                                    <Input
                                        type='number'
                                        min={0}
                                        placeholder='12'
                                        {...field}
                                        value={
                                            field.value === null
                                                ? 0
                                                : field.value
                                        }
                                        onChange={e =>
                                            field.onChange(
                                                e.target.value === ''
                                                    ? null
                                                    : parseInt(
                                                          e.target.value,
                                                          10
                                                      )
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormDescription>
                                    Percentage from per person
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}

// Enable Tax
export function TaxSettings() {
    const { control } = useFormContext();
    const isIncluded = useWatch({
        control,
        name: 'pricingConfig.includedTax',
    });

    return (
        <div className='rounded-md border border-border p-4'>
            <div className='flex justify-between items-center mb-4'>
                <h3 className='text-sm font-medium'>Included Tax/GST</h3>
                <FormField
                    control={control}
                    name='pricingConfig.includedTax'
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

            {isIncluded && (
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    <FormField
                        control={control}
                        name='pricingConfig.taxPercentage'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tax/GST Percentage</FormLabel>
                                <FormControl>
                                    <Input
                                        type='number'
                                        min={0}
                                        placeholder='12'
                                        {...field}
                                        value={
                                            field.value === null
                                                ? 0
                                                : field.value
                                        }
                                        onChange={e =>
                                            field.onChange(
                                                e.target.value === ''
                                                    ? null
                                                    : parseInt(
                                                          e.target.value,
                                                          10
                                                      )
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormDescription>
                                    Percentage of the total amount
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

// Enable Service Charge
export function ServiceChargeSettings() {
    const { control } = useFormContext();
    const isIncluded = useWatch({
        control,
        name: 'pricingConfig.includedServiceCharge',
    });

    return (
        <div className='rounded-md border border-border p-4'>
            <div className='flex justify-between items-center mb-4'>
                <h3 className='text-sm font-medium'>Included Service Charge</h3>
                <FormField
                    control={control}
                    name='pricingConfig.includedServiceCharge'
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

            {isIncluded && (
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    <FormField
                        control={control}
                        name='pricingConfig.serviceCharge'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Service Charge</FormLabel>
                                <FormControl>
                                    <Input
                                        type='number'
                                        min={0}
                                        placeholder='Service Charge'
                                        {...field}
                                        value={field.value ?? 0} // Use nullish coalescing to handle both null and undefined
                                        onChange={e =>
                                            field.onChange(
                                                e.target.value === ''
                                                    ? null
                                                    : parseInt(
                                                          e.target.value,
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
                </div>
            )}
        </div>
    );
}

