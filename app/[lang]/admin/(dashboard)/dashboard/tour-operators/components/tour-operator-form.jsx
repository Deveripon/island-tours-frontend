'use client';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
    createNewAffiliates,
    updateAffiliatesById,
} from '@/app/_actions/partnerActions';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { tourOperatorSchema } from '@/utils/validations/tour-operator';
import { ImageUploadWithSelector } from '../../components/common/image-upload-selector';

export function TourOperatorForm({
    open,
    edittourOperator,
    setEdittourOperator,
    onOpenChange,
}) {
    const [isPending, setIsPending] = useState(false);

    const form = useForm({
        resolver: zodResolver(tourOperatorSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            links: '',
            photo: '',
        },
    });

    useEffect(() => {
        if (edittourOperator) {
            // Convert null values to empty strings to avoid React warnings
            const sanitizedData = {
                ...edittourOperator,
                name: edittourOperator.name ?? '',
                email: edittourOperator.email ?? '',
                phone: edittourOperator.phone ?? '',
                links: edittourOperator.links ?? '',
                photo: edittourOperator.photo?.image ?? '',
            };
            form.reset(sanitizedData);
        }
    }, [edittourOperator, form]);

    // Handle form submission
    async function onSubmit(values) {
        try {
            setIsPending(true);

            if (edittourOperator) {
                const processedValues = {
                    ...values,
                    name: values.name?.trim() || '',
                    email: values.email.trim(),
                    photo: {
                        imageId: values.photo.imageId || values.photo.id,
                    },
                };

                const result = await updateAffiliatesById(
                    edittourOperator?.id,
                    processedValues
                );

                if (result?.success === true) {
                    toast.success('Updated Successfully');
                    setEdittourOperator(null);
                    form.reset();
                    onOpenChange(false);
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
                const result = await createNewAffiliates(values);

                if (result?.success === true) {
                    toast.success('Tour Partner Added Successfully');
                    form.reset();
                    onOpenChange(false);
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
            console.error('Form submission error:', error);
            toast.error('Oops! There was an error');
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Sheet
            open={open}
            onOpenChange={() => {
                onOpenChange(false);
                setEdittourOperator(null);
            }}>
            <SheetContent className='sm:max-w-2xl p-4 rounded-lg overflow-scroll'>
                <SheetHeader>
                    <SheetTitle>
                        {edittourOperator
                            ? 'Edit Tour Partner'
                            : 'Add New Tour Partner'}
                    </SheetTitle>
                    <SheetDescription>
                        {edittourOperator
                            ? 'Update tour partner details.'
                            : 'Add a new tour partner to your system.'}
                    </SheetDescription>
                </SheetHeader>

                <div className='py-6 px-5'>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-6'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                value={field.value || ''}
                                                placeholder='John Doe Travel Agency'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Tour partner or agency name
                                            (optional)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Email{' '}
                                            <span className='text-red-500'>
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='email'
                                                value={field.value || ''}
                                                placeholder='contact@travelagency.com'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Primary contact email address
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='phone'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='tel'
                                                value={field.value || ''}
                                                placeholder='+880 1234-567890'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Contact phone number (optional)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='links'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Link</FormLabel>
                                        <FormControl>
                                            <Input
                                                value={field.value || ''}
                                                placeholder='https://example.com'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Website or social media link
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='photo'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Photo</FormLabel>
                                        <FormControl>
                                            <ImageUploadWithSelector
                                                fieldName='photo'
                                                onChange={field.onChange}
                                                multiple={false}
                                                maxFiles={1}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Profile photo or company logo
                                            (optional)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <SheetFooter>
                                <Button type='submit' disabled={isPending}>
                                    {isPending
                                        ? 'Saving...'
                                        : edittourOperator
                                          ? 'Update Tour Partner'
                                          : 'Create Tour Partner'}
                                </Button>
                            </SheetFooter>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    );
}

