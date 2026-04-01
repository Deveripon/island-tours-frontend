import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export function AgeCategoryPricing() {
    const { control } = useFormContext();

    return (
        <div className='rounded-md border border-border p-4 mt-6'>
            <div className='flex justify-between items-center mb-4'>
                <h3 className='text-sm font-medium'>Age-Based Pricing</h3>
            </div>

            {/* Adults */}
            <div className='grid grid-cols-1 lg:grid-cols-5 gap-4 rounded-md p-3 relative'>
                <FormField
                    control={control}
                    name={`pricingConfig.ageCategoryPricing.adults`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Adults</FormLabel>
                            <Input value='Adults' readOnly type='text' />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name={`pricingConfig.ageCategoryPricing.adultsMinAge`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Min Age</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    min={13}
                                    max={100}
                                    value={field.value || 13}
                                    onChange={e =>
                                        field.onChange(
                                            parseInt(e.target.value, 10) || 13
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
                    name={`pricingConfig.ageCategoryPricing.adultsMaxAge`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Max Age</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    min={13}
                                    max={100}
                                    value={field.value || 100}
                                    onChange={e =>
                                        field.onChange(
                                            parseInt(e.target.value, 10) || 100
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
                    name={`pricingConfig.ageCategoryPricing.adultsPrice`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    min={0}
                                    value={field.value || 0}
                                    onChange={e =>
                                        field.onChange(
                                            parseFloat(e.target.value) || 0
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
                    name={`pricingConfig.ageCategoryPricing.maxAdults`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Maximum Passanger</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    min={1}
                                    max={30}
                                    value={field.value || 1}
                                    onChange={e =>
                                        field.onChange(
                                            parseInt(e.target.value, 10) || 1
                                        )
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Children */}
            <div className='grid grid-cols-1 lg:grid-cols-5 gap-4 rounded-md p-3 relative'>
                <FormField
                    control={control}
                    name={`pricingConfig.ageCategoryPricing.childrens`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Children</FormLabel>
                            <Input value='Children' readOnly type='text' />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name={`pricingConfig.ageCategoryPricing.childrensMinAge`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Min Age</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    min={4}
                                    max={12}
                                    value={field.value || 4}
                                    onChange={e =>
                                        field.onChange(
                                            parseInt(e.target.value, 10) || 4
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
                    name={`pricingConfig.ageCategoryPricing.childrensMaxAge`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Max Age</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    min={4}
                                    max={12}
                                    value={field.value || 12}
                                    onChange={e =>
                                        field.onChange(
                                            parseInt(e.target.value, 10) || 12
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
                    name={`pricingConfig.ageCategoryPricing.childrensPrice`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    min={0}
                                    value={field.value || 0}
                                    onChange={e =>
                                        field.onChange(
                                            parseFloat(e.target.value) || 0
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
                    name={`pricingConfig.ageCategoryPricing.maxChildren`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Maximum Passanger</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    min={0}
                                    max={30}
                                    value={field.value || 0}
                                    onChange={e =>
                                        field.onChange(
                                            parseInt(e.target.value, 10) || 0
                                        )
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Infants */}
            <div className='grid grid-cols-1 lg:grid-cols-5 gap-4 rounded-md p-3 relative'>
                <FormField
                    control={control}
                    name={`pricingConfig.ageCategoryPricing.infants`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Infants</FormLabel>
                            <Input value='Infants' readOnly type='text' />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name={`pricingConfig.ageCategoryPricing.infantsMinAge`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Min Age</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    min={0}
                                    max={3}
                                    value={field.value || 0}
                                    onChange={e =>
                                        field.onChange(
                                            parseInt(e.target.value, 10) || 0
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
                    name={`pricingConfig.ageCategoryPricing.infantsMaxAge`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Max Age</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    min={0}
                                    max={3}
                                    value={field.value || 3}
                                    onChange={e =>
                                        field.onChange(
                                            parseInt(e.target.value, 10) || 3
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
                    name={`pricingConfig.ageCategoryPricing.infantsPrice`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    min={0}
                                    value={field.value || 0}
                                    onChange={e =>
                                        field.onChange(
                                            parseFloat(e.target.value) || 0
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
                    name={`pricingConfig.ageCategoryPricing.maxInfants`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Maximum Passanger</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    min={0}
                                    max={10}
                                    value={field.value || 0}
                                    onChange={e =>
                                        field.onChange(
                                            parseInt(e.target.value, 10) || 0
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
    );
}

