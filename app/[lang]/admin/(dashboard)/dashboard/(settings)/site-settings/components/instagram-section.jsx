import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
    Alert01Icon,
    ArrowDown01Icon,
    InstagramIcon,
    LinkSquare02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';
import { useController } from 'react-hook-form';
import { toast } from 'sonner';

const InstagramSection = ({
    control,
    editingField,
    setEditingField,
    handleSaveField,
    isSaving,
    resetField,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const { field: enableField } = useController({
        name: 'enableInstagram',
        control,
    });

    const { field: idField, fieldState: idState } = useController({
        name: 'instagramWidgetId',
        control,
        rules: {
            pattern: {
                value: /^elfsight-app-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
                message:
                    'Invalid Elfsight App ID format. Example: elfsight-app-e9627a35-6741-4886-9f78-84751c5b2ee0',
            },
        },
    });

    const handleSave = async () => {
        if (enableField.value && !idField.value) {
            toast.error('Please enter an Elfsight App ID');
            return;
        }

        if (idState.error) {
            toast.error(idState.error.message);
            return;
        }

        try {
            await handleSaveField('enableInstagram', enableField.value);
            if (enableField.value) {
                await handleSaveField('instagramWidgetId', idField.value);
            }
        } catch (error) {
            toast.error('Failed to save Instagram settings');
        }
    };

    return (
        <Card className='p-0 overflow-hidden'>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CardHeader className='flex items-center justify-between h-[64px]'>
                    <CollapsibleTrigger className='flex  items-center justify-between w-full hover:no-underline'>
                        <CardTitle className='flex items-center gap-2'>
                            <HugeiconsIcon icon={InstagramIcon} size={20} />
                            Instagram Integration
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
                    <CardContent className='space-y-6 mt-2'>
                        {/* Enable Instagram Toggle */}
                        <div className='flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950'>
                            <div className='flex items-center gap-3'>
                                <div className='p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg'>
                                    <HugeiconsIcon
                                        icon={InstagramIcon}
                                        size={20}
                                        className='text-white'
                                    />
                                </div>
                                <div>
                                    <Label
                                        htmlFor='instagram-toggle'
                                        className='cursor-pointer font-semibold'>
                                        Display Instagram Feed
                                    </Label>
                                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                                        Show your Instagram posts on your
                                        website via Elfsight
                                    </p>
                                </div>
                            </div>
                            <Switch
                                id='instagram-toggle'
                                checked={enableField.value}
                                onCheckedChange={checked => {
                                    enableField.onChange(checked);
                                    handleSaveField('enableInstagram', checked);
                                }}
                            />
                        </div>

                        {enableField.value && (
                            <div className='space-y-6 animate-in slide-in-from-top-2'>
                                {/* Setup Instructions Alert */}
                                <Alert>
                                    <HugeiconsIcon
                                        icon={Alert01Icon}
                                        size={16}
                                    />
                                    <AlertTitle>Setup Required</AlertTitle>
                                    <AlertDescription className='space-y-2'>
                                        <p>
                                            To integrate Instagram, you need to:
                                        </p>
                                        <ol className='list-decimal list-inside space-y-1 text-sm ml-2'>
                                            <li>
                                                Go to create an Instagram Feed
                                                widget at{' '}
                                                <a
                                                    href='https://dash.elfsight.com/catalog?create=true'
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='text-blue-600 hover:underline inline-flex items-center gap-1'>
                                                    elfsight.com{' '}
                                                    <HugeiconsIcon
                                                        icon={LinkSquare02Icon}
                                                        size={12}
                                                    />
                                                </a>
                                            </li>
                                            <li>
                                                Select the Instagram Feed widget
                                                and click
                                            </li>
                                            <li>
                                                Choose Profile Widget template
                                            </li>
                                            <li>
                                                Modify the widget settings and
                                                Publish
                                            </li>
                                            <li>
                                                Copy the widget ID (e.g.,
                                                elfsight-app-e9627a35-6741-4886-9f7....)
                                            </li>
                                            <li>Paste the ID below</li>
                                        </ol>
                                    </AlertDescription>
                                </Alert>

                                {/* Widget ID Input */}
                                <div className='space-y-3'>
                                    <Label htmlFor='widget-id'>
                                        Elfsight Widget ID
                                    </Label>
                                    <div className='flex flex-col gap-2'>
                                        <Input
                                            id='widget-id'
                                            placeholder='elfsight-app-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
                                            value={idField.value || ''}
                                            onChange={idField.onChange}
                                            className={cn(
                                                idState.error &&
                                                    'border-red-500'
                                            )}
                                        />
                                        {idState.error && (
                                            <p className='text-sm text-red-500'>
                                                {idState.error.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className='flex justify-end pt-4 border-t'>
                                    <Button
                                        type='button'
                                        onClick={handleSave}
                                        disabled={isSaving}>
                                        {isSaving
                                            ? 'Saving...'
                                            : 'Save Instagram Settings'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
};

export default InstagramSection;

