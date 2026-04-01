import { CATEGORY_TYPES } from '@/app/[lang]/admin/(dashboard)/dashboard/(trips)/categories/constants/category-types';
import { ImageUploadWithSelector } from '@/app/[lang]/admin/(dashboard)/dashboard/components/common/image-upload-selector';
import SelectOptions from '@/app/[lang]/admin/(dashboard)/dashboard/components/common/select-options';
import {
    createNewSightseeing,
    updateSightseeingById,
} from '@/app/_actions/trips/sightseeings';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { tripPackageOptions } from '@/data/trip-options';
import { sightseeingSchema } from '@/utils/validations/trip-package';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import useCategoryTypesData from '../../../../../../../../../../../hooks/use-category-types-data';

// Define the initial state for a new sightseeing item
export const defaultFormValues = {
    name: '',
    duration: '',
    price: 0,
    images: [],
    currency: 'USD - US Dollar',
    description: '',
    location: '',
};

const defaultCurrencies = tripPackageOptions.currencies;

export function SightseeingForm({
    editSightseeing,
    setEditSightseeing,
    onOpenChange,
}) {
    const [pending, setIsPending] = useState(false);
    const { isLoading, data, error } = useCategoryTypesData(
        CATEGORY_TYPES.CURRENCY
    );

    const form = useForm({
        resolver: zodResolver(sightseeingSchema),
        defaultValues: defaultFormValues,
    });

    // Update form when editSightseeing changes
    useEffect(() => {
        if (editSightseeing) {
            form.reset({
                name: editSightseeing.name || '',
                duration: editSightseeing.duration || '',
                price: editSightseeing.price || 0,
                images: editSightseeing.images || [],
                currency: editSightseeing.currency || 'USD - US Dollar',
                description: editSightseeing.description || '',
                location: editSightseeing.location || '',
            });
        } else {
            form.reset(defaultFormValues);
        }
    }, [editSightseeing, form]);

    const handleSheetClose = (shouldRefresh = false) => {
        // Reset form to default values
        form.reset(defaultFormValues);
        // Clear edit transportation
        setEditSightseeing && setEditSightseeing(null);
        // Close the sheet and optionally trigger refresh
        if (typeof onOpenChange === 'function') {
            onOpenChange(shouldRefresh);
        }
    };

    // handle form submission
    async function onSubmit(values) {
        try {
            setIsPending(true);
            if (editSightseeing) {
                const result = await updateSightseeingById(
                    editSightseeing?.id,
                    {
                        ...values,
                        name: values.name.trim(),
                    }
                );
                if (result?.success === true) {
                    toast.success('Updated Successfully');
                    handleSheetClose(true); // Pass true to refresh the list
                } else {
                    toast.error(
                        (result?.error &&
                        typeof result.error === 'object' &&
                        'message' in result.error
                            ? result.error.message
                            : 'An error occurred') || 'An error occurred'
                    );
                }
            } else {
                const result = await createNewSightseeing(values);
                if (result?.success === true) {
                    toast.success('Added Successfully');
                    handleSheetClose(true); // Pass true to refresh the list
                } else {
                    toast.error(
                        (result?.error &&
                        typeof result.error === 'object' &&
                        'message' in result.error
                            ? result.error.message
                            : 'An error occurred') || 'An error occurred'
                    );
                }
            }
        } catch (error) {
            toast.error('Oops ! There was an error');
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-6'>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Name{' '}
                                    <span className='text-red-500'>*</span>{' '}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='e.g.Visiting to GoolMarg...'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='images'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Images{' '}
                                    <span className='text-red-500'>*</span>{' '}
                                </FormLabel>
                                <FormControl>
                                    <ImageUploadWithSelector
                                        fieldName='images'
                                        onChange={field.onChange}
                                        multiple={true}
                                        maxFiles={10}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='location'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Location{' '}
                                    <span className='text-red-500'>*</span>{' '}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='e.g.Kashmir,...'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder='Write a comprehensive details of this place'
                                        className='min-h-[100px]'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className='grid grid-cols-3 gap-4'>
                        <FormField
                            control={form.control}
                            name='duration'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duration</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='e.g. 2 hours'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='price'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount Should Take</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            min={0}
                                            step='0.01'
                                            placeholder='10.00'
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
                                        Add Price if this should impact on price
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='currency'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Currency</FormLabel>

                                    <FormControl>
                                        <SelectOptions
                                            defaultData={defaultCurrencies}
                                            field={field}
                                            dataArray={data}
                                            emptyStateText=''
                                            placeholder='Select Currency'
                                            loadingState={isLoading}
                                            goToUrl='/dashboard/categories'
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button
                        type='submit'
                        className='w-full'
                        size='lg'
                        disabled={pending}>
                        {pending
                            ? editSightseeing
                                ? 'Updating SightSeeing'
                                : 'Creating SightSeeing'
                            : editSightseeing
                              ? 'Update SightSeeing'
                              : 'Create SightSeeing'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

