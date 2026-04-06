'use client';
import { createInquery } from '@/app/_actions/inqueryActions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    AlertCircleIcon,
    CheckmarkCircle02Icon,
    SentIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const contactSchema = z.object({
    name: z.string().optional(),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    subject: z.string().min(1, 'Subject is required'),
    message: z
        .string()
        .min(1, 'Message is required')
        .min(10, 'Please Describe your message at least 10 characters'),
});

export const ContactForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [serverError, setServerError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            email: '',
            subject: '',
            message: '',
        },
    });

    const onSubmit = async data => {
        setIsSubmitting(true);
        setServerError('');

        try {
            const res = await createInquery({
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message,
            });

            if (res?.success) {
                setIsSubmitted(true);
                reset();

                // Reset success state after 3 seconds
                setTimeout(() => setIsSubmitted(false), 3000);
            } else {
                // Handle server error
                setServerError(
                    res?.error || 'Failed to send message. Please try again.'
                );
            }
        } catch (error) {
            setServerError('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className='border border-border shadow-lg bg-card'>
            <CardHeader className='space-y-1'>
                <CardTitle className='text-lg font-medium text-foreground'>
                    Get in touch
                </CardTitle>
                <CardDescription className='text-base text-muted-foreground'>
                    Send us a message and we&apos;ll respond as soon as
                    possible.
                </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
                {isSubmitted && (
                    <Alert className='border-success/20 bg-success/10'>
                        <HugeiconsIcon
                            icon={CheckmarkCircle02Icon}
                            className='h-4 w-4 text-success'
                        />
                        <AlertDescription className='text-success'>
                            Message sent successfully! We&apos;ll get back to
                            you within 24 hours.
                        </AlertDescription>
                    </Alert>
                )}

                {serverError && (
                    <Alert className='border-destructive/20 bg-destructive/10'>
                        <HugeiconsIcon
                            icon={AlertCircleIcon}
                            className='h-4 w-4 text-destructive'
                        />
                        <AlertDescription className='text-destructive'>
                            {serverError}
                        </AlertDescription>
                    </Alert>
                )}

                <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <Label
                                htmlFor='name'
                                className='text-sm font-medium text-muted-foreground'>
                                Name
                            </Label>
                            <Input
                                id='name'
                                {...register('name')}
                                placeholder='Your name'
                                className='border-border focus:border-ring bg-background text-foreground transition-colors placeholder:text-muted-foreground'
                            />
                            {errors.name && (
                                <p className='text-sm text-destructive'>
                                    {errors.name.message}
                                </p>
                            )}
                        </div>
                        <div className='space-y-2'>
                            <Label
                                htmlFor='email'
                                className='text-sm font-medium text-muted-foreground'>
                                Email{' '}
                                <span className='text-destructive'>*</span>
                            </Label>
                            <Input
                                id='email'
                                type='email'
                                {...register('email')}
                                placeholder='your@email.com'
                                className='border-border focus:border-ring bg-background text-foreground transition-colors placeholder:text-muted-foreground'
                            />
                            {errors.email && (
                                <p className='text-sm text-destructive'>
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className='space-y-2'>
                        <Label
                            htmlFor='subject'
                            className='text-sm font-medium text-muted-foreground'>
                            Subject <span className='text-destructive'>*</span>
                        </Label>
                        <Input
                            id='subject'
                            {...register('subject')}
                            placeholder="What's this about?"
                            className='border-border focus:border-ring bg-background text-foreground transition-colors placeholder:text-muted-foreground'
                        />
                        {errors.subject && (
                            <p className='text-sm text-destructive'>
                                {errors.subject.message}
                            </p>
                        )}
                    </div>
                    <div className='space-y-2'>
                        <Label
                            htmlFor='message'
                            className='text-sm font-medium text-muted-foreground'>
                            Message <span className='text-destructive'>*</span>
                        </Label>
                        <Textarea
                            id='message'
                            {...register('message')}
                            rows={5}
                            placeholder='Tell us more...'
                            className='border-border focus:border-ring bg-background text-foreground transition-colors placeholder:text-muted-foreground'
                        />
                        {errors.message && (
                            <p className='text-sm text-destructive'>
                                {errors.message.message}
                            </p>
                        )}
                    </div>
                    <Button
                        type='submit'
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className='w-full cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground'>
                        {isSubmitting ? (
                            <>
                                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                                Sending...
                            </>
                        ) : (
                            <>
                                Send message
                                <HugeiconsIcon
                                    icon={SentIcon}
                                    className='ml-2 h-4 w-4'
                                />
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

