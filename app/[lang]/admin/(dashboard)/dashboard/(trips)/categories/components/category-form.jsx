'use client';

import { createNewCategory, updateCategoryById } from '@/app/_actions/trips/category';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { formatKey, generateSlug } from '@/lib/utils';
// import { Category } from '@/types/categories'; // Type import removed
import { categorySchema } from '@/utils/validations/trip-package';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { CategoryTypesArray } from '../constants/category-types';

export function CategoryForm({
    open,
    categoryTypes,
    onOpenChange,
    editingCategory,
    onSave = () => {},
    setEditingCategory }) {
    const [isPending, setIsPending] = useState(false);

    // Initialize form with react-hook-form
    const form = useForm({
        // Type argument removed
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: '',
            types: ['GENERAL'],
        } });

    // Update form values when editingCategory changes or component opens for editing
    useEffect(() => {
        if (editingCategory && open) {
            form.reset({
                name: editingCategory.name || '',
                types: Array.isArray(editingCategory?.types)
                    ? [...editingCategory.types]
                    : ['GENERAL'] });
        } else if (!editingCategory && open) {
            // Reset form when opening for a new category
            form.reset({
                name: '',
                types: ['GENERAL'] });
        }
    }, [editingCategory, open, form]);

    // Handle form submission
    function onSubmit(values) {
        // Type annotation removed
        setIsPending(true);
        const data = {
            name: values.name,
            types: values.types,
        };
        // Create or update API call
        try {
            if (editingCategory) {
                (async () => {
                    const result = await updateCategoryById(
                        editingCategory?.id,
                        data
                    );
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
                    const result = await createNewCategory(data);
                    if (result?.success === true) {
                        toast.success('Category Added Successfully');
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
            toast.error('An Error Accoured! Please try again');
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Sheet
            open={open}
            onOpenChange={() => {
                onOpenChange(false);
                setEditingCategory(null);
            }}>
            <SheetContent className='sm:max-w-xl p-4 rounded-lg'>
                <SheetHeader>
                    <SheetTitle>
                        {editingCategory ? 'Edit Category' : 'Add New Category'}
                    </SheetTitle>
                    <SheetDescription>
                        {editingCategory
                            ? 'Update category details. Slug will be automatically generated from the name.'
                            : 'Add a new category. Slug will be automatically generated from the name.'}
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
                                                placeholder='Category name'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            This will be used to generate the
                                            slug.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='space-y-3'>
                                <FormLabel>Category Types</FormLabel>
                                <FormDescription>
                                    Select all places where this category should
                                    appear. For example, &quot;Extreme&quot;
                                    could be both a Tour Type and a Difficulty
                                    Level.
                                </FormDescription>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                    {CategoryTypesArray.map((type, index) => (
                                        <FormField
                                            key={index}
                                            control={form.control}
                                            name='types'
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={type}
                                                        className='flex flex-row items-start space-x-3 space-y-0'>
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(
                                                                    type.value // Type assertion removed
                                                                )}
                                                                onCheckedChange={checked => {
                                                                    return checked
                                                                        ? field.onChange(
                                                                              [
                                                                                  ...field.value,
                                                                                  type.value,
                                                                              ]
                                                                          )
                                                                        : field.onChange(
                                                                              field.value?.filter(
                                                                                  value =>
                                                                                      value !==
                                                                                      type.value
                                                                              )
                                                                          );
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className='font-normal'>
                                                            {formatKey(
                                                                type.value
                                                            )}
                                                        </FormLabel>
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                    ))}
                                </div>
                                <FormMessage>
                                    {form.formState.errors.types?.message}
                                </FormMessage>
                            </div>

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
                                        : editingCategory
                                        ? 'Update Category'
                                        : 'Create Category'}
                                </Button>
                            </SheetFooter>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    );
}

