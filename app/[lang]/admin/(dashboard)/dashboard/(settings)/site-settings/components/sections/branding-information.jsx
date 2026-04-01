import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { PaintBoardIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ImageUploadWithSelector } from '../../../../components/common/image-upload-selector';

const ColorPickerField = ({
    id,
    label,
    control,
    editingField,
    setEditingField,
    onSaveField,
    isSaving,
    validationRules,
    resetField,
    placeholder }) => {
    const { watch, setValue } = useFormContext();
    const colorValue = watch(id) || placeholder;
    const isEditing = editingField === id;
    const [showPalette, setShowPalette] = useState(false);

    const colorPalette = [
        '#3b82f6',
        '#6366f1',
        '#8b5cf6',
        '#ec4899',
        '#ef4444',
        '#f97316',
        '#f59e0b',
        '#eab308',
        '#84cc16',
        '#22c55e',
        '#10b981',
        '#14b8a6',
        '#06b6d4',
        '#0ea5e9',
        '#64748b',
        '#6b7280',
    ];

    const handlePaletteColorSelect = color => {
        setValue(id, color, { shouldValidate: true, shouldDirty: true });
        setEditingField(id);
        setShowPalette(false);
    };

    const isValidHex = hex => {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    };

    return (
        <FormField
            control={control}
            name={id}
            rules={validationRules}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className='text-sm text-muted-foreground'>
                        {label}
                    </FormLabel>
                    <div className='space-y-2'>
                        <FormControl>
                            <div className='relative'>
                                <div className='flex items-center gap-2 px-3 py-2 border border-input rounded-lg bg-background hover:border-ring transition-colors'>
                                    <input
                                        type='color'
                                        value={
                                            isValidHex(field.value)
                                                ? field.value
                                                : placeholder
                                        }
                                        onChange={e => {
                                            field.onChange(e.target.value);
                                            setEditingField(id);
                                        }}
                                        className='w-8 h-8 rounded cursor-pointer border-0'
                                    />
                                    <input
                                        type='text'
                                        {...field}
                                        onChange={e => {
                                            const value =
                                                e.target.value.startsWith('#')
                                                    ? e.target.value
                                                    : `#${e.target.value}`;
                                            field.onChange(value);
                                            setEditingField(id);
                                        }}
                                        placeholder={placeholder}
                                        className='flex-1 text-sm font-mono bg-transparent outline-none uppercase'
                                        maxLength={7}
                                    />
                                    <button
                                        type='button'
                                        onClick={() =>
                                            setShowPalette(!showPalette)
                                        }
                                        className='p-1 hover:bg-accent rounded transition-colors'>
                                        <HugeiconsIcon icon={PaintBoardIcon} size={16} className='text-muted-foreground' />
                                    </button>
                                </div>

                                {showPalette && (
                                    <div className='absolute z-10 mt-1 p-2 border border-border rounded-lg bg-card shadow-lg'>
                                        <div className='grid grid-cols-8 gap-1.5'>
                                            {colorPalette.map(color => (
                                                <button
                                                    key={color}
                                                    type='button'
                                                    onClick={() =>
                                                        handlePaletteColorSelect(
                                                            color
                                                        )
                                                    }
                                                    className='w-7 h-7 rounded border hover:scale-110 transition-transform'
                                                    style={{
                                                        backgroundColor: color,
                                                    }}
                                                    title={color}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </FormControl>
                        {isEditing && (
                            <div className='flex gap-2'>
                                <Button
                                    type='button'
                                    size='sm'
                                    onClick={() => {
                                        onSaveField(id);
                                        setShowPalette(false);
                                    }}
                                    disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save'}
                                </Button>
                                <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={() => {
                                        resetField(id);
                                        setEditingField(null);
                                        setShowPalette(false);
                                    }}
                                    disabled={isSaving}>
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

const BrandingInformation = ({
    control,
    editingField,
    setEditingField,
    handleSaveField,
    isSaving,
    resetField,
    formValidationRules,
    siteInfo }) => {
    const { watch } = useFormContext();
    const logo = watch('logo');
    const favicon = watch('favicon');
    const [prevLogo, setPrevLogo] = useState(siteInfo?.logo);
    const [prevFavicon, setPrevFavicon] = useState(siteInfo?.favicon);

    useEffect(() => {
        if (logo && logo?.imageId !== prevLogo?.imageId) {
            setEditingField('logo');
        }

        if (favicon && favicon?.imageId !== prevFavicon?.imageId) {
            setEditingField('favicon');
        }
    }, [
        favicon,
        logo,
        prevFavicon?.imageId,
        prevLogo?.imageId,
        setEditingField,
        editingField,
    ]);

    const isLogoEditing = editingField === 'logo';
    const isFaviconEditing = editingField === 'favicon';

    const handleLogoSave = () => {
        handleSaveField('logo');
        setPrevLogo(logo);
        setEditingField(null);
    };

    const handleLogoCancel = () => {
        resetField('logo');
        setEditingField(null);
    };

    const handleFaviconSave = () => {
        handleSaveField('favicon');
        setPrevFavicon(favicon);
        setEditingField(null);
    };

    const handleFaviconCancel = () => {
        resetField('favicon');
        setEditingField(null);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <HugeiconsIcon icon={PaintBoardIcon} size={20} />
                    Branding & Design
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6'>
                    <ColorPickerField
                        id='primaryColor'
                        label='Primary Color'
                        control={control}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                        validationRules={formValidationRules.primaryColor}
                        resetField={resetField}
                        placeholder='#3b82f6'
                    />

                    <ColorPickerField
                        id='secondaryColor'
                        label='Secondary Color'
                        control={control}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                        validationRules={formValidationRules.secondaryColor}
                        resetField={resetField}
                        placeholder='#64748b'
                    />

                    <ColorPickerField
                        id='accentColor'
                        label='Accent Color'
                        control={control}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        onSaveField={handleSaveField}
                        isSaving={isSaving}
                        validationRules={formValidationRules.accentColor}
                        resetField={resetField}
                        placeholder='#f59e0b'
                    />
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 mt-6'>
                    <div className='flex flex-col space-y-4'>
                        <FormField
                            control={control}
                            name='logo'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Site Logo</FormLabel>
                                    <FormControl>
                                        <ImageUploadWithSelector
                                            fieldName='logo'
                                            onChange={field.onChange}
                                            multiple={false}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Upload your logo
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {isLogoEditing && (
                            <div className='flex gap-2 animate-in fade-in slide-in-from-right-2 duration-200'>
                                <Button
                                    type='button'
                                    size='sm'
                                    onClick={handleLogoSave}
                                    disabled={isSaving}
                                    className='transition-all duration-200 hover:scale-105 active:scale-95'>
                                    {isSaving ? 'Saving...' : 'Save'}
                                </Button>
                                <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleLogoCancel}
                                    disabled={isSaving}
                                    className='transition-all duration-200 hover:scale-105 active:scale-95'>
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className='flex flex-col space-y-4'>
                        <FormField
                            control={control}
                            name='favicon'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Favicon</FormLabel>
                                    <FormControl>
                                        <ImageUploadWithSelector
                                            fieldName='favicon'
                                            onChange={field.onChange}
                                            multiple={false}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Upload favicon (16x16 or 32x32 px)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {isFaviconEditing && (
                            <div className='flex gap-2 animate-in fade-in slide-in-from-right-2 duration-200'>
                                <Button
                                    type='button'
                                    size='sm'
                                    onClick={handleFaviconSave}
                                    disabled={isSaving}
                                    className='transition-all duration-200 hover:scale-105 active:scale-95'>
                                    {isSaving ? 'Saving...' : 'Save'}
                                </Button>
                                <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={handleFaviconCancel}
                                    disabled={isSaving}
                                    className='transition-all duration-200 hover:scale-105 active:scale-95'>
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default BrandingInformation;

