'use client';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Controller } from 'react-hook-form';

export const SwitchField = ({
    id,
    label,
    description,
    control,
    onSaveField,
    isSaving }) => {
    return (
        <div className='flex items-center justify-between py-2'>
            <div className='space-y-0.5'>
                <Label htmlFor={id} className='text-foreground'>{label}</Label>
                {description && (
                    <p className='text-sm text-muted-foreground'>{description}</p>
                )}
            </div>
            <Controller
                name={id}
                control={control}
                render={({ field }) => (
                    <Switch
                        id={id}
                        checked={field.value}
                        onCheckedChange={checked => {
                            field.onChange(checked);
                            onSaveField(id, checked);
                        }}
                        disabled={isSaving}
                    />
                )}
            />
        </div>
    );
};

