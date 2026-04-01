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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

import { CATEGORY_TYPES } from '@/app/[lang]/admin/(dashboard)/dashboard/(trips)/categories/constants/category-types';
import {
    createNewActivities,
    updateActivitiesById,
} from '@/app/_actions/trips/activityActions';
import { tripPackageOptions } from '@/data/trip-options';
import { activitySchema } from '@/utils/validations/trip-package';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import useCategoryTypesData from '../../../../../../../../hooks/use-category-types-data';

import { ImageUploadWithSelector } from '@/app/[lang]/admin/(dashboard)/dashboard/components/common/image-upload-selector';
import SelectOptions from '@/app/[lang]/admin/(dashboard)/dashboard/components/common/select-options';
import { DestinationField } from '../../create-affiliate-trips/components/trip-package/basic-info-form';

// Define the initial state for a new activity item
export const defaultFormValues = {
    id: '',
    name: '',
    duration: '',
    difficulty: 'Moderate - Basic fitness required',
    price: 0,
    isHighlight: false,
    description: '',
    locationId: '',
    images: [],
};

export default function ActivityForm({
    editactivities,
    setEditactivities,
    onOpenChange,
    destinations,
}) {
    const [pending, setIsPending] = useState(false);
    const {
        isLoading: difficultyLevelOptionLoading,
        data: difficultyLevelOptions,
        error: difficultyLevelOptionError,
    } = useCategoryTypesData(CATEGORY_TYPES.DIFFICULTY_LEVEL);

    const form = useForm({
        resolver: zodResolver(activitySchema),
        defaultValues: defaultFormValues,
    });

    // Update form when editactivities changes
    useEffect(() => {
        if (editactivities) {
            form.reset({
                name: editactivities.name || '',
                duration: editactivities.duration || '',
                difficulty:
                    editactivities.difficulty || defaultFormValues.difficulty,
                price: editactivities.price || 0,
                isHighlight: editactivities.isHighlight || false,
                images: editactivities.images || [],
                description: editactivities.description || '',
                locationId: editactivities.locationId || '',
            });
            setTimeout(() => {
                form.setValue(
                    'difficulty',
                    editactivities.difficulty || defaultFormValues.difficulty
                );
            }, 100);
        } else {
            form.reset(defaultFormValues);
        }
    }, [editactivities, form]);

    const handleSheetClose = (shouldRefresh = false) => {
        // Reset form to default values
        form.reset(defaultFormValues);
        // Clear edit transportation
        setEditactivities && setEditactivities(null);
        // Close the sheet and optionally trigger refresh
        if (typeof onOpenChange === 'function') {
            onOpenChange(shouldRefresh);
        }
    };

    // handle form submission
    async function onSubmit(values) {
        try {
            setIsPending(true);
            if (editactivities) {
                const result = await updateActivitiesById(editactivities?.id, {
                    ...values,
                    name: values.name.trim(),
                });
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
                const result = await createNewActivities(values);
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
                    {/* Activity Name */}
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Activity Name{' '}
                                    <span className='text-red-500'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='e.g. Mountain Hiking'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Description */}
                    <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder='Describe this activity in detail...'
                                        className='min-h-[100px]'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Image images */}
                    <FormField
                        control={form.control}
                        name='images'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <ImageUploadWithSelector
                                        fieldName='images'
                                        onChange={field.onChange}
                                        multiple={true}
                                        maxFiles={10}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Add multiple images to showcase this
                                    activity
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <DestinationField
                        fieldName='locationId'
                        control={form.control}
                        label='Location'
                        required
                        destinations={destinations}
                    />

                    {/* Duration and Price Row */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {/* Duration */}
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
                                    <FormDescription>
                                        How long does this activity take?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Price */}
                        <FormField
                            control={form.control}
                            name='price'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            placeholder='e.g. 50'
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
                                        Price per person
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Difficulty Level */}
                    <FormField
                        control={form.control}
                        name='difficulty'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Difficulty Level</FormLabel>
                                <SelectOptions
                                    defaultData={
                                        tripPackageOptions.difficultyLevels
                                    }
                                    field={field}
                                    dataArray={difficultyLevelOptions}
                                    placeholder='Select Difficulty Level'
                                    goToUrl='/dashboard/categories'
                                    key={editactivities?.id || 'new'}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Highlight Activity */}
                    <FormField
                        control={form.control}
                        name='isHighlight'
                        render={({ field }) => (
                            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                                <div className='space-y-0.5'>
                                    <FormLabel className='text-base'>
                                        Highlight Activity
                                    </FormLabel>
                                    <FormDescription>
                                        Mark this as a featured activity for the
                                        trip package
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

                    {/* Submit Button */}
                    <Button
                        type='submit'
                        className='w-full'
                        size='lg'
                        disabled={pending}>
                        {pending
                            ? editactivities
                                ? 'Updating Activity'
                                : 'Creating Activity'
                            : editactivities
                              ? 'Update Activity'
                              : 'Create Activity'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

