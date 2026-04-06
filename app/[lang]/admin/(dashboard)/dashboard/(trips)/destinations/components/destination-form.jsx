'use client';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { destination } from '@/utils/validations/destinations';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
    createDestination,
    updateDestination,
} from '@/app/_actions/trips/destinations';
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
import { generateSlug } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ImageUploadWithSelector } from '../../../components/common/image-upload-selector';

export function DestinationForm({
    open,
    editDestination,
    setEditDestination,
    onOpenChange,
}) {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const form = useForm({
        resolver: zodResolver(destination),
        defaultValues: {
            name: '',
            description: '',
            country: '',
            city: '',
            region: '',
            latitude: '',
            longitude: '',
            images: [],
            embededMap: '',
        },
    });

    useEffect(() => {
        if (editDestination) {
            const sanitizedData = {
                ...editDestination,
                latitude: editDestination.latitude ?? '',
                longitude: editDestination.longitude ?? '',
                embededMap: editDestination.embededMap ?? '',
                city: editDestination.city ?? '',
                region: editDestination.region ?? '',
            };
            form.reset(sanitizedData);
        }
    }, [editDestination, form]);

    async function onSubmit(values) {
        try {
            setIsPending(true);
            
            // Format payload to strictly match the backend's CreateDestinationDto/UpdateDestinationDto
            const payload = {
                ...values,
                name: values.name.trim(),
                imageIds: values.images?.map(img => img.imageId || img.id) || [],
            };
            
            // Remove the frontend 'images' array to avoid backend validation errors (forbidNonWhitelisted)
            delete payload.images;

            if (editDestination) {
                const result = await updateDestination(editDestination?.id, payload);
                if (result?.success === true) {
                    toast.success('Destination updated successfully');
                    form.reset();
                    onOpenChange(false);
                    if (searchParams.has('create')) {
                        router.push(pathname);
                    }
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
                const result = await createDestination(payload);
                console.log(`payload`, payload);

                if (result?.success === true) {
                    toast.success('Destination created successfully');
                    form.reset();
                    onOpenChange(false);
                    if (searchParams.has('create')) {
                        router.push(pathname);
                    }
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
            toast.error('An unexpected error occurred');
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Sheet
            open={open}
            onOpenChange={() => {
                onOpenChange(false);
                setEditDestination(null);
                form.reset();
            }}>
            <SheetContent className='sm:max-w-2xl p-4 overflow-y-auto'>
                <SheetHeader>
                    <SheetTitle className='text-xl font-semibold'>
                        {editDestination
                            ? 'Edit Destination'
                            : 'Add New Destination'}
                    </SheetTitle>
                    <SheetDescription className='text-sm text-muted-foreground'>
                        {editDestination
                            ? 'Update the destination details below'
                            : 'Fill in the details to create a new destination'}
                    </SheetDescription>
                </SheetHeader>

                <div className='p-5'>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-6'>
                            {/* Name and Country */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <FormField
                                    control={form.control}
                                    name='name'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Destination Name{' '}
                                                <span className='text-destructive'>
                                                    *
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    value={field.value || ''}
                                                    placeholder='e.g., Karwan Bazar'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription className='text-xs'>
                                                Used to generate the URL slug
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='country'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Country{' '}
                                                <span className='text-destructive'>
                                                    *
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    value={field.value || ''}
                                                    placeholder='e.g., Bangladesh'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* City and Region */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <FormField
                                    control={form.control}
                                    name='city'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input
                                                    value={field.value || ''}
                                                    placeholder='e.g., Dhaka'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='region'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Region</FormLabel>
                                            <FormControl>
                                                <Input
                                                    value={field.value || ''}
                                                    placeholder='e.g., South Asia'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Description */}
                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                value={field.value || ''}
                                                placeholder='Describe the destination...'
                                                rows={4}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Images */}
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
                                        <FormDescription className='text-xs'>
                                            Upload up to 10 images for this
                                            destination
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Coordinates */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <FormField
                                    control={form.control}
                                    name='latitude'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Latitude</FormLabel>
                                            <FormControl>
                                                <Input
                                                    value={field.value || ''}
                                                    onChange={e => {
                                                        const value =
                                                            e.target.value ===
                                                            ''
                                                                ? ''
                                                                : Number(
                                                                      e.target
                                                                          .value
                                                                  );
                                                        field.onChange(value);
                                                    }}
                                                    type='number'
                                                    step='any'
                                                    placeholder='e.g., 23.8103'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='longitude'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Longitude</FormLabel>
                                            <FormControl>
                                                <Input
                                                    value={field.value || ''}
                                                    type='number'
                                                    step='any'
                                                    placeholder='e.g., 90.4125'
                                                    onChange={e => {
                                                        const value =
                                                            e.target.value ===
                                                            ''
                                                                ? ''
                                                                : Number(
                                                                      e.target
                                                                          .value
                                                                  );
                                                        field.onChange(value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Embedded Map */}
                            <FormField
                                control={form.control}
                                name='embededMap'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Embedded Map (iframe)
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                rows={3}
                                                value={field.value || ''}
                                                placeholder='Paste Google Maps iframe code here...'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className='text-xs'>
                                            Paste the complete iframe code from
                                            Google Maps
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Slug Preview */}
                            {form.watch('name') && (
                                <div className='rounded-lg bg-muted p-4 space-y-2'>
                                    <div className='text-sm font-medium text-muted-foreground'>
                                        URL Preview
                                    </div>
                                    <div className='font-mono text-sm'>
                                        {generateSlug(form.watch('name'))}
                                    </div>
                                </div>
                            )}

                            {/* Footer Buttons */}
                            <SheetFooter className='sm:gap-0'>
                                <div className='flex gap-2'>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        onClick={() => {
                                            onOpenChange(false);
                                            setEditDestination(null);
                                            form.reset();
                                        }}
                                        disabled={isPending}>
                                        Cancel
                                    </Button>
                                    <Button type='submit' disabled={isPending}>
                                        {isPending
                                            ? 'Saving...'
                                            : editDestination
                                              ? 'Update Destination'
                                              : 'Create Destination'}
                                    </Button>
                                </div>
                            </SheetFooter>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    );
}

