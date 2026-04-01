import { Button } from '@/components/ui/button';
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
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

// Agent Commission Component
function AgentCommission() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'pricingConfig.agentCommission.commissionTiers' });

    return (
        <div className='rounded-md border p-4'>
            <div className='flex justify-between items-center mb-4'>
                <h3 className='text-sm font-medium'>Agent Commission Tiers</h3>
                <Button
                    type='button'
                    onClick={() =>
                        append({
                            tierName: '',
                            percentage: 0 })
                    }
                    size='sm'
                    variant='outline'>
                    <Plus className='h-4 w-4 mr-2' />
                    Add Commission Tier
                </Button>
            </div>

            <FormField
                control={control}
                name='pricingConfig.agentCommission.overrideOptions'
                render={({ field }) => (
                    <FormItem className='flex items-center space-x-2 mb-4'>
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div>
                            <FormLabel>Allow commission override</FormLabel>
                        </div>
                    </FormItem>
                )}
            />

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
                                name={`pricingConfig.agentCommission.commissionTiers.${index}.tierName`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tier Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='e.g. Standard, Premium, Elite'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Agent tier level
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name={`pricingConfig.agentCommission.commissionTiers.${index}.percentage`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Commission Percentage
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                min={0}
                                                max={100}
                                                step='0.1'
                                                placeholder='10'
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
                        No commission tiers added yet.
                    </p>
                    <Button
                        type='button'
                        onClick={() =>
                            append({
                                tierName: 'Standard',
                                percentage: 10 })
                        }
                        variant='outline'
                        className='mt-2'
                        size='sm'>
                        <Plus className='h-4 w-4 mr-2' />
                        Add Commission Tier
                    </Button>
                </div>
            )}
        </div>
    );
}

// Loyalty Benefits Component
function LoyaltyBenefits() {
    const { control } = useFormContext();
    const isEnabled = useWatch({
        control,
        name: 'pricingConfig.loyaltyBenefits.isEnabled' });

    return (
        <div className='rounded-md border p-4'>
            <div className='flex justify-between items-center mb-4'>
                <h3 className='text-sm font-medium'>
                    Loyalty Program Benefits
                </h3>
                <FormField
                    control={control}
                    name='pricingConfig.loyaltyBenefits.isEnabled'
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
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <FormField
                        control={control}
                        name='pricingConfig.loyaltyBenefits.discountPercentage'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Loyalty Discount Percentage
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type='number'
                                        min={0}
                                        max={100}
                                        step='0.1'
                                        placeholder='5'
                                        {...field}
                                        onChange={e =>
                                            field.onChange(
                                                parseFloat(e.target.value) || 0
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormDescription>
                                    Discount for repeat customers
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name='pricingConfig.loyaltyBenefits.pointsPerBooking'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Points Per Booking</FormLabel>
                                <FormControl>
                                    <Input
                                        type='number'
                                        min={0}
                                        placeholder='100'
                                        {...field}
                                        onChange={e =>
                                            field.onChange(
                                                parseInt(e.target.value, 10) ||
                                                    0
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormDescription>
                                    Loyalty points earned per booking
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

export function CommissionStructure() {
    return (
        <div className='space-y-6'>
            <AgentCommission />
            <LoyaltyBenefits />
        </div>
    );
}

