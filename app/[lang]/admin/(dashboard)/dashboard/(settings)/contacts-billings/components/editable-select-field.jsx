'use client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Controller } from 'react-hook-form';

export const EditableSelectField = ({
    id,
    label,
    control,
    options,
    defaultValue = '',
    editingField,
    setEditingField,
    onSaveField,
    isSaving,
    resetField }) => {
    const isEditing = editingField === id;

    const handleSelectOpen = () => {
        if (!isEditing) {
            setEditingField(id);
        }
    };

    return (
        <div className='mb-6'>
            <Label
                htmlFor={id}
                className='text-sm font-medium text-foreground mb-2 block'>
                {label}
            </Label>
            <div className='flex relative flex-col items-start gap-3'>
                <Controller
                    name={id}
                    control={control}
                    defaultValue={defaultValue}
                    render={({ field }) => (
                        <Select
                            disabled={isSaving}
                            onValueChange={field.onChange}
                            onOpenChange={open => {
                                if (open) {
                                    handleSelectOpen();
                                }
                            }}
                            value={field.value}>
                            <SelectTrigger
                                className='w-full h-10 px-3 py-2 rounded-lg
                                bg-background border border-input
                                text-foreground placeholder:text-muted-foreground
                                transition-all duration-200
                                focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                                focus:border-input
                                disabled:opacity-50 disabled:cursor-not-allowed
                                hover:border-ring'>
                                <SelectValue
                                    placeholder={`Select ${label.toLowerCase()}`}
                                />
                            </SelectTrigger>
                            <SelectContent className='bg-popover border-input'>
                                {options.map(option => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                        className='focus:bg-accent focus:text-accent-foreground'>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />

                {isEditing && (
                    <div className='flex gap-2 animate-in fade-in slide-in-from-right-2 duration-200 mt-2'>
                        <Button
                            type='button'
                            size='sm'
                            onClick={() => onSaveField(id)}
                            disabled={isSaving}
                            className='transition-all duration-200 hover:scale-105 active:scale-95'>
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => {
                                resetField(id);
                                setEditingField(null);
                            }}
                            disabled={isSaving}
                            className='transition-all duration-200 hover:scale-105 active:scale-95'>
                            Cancel
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
