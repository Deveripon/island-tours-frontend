import AddMoreButton from '@/app/[lang]/admin/(dashboard)/dashboard/components/common/add-more-button';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
import { Switch } from '@/components/ui/switch';
import { tripPackageOptions } from '@/data/trip-options';
import { ChevronDown, ChevronUp, Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import useCategoryTypesData from '../../../../../../../../../../hooks/use-category-types-data';
import { CATEGORY_TYPES } from '../../../../categories/constants/category-types';

// Installment Plans Component
function InstallmentPlans() {
    const { control } = useFormContext();
    // Get Currency Data

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'pricingConfig.paymentOptions.installmentPlans',
    });

    // Watch all processing fee values at once outside the map function
    const installmentPlansValues = useWatch({
        control,
        name: 'pricingConfig.paymentOptions.installmentPlans',
    });

    // Add state to track open/closed state of each plan
    const [openStates, setOpenStates] = useState([]);

    // Function to toggle a specific plan's open state
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
                <h3 className='text-sm font-medium'>Installment Plans</h3>
                <Button
                    type='button'
                    onClick={() => {
                        append({
                            name: '',
                            installmentCount: 3,
                            hasProcessingFee: false,
                            processingFeePercentage: null,
                        });
                        setOpenStates(prev => [...prev, true]); // Open the new plan by default
                    }}
                    size='sm'
                    variant='outline'>
                    <Plus className='h-4 w-4 mr-2' />
                    Add Plan
                </Button>
            </div>

            {fields.length > 0 ? (
                <div className='space-y-4'>
                    {fields.map((field, index) => {
                        // Get the value from our watched array instead of using useWatch in the loop
                        const hasProcessingFee =
                            installmentPlansValues?.[index]?.hasProcessingFee ||
                            false;

                        return (
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
                                            {/* Use a safer way to display the title */}
                                            {`Installment Plan ${index + 1}`}
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
                                                            (_, i) =>
                                                                i !== index
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
                                            name={`pricingConfig.paymentOptions.installmentPlans.${index}.name`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Plan Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder='e.g. 3-Month Plan, Pay in 3'
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
                                                name={`pricingConfig.paymentOptions.installmentPlans.${index}.installmentCount`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Number of
                                                            Installments
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type='number'
                                                                min={2}
                                                                {...field}
                                                                onChange={e =>
                                                                    field.onChange(
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            10
                                                                        ) || 2
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
                                                name={`pricingConfig.paymentOptions.installmentPlans.${index}.hasProcessingFee`}
                                                render={({ field }) => (
                                                    <FormItem className='flex flex-row items-start space-x-3 space-y-0 mt-8'>
                                                        <FormControl>
                                                            <Switch
                                                                checked={
                                                                    field.value
                                                                }
                                                                onCheckedChange={
                                                                    field.onChange
                                                                }
                                                            />
                                                        </FormControl>
                                                        <div>
                                                            <FormLabel>
                                                                Has Processing
                                                                Fee
                                                            </FormLabel>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {hasProcessingFee && (
                                            <FormField
                                                control={control}
                                                name={`pricingConfig.paymentOptions.installmentPlans.${index}.processingFeePercentage`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Processing Fee
                                                            Percentage
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type='number'
                                                                min={0}
                                                                step='0.01'
                                                                placeholder='2.5'
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
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        );
                    })}
                </div>
            ) : (
                <div className='text-center p-4 border border-dashed rounded-md'>
                    <p className='text-gray-700 text-sm'>
                        No installment plans added yet.
                    </p>
                    <Button
                        type='button'
                        onClick={() => {
                            append({
                                name: '',
                                installmentCount: 3,
                                hasProcessingFee: false,
                                processingFeePercentage: null,
                            });
                            setOpenStates(prev => [...prev, true]); // Open the new plan by default
                        }}
                        variant='outline'
                        className='mt-2'
                        size='sm'>
                        <Plus className='h-4 w-4 mr-2' />
                        Add Plan
                    </Button>
                </div>
            )}
        </div>
    );
}

// Payment Method Surcharges Component
function PaymentMethodSurcharges() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'pricingConfig.paymentOptions.paymentMethodSurcharges',
    });

    return (
        <div className='rounded-md border p-4'>
            <div className='flex justify-between items-center mb-4'>
                <h3 className='text-sm font-medium'>
                    Payment Method Surcharges
                </h3>
                <Button
                    type='button'
                    onClick={() =>
                        append({
                            paymentMethod: '',
                            surchargePercentage: 0,
                        })
                    }
                    size='sm'
                    variant='outline'>
                    <Plus className='h-4 w-4 mr-2' />
                    Add Surcharge
                </Button>
            </div>

            {fields.length > 0 ? (
                <div className='space-y-4'>
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className='grid grid-cols-1 md:grid-cols-2 gap-6 border rounded-md p-3 relative'>
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
                                name={`pricingConfig.paymentOptions.paymentMethodSurcharges.${index}.paymentMethod`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Method</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='e.g. Credit Card, PayPal'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name={`pricingConfig.paymentOptions.paymentMethodSurcharges.${index}.surchargePercentage`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Surcharge Percentage
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                min={0}
                                                step='0.01'
                                                placeholder='2.5'
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
                                            Additional percentage charged for
                                            this payment method
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
                        No payment method surcharges added yet.
                    </p>
                    <Button
                        type='button'
                        onClick={() =>
                            append({
                                paymentMethod: '',
                                surchargePercentage: 0,
                            })
                        }
                        variant='outline'
                        className='mt-2'
                        size='sm'>
                        <Plus className='h-4 w-4 mr-2' />
                        Add Surcharge
                    </Button>
                </div>
            )}
        </div>
    );
}

// Promotional Codes Component
function PromotionalCodes() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'pricingConfig.promotionalCodes',
    });

    // Add state to track open/closed state of each promo code
    const [openStates, setOpenStates] = useState([]);

    // Function to toggle a specific promo code's open state
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
                <h3 className='text-sm font-medium'>Promotional Codes</h3>
                <Button
                    type='button'
                    onClick={() => {
                        append({
                            code: '',
                            description: '',
                            discountType: 'PERCENTAGE',
                            discountValue: 10,
                            validFrom: null,
                            validUntil: null,
                            usageLimit: null,
                        });
                        setOpenStates(prev => [...prev, true]); // Open the new promo code by default
                    }}
                    size='sm'
                    variant='outline'>
                    <Plus className='h-4 w-4 mr-2' />
                    Add Promo Code
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
                                        {/* Safely access field properties using watch to show the promo name */}
                                        {`Promo Code ${index + 1}`}
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
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        <FormField
                                            control={control}
                                            name={`pricingConfig.promotionalCodes.${index}.code`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Promo Code
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder='e.g. SUMMER20'
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={control}
                                            name={`pricingConfig.promotionalCodes.${index}.description`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Description
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder='e.g. Summer 20% off'
                                                            {...field}
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
                                            name={`pricingConfig.promotionalCodes.${index}.discountType`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Discount Type
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
                                            name={`pricingConfig.promotionalCodes.${index}.discountValue`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Discount Value
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

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        <FormField
                                            control={control}
                                            name={`pricingConfig.promotionalCodes.${index}.validFrom`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Valid From
                                                    </FormLabel>
                                                    <FormControl>
                                                        <FormDatePicker
                                                            disablePastDates={
                                                                true
                                                            }
                                                            {...field}
                                                            placeholder='Select  date'
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={control}
                                            name={`pricingConfig.promotionalCodes.${index}.validUntil`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Valid Until
                                                    </FormLabel>
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
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </div>
            ) : (
                <div className='text-center p-4 border border-dashed rounded-md'>
                    <p className='text-gray-700 text-sm'>
                        No promotional codes added yet.
                    </p>
                    <Button
                        type='button'
                        onClick={() => {
                            append({
                                code: '',
                                description: '',
                                discountType: 'PERCENTAGE',
                                discountValue: 10,
                                validFrom: null,
                                validUntil: null,
                                usageLimit: null,
                            });
                            setOpenStates(prev => [...prev, true]); // Open the new promo code by default
                        }}
                        variant='outline'
                        className='mt-2'
                        size='sm'>
                        <Plus className='h-4 w-4 mr-2' />
                        Add Promo Code
                    </Button>
                </div>
            )}
        </div>
    );
}

export function PaymentOptions() {
    const { control, setValue } = useFormContext();
    const { isLoading, data, error } = useCategoryTypesData(
        CATEGORY_TYPES.CURRENCY
    );

    // Use watch to directly access the array
    const acceptedCurrencies = useWatch({
        control,
        name: 'pricingConfig.paymentOptions.acceptedCurrencies',
        defaultValue: [],
    });

    // Handler to add a currency if it doesn't already exist
    const addCurrency = currencyCode => {
        if (!acceptedCurrencies.includes(currencyCode)) {
            const newCurrencies = [...acceptedCurrencies, currencyCode];
            setValue(
                'pricingConfig.paymentOptions.acceptedCurrencies',
                newCurrencies
            );
        }
    };

    // Handler to remove a currency
    const removeCurrency = index => {
        const newCurrencies = [...acceptedCurrencies];
        newCurrencies.splice(index, 1);
        setValue(
            'pricingConfig.paymentOptions.acceptedCurrencies',
            newCurrencies
        );
    };

    return (
        <div className='space-y-6'>
            <InstallmentPlans />

            {/* Accepted Currencies */}
            <div className='rounded-md border p-4'>
                <h3 className='text-sm font-medium mb-4'>
                    Accepted Currencies
                </h3>
                <div className='mb-4'>
                    <div className='flex flex-wrap gap-2'>
                        {tripPackageOptions.currencies.map(currency => (
                            <Button
                                key={currency.name}
                                type='button'
                                variant='outline'
                                size='sm'
                                onClick={() => addCurrency(currency.name)}
                                className='text-sm'>
                                {currency.name}
                            </Button>
                        ))}
                        {data?.length > 0 &&
                            data.map(currency => (
                                <Button
                                    key={currency.name}
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={() => addCurrency(currency.name)}
                                    className='text-sm'>
                                    {currency.name}
                                </Button>
                            ))}
                    </div>
                </div>
                <div className='flex flex-wrap gap-2 mt-4'>
                    {acceptedCurrencies.map((currency, index) => (
                        <div
                            key={index}
                            className='bg-primary-50 rounded-md flex items-center px-2 py-1 text-sm'>
                            {currency}
                            <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => removeCurrency(index)}
                                className='h-5 w-5 p-0 ml-1'>
                                <Minus className='h-3 w-3' />
                            </Button>
                        </div>
                    ))}
                    {acceptedCurrencies.length === 0 && (
                        <div className='text-gray-700 text-sm'>
                            No currencies selected. Default: USD
                        </div>
                    )}

                    <AddMoreButton
                        goToUrl='/dashboard/categories'
                        className='w-full'
                        ButtonText='Add More Currency'
                    />
                </div>
            </div>

            <PaymentMethodSurcharges />
            <PromotionalCodes />
        </div>
    );
}

