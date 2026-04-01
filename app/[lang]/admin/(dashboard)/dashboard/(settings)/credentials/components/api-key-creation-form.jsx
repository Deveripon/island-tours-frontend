'use client';

import { generateApiKey } from '@/app/_actions/apiKeysActions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Copy01Icon,
    Key01Icon,
    SecurityCheckIcon,
    Tick02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// Form validation schema
const formSchema = z.object({
    label: z
        .string()
        .min(1, 'Label is required')
        .max(50, 'Label must be less than 50 characters') });

export function ApiKeyForm({ open, onOpenChange }) {
    const [isLoading, setIsLoading] = useState(false);
    const [generatedKey, setGeneratedKey] = useState(null);
    const [copied, setCopied] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: '',
        } });

    const handleSubmit = async data => {
        setIsLoading(true);

        try {
            const result = await generateApiKey({
                ...data });

            if (result?.success) {
                setGeneratedKey(result.result?.data?.key || result.result?.key);
                toast.success('API key generated successfully');
            } else {
                const errorMessage =
                    result?.error?.message || 'Failed to generate API key';
                toast.error(errorMessage);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyKey = async () => {
        if (!generatedKey) return;

        try {
            await navigator.clipboard.writeText(generatedKey);
            setCopied(true);
            toast.success('API key copied to clipboard');
            setTimeout(() => setCopied(false), 1000);
        } catch (error) {
            toast.error('Failed to copy API key');
        }
    };

    const handleClose = () => {
        form.reset();
        setGeneratedKey(null);
        setCopied(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
                <DialogHeader className='space-y-3'>
                    <div className='flex items-center gap-3'>
                        <div className='p-2 bg-primary/10 rounded-lg'>
                            <HugeiconsIcon
                                icon={Key01Icon}
                                size={20}
                                className='text-primary'
                            />
                        </div>
                        <div>
                            <DialogTitle className='text-md font-semibold'>
                                {generatedKey
                                    ? 'API Key Generated'
                                    : 'Create New API Key'}
                            </DialogTitle>
                            <DialogDescription className='text-xs'>
                                {generatedKey
                                    ? 'Your API key has been generated.'
                                    : 'Generate a new API key to access your account programmatically.'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {generatedKey ? (
                    // Success view with generated key
                    <div className='space-y-6 py-4'>
                        <Alert className='border-success/20 bg-success/10'>
                            <HugeiconsIcon
                                icon={SecurityCheckIcon}
                                size={16}
                                className='text-success'
                            />
                            <AlertDescription className='text-success'>
                                API key successfully generated! Copy it now and
                                store it securely.
                            </AlertDescription>
                        </Alert>

                        <div className='space-y-3'>
                            <div className='flex items-center justify-between'>
                                <label className='text-xs font-medium text-foreground'>
                                    Your API Key
                                </label>
                                <Badge variant='secondary' className='text-xs'>
                                    Copy to clipboard
                                </Badge>
                            </div>

                            <div className='relative'>
                                <code className='block w-full p-3 pr-12 text-xs font-mono bg-muted border border-border rounded-lg break-all'>
                                    {generatedKey}
                                </code>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    size='sm'
                                    onClick={handleCopyKey}
                                    className='absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-background'>
                                    {copied ? (
                                        <HugeiconsIcon
                                            icon={Tick02Icon}
                                            size={16}
                                            className='text-success'
                                        />
                                    ) : (
                                        <HugeiconsIcon
                                            icon={Copy01Icon}
                                            size={16}
                                            className='text-muted-foreground'
                                        />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Form view
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className='space-y-6 py-4'>
                            <FormField
                                control={form.control}
                                name='label'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-xs font-medium'>
                                            API Key Label *
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='e.g., Production API, Development Key'
                                                {...field}
                                                className='h-10'
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            A descriptive name to help you
                                            identify this API key.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Alert className='border-primary/20 bg-primary/10'>
                                <HugeiconsIcon
                                    icon={SecurityCheckIcon}
                                    size={16}
                                    className='text-primary'
                                />
                                <AlertDescription className='text-primary'>
                                    <strong>Security Note:</strong> API keys
                                    provide access to your account. Keep them
                                    secure and never share them in publicly
                                    accessible areas.
                                </AlertDescription>
                            </Alert>
                        </form>
                    </Form>
                )}

                <DialogFooter className='flex items-center justify-between pt-6 border-t'>
                    {generatedKey ? (
                        <div className='flex items-center justify-between w-full'>
                            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                                <HugeiconsIcon
                                    icon={Tick02Icon}
                                    size={16}
                                    className='text-success'
                                />
                                <span>API key generated successfully</span>
                            </div>
                            <div className='flex gap-3'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={handleCopyKey}
                                    className='gap-2'>
                                    {copied ? (
                                        <>
                                            <HugeiconsIcon
                                                icon={Tick02Icon}
                                                size={16}
                                            />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <HugeiconsIcon
                                                icon={Copy01Icon}
                                                size={16}
                                            />
                                            Copy Key
                                        </>
                                    )}
                                </Button>
                                <Button onClick={handleClose}>Done</Button>
                            </div>
                        </div>
                    ) : (
                        <div className='flex items-center justify-between w-full'>
                            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                                <HugeiconsIcon icon={Key01Icon} size={16} />
                                <span>Ready to generate your API key</span>
                            </div>
                            <div className='flex gap-3'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={handleClose}
                                    disabled={isLoading}>
                                    Cancel
                                </Button>
                                <Button
                                    type='submit'
                                    onClick={form.handleSubmit(handleSubmit)}
                                    disabled={isLoading}
                                    className='gap-2 min-w-[120px]'>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className='h-4 w-4 animate-spin' />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <HugeiconsIcon
                                                icon={Key01Icon}
                                                size={16}
                                            />
                                            Generate Key
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

