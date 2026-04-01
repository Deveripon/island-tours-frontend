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
    FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Agreement02Icon, ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ImageUploadWithSelector } from '../../../components/common/image-upload-selector';

const PartnerSection = ({
    control,
    editingField,
    setEditingField,
    handleSaveField,
    isSaving,
    resetField,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const { watch, getValues, setValue } = useFormContext();
    const initialPartnersRef = useRef(null);
    const lastSavedPartnersRef = useRef(null);

    // Watch the partners field for changes
    const currentPartners = watch('partners');

    // Initialize the ref with the initial form value on mount
    useEffect(() => {
        const initialValue = getValues('partners') || [];
        initialPartnersRef.current = JSON.stringify(initialValue);
        lastSavedPartnersRef.current = JSON.stringify(initialValue);
    }, [getValues]); // Only run once on mount

    // Detect changes by comparing imageIds
    useEffect(() => {
        if (lastSavedPartnersRef.current !== null) {
            const currentImageIds = (currentPartners || [])
                .map(p => p.imageId || p.image?.id)
                .filter(Boolean)
                .sort();

            const savedPartners = JSON.parse(lastSavedPartnersRef.current);
            const savedImageIds = (savedPartners || [])
                .map(p => p.imageId || p.image?.id)
                .filter(Boolean)
                .sort();

            const hasChanged =
                JSON.stringify(currentImageIds) !==
                JSON.stringify(savedImageIds);
            setHasChanges(hasChanged);
        }
    }, [currentPartners]);

    const updatePartnerImage = async () => {
        setValue('partners', currentPartners);
        console.log('currentPartners', currentPartners);
        // Call the parent's save handler
        await handleSaveField('partners');

        // Update the last saved reference to the current state
        lastSavedPartnersRef.current = JSON.stringify(currentPartners || []);

        // Reset the changes flag immediately
        setHasChanges(false);
    };

    const handleReset = () => {
        // Parse and reset to last saved value
        const lastSavedValue = JSON.parse(lastSavedPartnersRef.current);
        resetField('partners', { defaultValue: lastSavedValue });
        setHasChanges(false);
    };

    return (
        <Card className='p-0 overflow-hidden'>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CardHeader className='flex justify-between items-center h-[64px]'>
                    <CollapsibleTrigger className='flex items-center  justify-between w-full hover:no-underline'>
                        <CardTitle className='flex items-center gap-2'>
                            <HugeiconsIcon icon={Agreement02Icon} size={20} />
                            Partner Logos
                            {hasChanges && (
                                <span className='ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full'>
                                    Unsaved changes
                                </span>
                            )}
                        </CardTitle>
                        <div className='hover:bg-accent p-2 transform transition duration-200 flex items-center gap-2 rounded-full'>
                            <HugeiconsIcon
                                icon={ArrowDown01Icon}
                                size={16}
                                className={cn(
                                    'transition-transform duration-200',
                                    isOpen && 'rotate-180'
                                )}
                            />
                        </div>
                    </CollapsibleTrigger>
                </CardHeader>

                <CollapsibleContent className='py-4'>
                    <CardContent className='space-y-6'>
                        <FormField
                            control={control}
                            name='partners'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <ImageUploadWithSelector
                                            fieldName='partners'
                                            value={field.value}
                                            onChange={field.onChange}
                                            multiple={true}
                                            maxFiles={50}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Save/Cancel Buttons */}
                        {hasChanges && (
                            <div className='flex justify-end gap-2 pt-4 border-t'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={handleReset}
                                    disabled={isSaving}>
                                    Cancel
                                </Button>
                                <Button
                                    type='button'
                                    onClick={updatePartnerImage}
                                    disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
};

export default PartnerSection;

