'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Controller } from 'react-hook-form';

export const EditableTextField = ({
    id,
    label,
    control,
    defaultValue = '',
    editingField,
    setEditingField,
    onSaveField,
    isSaving,
    resetField,
    placeholder,
    validationRules = {} }) => {
    const isEditing = editingField === id;

    const handleInputClick = () => {
        if (!isEditing) {
            setEditingField(id);
        }
    };

    return (
        <div className='mb-6'>
            <Label
                htmlFor={id}
                className='text-sm font-semibold text-foreground mb-2 block'>
                {label}
            </Label>
            <div className='flex relative flex-col items-start gap-3'>
                <Controller
                    name={id}
                    control={control}
                    defaultValue={defaultValue}
                    rules={validationRules}
                    render={({ field, fieldState: { error } }) => (
                        <div className='w-full relative'>
                            <Input
                                id={id}
                                {...field}
                                disabled={isSaving}
                                onClick={handleInputClick}
                                onFocus={handleInputClick}
                                className={`
                                    w-full h-10 px-3 py-2 rounded-md
                                    bg-background border border-border
                                    text-foreground placeholder-muted-foreground
                                    transition-all duration-200
                                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                                    focus:border-primary
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    ${
                                        !isEditing
                                            ? 'cursor-pointer hover:border-primary/50'
                                            : ''
                                    }
                                    ${
                                        error
                                            ? 'border-destructive focus:ring-destructive'
                                            : ''
                                    }
                                `}
                                placeholder={placeholder}
                            />
                            {error && (
                                <p className='text-xs font-medium absolute bottom-[-22px] text-destructive'>
                                    {error.message}
                                </p>
                            )}
                        </div>
                    )}
                />

                {isEditing && (
                    <div className='flex gap-2 animate-in fade-in slide-in-from-right-2 duration-200 mt-2'>
                        <Button
                            type='button'
                            size='sm'
                            onClick={() => onSaveField(id)}
                            disabled={isSaving}
                            className='bg-primary hover:bg-primary/90 text-primary-foreground
                            transition-all duration-200 hover:scale-105 active:scale-95'>
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
                            className='border-border hover:bg-muted
                            transition-all duration-200 hover:scale-105 active:scale-95'>
                            Cancel
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
