import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
    ArrowDown01Icon,
    ArrowUp01Icon,
    Delete02Icon,
    PlusSignIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import useCategoryTypesData from '../../../../../../../../../hooks/use-category-types-data';
import { CATEGORY_TYPES } from '../../../categories/constants/category-types';

export function CustomizationForm() {
    const { control, getValues, setValue, watch, trigger } = useFormContext();

    // Get Customisation Category Data
    const { isLoading, data, error } = useCategoryTypesData(
        CATEGORY_TYPES.CUSTOMISATION
    );

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'additionals',
    });

    // Array to track open states for each customization option
    const [openStates, setOpenStates] = useState([]);

    // Watch all additionals to trigger re-renders
    const watchedAdditionals = watch('additionals');

    // Sync openStates length with fields length
    useEffect(() => {
        setOpenStates(prev => {
            const newStates = [...prev];
            while (newStates.length < fields.length) {
                newStates.push(false);
            }
            while (newStates.length > fields.length) {
                newStates.pop();
            }
            return newStates;
        });
    }, [fields.length]);

    // Function to toggle a specific customization option's open state
    const toggleOpen = index => {
        setOpenStates(prev => {
            const newState = [...prev];
            newState[index] = !newState[index];
            return newState;
        });
    };

    // Add a new customization option at the top
    const addAdditionalOptions = () => {
        // Insert at the beginning (index 0) instead of appending
        const newOption = {
            name: '',
            description: '',
            priceImpact: 0,
            isExtra: true, // Changed to true by default
        };

        // Insert the new field at the beginning
        const currentFields = getValues('additionals') || [];
        setValue('additionals', [...currentFields, newOption]);

        // Update open states - add true at the end and close others
        setOpenStates(prev => [...prev, true]);

        // Force register and set the field value for the new first item
        setTimeout(() => {
            setValue(`additionals.0.isExtra`, true, {
                // Changed to true
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
            });
            trigger(`additionals.0.isExtra`);
        }, 100);
    };

    return (
        <>
            <Card className='border-none shadow-md'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/50 rounded-t-lg'>
                    <CardTitle>Additional Options</CardTitle>
                </CardHeader>
                <CardContent className='space-y-8 pt-6 px-6'>
                    <p className='text-sm text-muted-foreground'>
                        Specify ways that guests can customize or personalize
                        their trip experience beyond the predefined options
                        above.
                    </p>

                    {fields.map((field, index) => {
                        // Get current values for this specific field
                        const currentValues = watchedAdditionals?.[index] || {};

                        return (
                            <Collapsible
                                key={field.id}
                                open={openStates[index] || false}
                                onOpenChange={() => toggleOpen(index)}
                                className='border border-border rounded-lg overflow-hidden shadow-sm mb-6'>
                                <CollapsibleTrigger asChild>
                                    <div className='w-full bg-muted/50 p-4 flex justify-between items-center cursor-pointer hover:bg-muted transition-colors'>
                                        <h3 className='font-medium text-foreground flex items-center'>
                                            <span className='flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-primary/20 text-primary font-semibold text-sm'>
                                                {index + 1}
                                            </span>
                                            {currentValues.name ||
                                                `Additional Option ${
                                                    index + 1
                                                }`}
                                        </h3>
                                        <div className='flex justify-center items-center'>
                                            {openStates[index] ? (
                                                <HugeiconsIcon
                                                    icon={ArrowDown01Icon}
                                                    className='w-5 h-5 text-muted-foreground'
                                                />
                                            ) : (
                                                <HugeiconsIcon
                                                    icon={ArrowUp01Icon}
                                                    className='w-5 h-5 text-muted-foreground'
                                                />
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
                                                className='h-8 w-8 p-0 ml-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10'>
                                                <HugeiconsIcon
                                                    icon={Delete02Icon}
                                                    className='h-4 w-4'
                                                />
                                            </Button>
                                        </div>
                                    </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <div className='p-5 space-y-6 bg-background'>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                            <FormField
                                                key={`${field.id}-name`}
                                                control={control}
                                                name={`additionals.${index}.name`}
                                                render={({
                                                    field: nameField,
                                                }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Name{' '}
                                                            <span className='text-destructive'>
                                                                *
                                                            </span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder='e.g. Private Guide Option'
                                                                {...nameField}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Custom Switch Implementation */}
                                            <div className='flex flex-row items-center justify-between rounded-lg border border-border p-4'>
                                                <div>
                                                    <div className='text-base font-medium'>
                                                        Show in Extra
                                                    </div>
                                                    <div className='text-sm text-muted-foreground'>
                                                        Enable if the option is
                                                        an extra and available
                                                        for additional cost
                                                    </div>
                                                </div>
                                                <Switch
                                                    checked={Boolean(
                                                        currentValues.isExtra
                                                    )}
                                                    onCheckedChange={checked => {
                                                        setValue(
                                                            `additionals.${index}.isExtra`,
                                                            checked,
                                                            {
                                                                shouldDirty: true,
                                                                shouldTouch: true,
                                                                shouldValidate: true,
                                                            }
                                                        );

                                                        // Force trigger to ensure the change is registered
                                                        trigger(
                                                            `additionals.${index}.isExtra`
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <FormField
                                            key={`${field.id}-description`}
                                            control={control}
                                            name={`additionals.${index}.description`}
                                            render={({ field: descField }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Description{' '}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder='Describe this customization option'
                                                            rows={3}
                                                            {...descField}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            key={`${field.id}-price`}
                                            control={control}
                                            name={`additionals.${index}.priceImpact`}
                                            render={({ field: priceField }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Price Impact
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='number'
                                                            min={0}
                                                            placeholder='Set the price'
                                                            {...priceField}
                                                            value={
                                                                priceField.value ===
                                                                    null ||
                                                                priceField.value ===
                                                                    undefined
                                                                    ? ''
                                                                    : priceField.value
                                                            }
                                                            onChange={e => {
                                                                const value =
                                                                    e.target
                                                                        .value;
                                                                priceField.onChange(
                                                                    value === ''
                                                                        ? 0
                                                                        : parseInt(
                                                                              value,
                                                                              10
                                                                          )
                                                                );
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        );
                    })}

                    {fields.length === 0 && (
                        <div className='text-center p-8 border border-dashed border-border rounded-md'>
                            <p className='text-muted-foreground'>
                                No additional options added yet.
                            </p>
                            <Button
                                type='button'
                                onClick={addAdditionalOptions}
                                variant='outline'
                                className='mt-2'>
                                <HugeiconsIcon
                                    icon={PlusSignIcon}
                                    className='h-4 w-4 mr-2'
                                />
                                Add First Additional Option
                            </Button>
                        </div>
                    )}
                    {fields.length > 0 && (
                        <Button
                            type='button'
                            onClick={addAdditionalOptions}
                            size='sm'
                            variant='outline'>
                            <HugeiconsIcon
                                icon={PlusSignIcon}
                                className='h-4 w-4 mr-2'
                            />
                            Add More Additional Option
                        </Button>
                    )}
                </CardContent>
            </Card>
        </>
    );
}

