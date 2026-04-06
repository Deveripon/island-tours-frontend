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

import { createPickup, updatePickup } from '@/app/_actions/pickupActions';
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
import { pickups } from '@/utils/validations/pickups';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { TripSelectionField } from './trip-selection';

export function PickUpForm({ open, editpickup, setEditpickup, onOpenChange }) {
    const [isPending, setIsPending] = useState(false);

    const form = useForm({
        resolver: zodResolver(pickups),
        defaultValues: {
            locationName: '',
            fullAddress: '',
            price: '',
            meetingInstruction: '',
            tripId: '',
        },
    });

    useEffect(() => {
        if (editpickup) {
            // Convert null values to empty strings to avoid React warnings
            const sanitizedData = {
                ...editpickup,
                locationName: editpickup.locationName ?? '',
                fullAddress: editpickup.fullAddress ?? '',
                price: editpickup.price ?? '',
                meetingInstruction: editpickup.meetingInstruction ?? '',
                tripId: editpickup.tripId ?? '',
            };
            form.reset(sanitizedData);
        }
    }, [editpickup, form]);

    // Handle form submission
    async function onSubmit(values) {
        try {
            setIsPending(true);
            if (editpickup) {
                (async () => {
                    const result = await updatePickup(editpickup?.id, {
                        ...values,
                    });
                    if (result?.success === true) {
                        toast.success('Updated Successfully');
                        form.reset();
                        onOpenChange(false);
                    } else {
                        toast.error(
                            (result?.error &&
                            typeof result.error === 'object' &&
                            'message' in result.error
                                ? result.error.message // Type assertion removed
                                : 'An error occurred') || 'An error occurred'
                        );
                    }
                })();
            } else {
                (async () => {
                    const result = await createPickup(values);

                    if (result?.success === true) {
                        toast.success('Pickup Added Successfully');
                        form.reset();
                        onOpenChange(false);
                    } else {
                        toast.error(
                            (result?.error &&
                            typeof result.error === 'object' &&
                            'message' in result.error
                                ? result.error.message // Type assertion removed
                                : 'An error occurred') || 'An error occurred'
                        );
                    }
                })();
            }
        } catch (error) {
            toast.error('Oops ! There was an error');
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Sheet
            open={open}
            onOpenChange={() => {
                onOpenChange(false);
                setEditpickup(null);
            }}>
            <SheetContent className='sm:max-w-2xl p-4 rounded-lg overflow-scroll'>
                <SheetHeader>
                    <SheetTitle>
                        {editpickup
                            ? 'Edit Pickup/Drop'
                            : 'Add New Pickup/Drop'}
                    </SheetTitle>
                    <SheetDescription>
                        {editpickup
                            ? 'Update Pickup/Drop details. Slug will be automatically generated from the name.'
                            : 'Add a new Pickup/Drop. Slug will be automatically generated from the name.'}
                    </SheetDescription>
                </SheetHeader>

                <div className='p-6'>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-6'>
                            <div className='flex justify-between gap-2'>
                                <div className='flex-1'>
                                    <FormField
                                        control={form.control}
                                        name='locationName'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Location Name{' '}
                                                    <span className='text-red-500'>
                                                        *
                                                    </span>{' '}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        value={
                                                            field.value || ''
                                                        }
                                                        placeholder='e.g Patagon Lake'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    This will be used to
                                                    generate the slug.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <TripSelectionField control={form.control} />

                            <FormField
                                control={form.control}
                                name='fullAddress'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                value={field.value || ''}
                                                placeholder='e.g 123 Main St, Springfield, USA'
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
                                        <FormLabel>
                                            Price Per Person{' '}
                                            <span className='text-red-500'>
                                                *
                                            </span>{' '}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                min={0}
                                                value={field.value || 0}
                                                placeholder='e.g. 50'
                                                onChange={e =>
                                                    field.onChange(
                                                        parseInt(
                                                            e.target.value,
                                                            10
                                                        ) || 0
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='meetingInstruction'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Meeting Instruction
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                value={field.value || ''}
                                                placeholder='e.g. Look for the guide with a red umbrella.'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {form.watch('name') && (
                                <div className='rounded-md bg-muted p-4'>
                                    <div className='text-sm text-gray-700 font-medium'>
                                        Preview Slug
                                    </div>
                                    <div className='mt-1 font-mono text-sm'>
                                        {generateSlug(form.watch('name'))}
                                    </div>
                                </div>
                            )}

                            <SheetFooter>
                                <Button type='submit' disabled={isPending}>
                                    {isPending
                                        ? 'Saving...'
                                        : editpickup
                                          ? 'Update Pickup/Drop Location'
                                          : 'Create Pickup/Drop Location'}
                                </Button>
                            </SheetFooter>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    );
}

