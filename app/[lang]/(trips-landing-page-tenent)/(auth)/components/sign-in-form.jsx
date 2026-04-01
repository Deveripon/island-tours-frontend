'use client';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';

import PasswordFiled from '@/app/[lang]/(frontend)/(auth)/components/FormInputFields/password-field';
import Spinner from '@/components/svg/spinner';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { handleCustomerSignIn } from '@/app/_actions/customerActions';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
export function SignInForm({ className, ...props }) {
    const tenantId = props.tenantid;
    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CustomerLoginForm tenantId={tenantId} />
                    <div className='mt-4 text-center text-sm'>
                        Don&apos;t have an account?{' '}
                        <Link
                            href={`/site/${tenantId}/sign-up`}
                            className='underline underline-offset-4'>
                            Sign Up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

const CustomerLoginForm = ({ tenantId }) => {
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(false);
    const router = useRouter();
    const { data: session, status, update } = useSession();

    const onSubmit = async formData => {
        try {
            clearErrors('global');
            setIsLoading(true);
            const { email, password } = formData;

            const response = await handleCustomerSignIn({
                email,
                password,
                tenantId });

            if (!response?.success || response?.error) {
                setIsLoading(false);
                const errorMessage =
                    response?.error?.message ||
                    'Login failed. Please try again.';
                setError('global', {
                    type: 'manual',
                    message: errorMessage });
                setAlert(true);
                return;
            }

            // Login was successful - now get the session

            // Wait for NextAuth session to be established
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Force session update and get fresh session data
            const updatedSession = await update();

            // Use session data instead of response data
            const userId = updatedSession?.user?.id;

            setIsLoading(false);

            router.replace(`/site/${tenantId}/account`);
        } catch (error) {
            setIsLoading(false);
            setError('global', {
                type: 'manual',
                message:
                    'There was an error while signing in. Please try again.' });
            setAlert(true);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
            {alert && (
                <div className='global-error bg-destructive/10 border border-destructive/20 px-4 py-3 rounded-lg shadow-sm flex justify-between gap-3 text-sm text-destructive relative'>
                    <div className='flex-1'>
                        <p className=''>{errors?.global?.message}</p>
                    </div>
                    <button
                        onClick={() => {
                            setAlert(false);
                            clearErrors('global');
                        }}
                        className='text-destructive/60 cursor-pointer hover:text-destructive transition duration-200'
                        aria-label='Dismiss error'>
                        <HugeiconsIcon icon={Cancel01Icon} size={20} />
                    </button>
                </div>
            )}
            {/* email */}
            <div>
                <label className='text-sm font-medium'>Email address</label>
                <Input
                    {...register('email', {
                        required: 'Please provide an email address',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Please enter a valid email address',
                        } })}
                    onChange={() => {
                        (clearErrors('global'), setAlert(false));
                    }}
                    type='email'
                    placeholder='Enter your email address'
                    className={cn(
                        'mt-1',
                        errors.email
                            ? 'focus-visible:ring-destructive border-destructive'
                            : ''
                    )}
                />
                {errors?.email && (
                    <p className='text-sm text-destructive mt-1'>
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* password */}
            <div>
                <label className='text-sm font-medium'>Password</label>

                <PasswordFiled
                    placeholder='Password'
                    clearError={() => clearErrors('global')}
                    setAlert={() => setAlert(false)}
                    register={register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 8,
                            message: 'Password should be at least 8 characters',
                        },
                        maxLength: {
                            value: 100,
                            message:
                                'Password should not exceed 100 characters',
                        },
                        pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,100}$/,
                            message:
                                'Password must contain at least 1 uppercase, 1 lowercase, and 1 number',
                        } })}
                    error={errors?.password}
                />

                {errors?.password && (
                    <p className='text-sm text-destructive mt-1'>
                        {errors.password.message}
                    </p>
                )}
            </div>

            <div className='text-right'>
                <p className='text-[12px] pt-2 '>
                    <Link
                        href={`/site/${tenantId}/forgot-password`}
                        className='text-primary hover:text-primary/50 cursor-pointer '>
                        <i>Forgot password ?</i>
                    </Link>
                </p>
            </div>

            {/* submit button */}
            <div>
                <button
                    type='submit'
                    className='mt-1 flex justify-center items-center rounded-full p-3 mx-auto text-center bg-primary hover:bg-primary/90 transition-all duration-150 text-primary-foreground w-full cursor-pointer'>
                    {isLoading ? <Spinner /> : 'Sign In'}
                </button>
            </div>
        </form>
    );
};

export default SignInForm;

