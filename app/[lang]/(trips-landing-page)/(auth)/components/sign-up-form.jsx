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


import Spinner from '@/components/svg/spinner';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';

import { handleCustomerSignup } from '@/app/_actions/customerActions';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
export function SignUpForm({ className, ...props }) {
    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Sign up</CardTitle>
                    <CardDescription>
                        Enter your email below to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RegisterForm />
                    <div className='mt-4 text-center text-sm'>
                        Already have an account?{' '}
                        <Link
                            href='/sign-in'
                            className='underline underline-offset-4'>
                            Sign In
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

const RegisterForm = () => {
    const {
        register,
        handleSubmit,
        watch,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(false);
    const router = useRouter();

    // registration submit handler
    const onSubmit = async formData => {
        try {
            clearErrors('global');
            setIsLoading(true);
            const { email, password } = formData;
            const response = await handleCustomerSignup({
                email,
                password,
                role: 'TRAVELLER' });

            if (response?.success === false || response?.error) {
                setIsLoading(false);
                setError('global', {
                    type: 'manual',
                    message: response.error?.message });
                setAlert(true);
            }

            if (response.success === true) {
                setIsLoading(false);
                router.push('/sign-in');
            }
        } catch (error) {
            setIsLoading(false);
            setError('global', {
                type: 'manual',
                message: 'There was an error while Register,Please try again' });
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

                <Input
                    type="password"
                    placeholder="Password"
                    {...register('password', {
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
                        }
                    })}
                    className={cn(
                        'mt-1',
                        errors.password ? 'focus-visible:ring-destructive border-destructive' : ''
                    )}
                />

                {errors?.password && (
                    <p className='text-sm text-destructive mt-1'>
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* confirm password */}
            <div>
                <label className='text-sm font-medium'>Confirm Password</label>

                <Input
                    type="password"
                    placeholder="Password"
                    {...register('confirm_password', {
                        required: 'Please confirm your password',
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
                        },
                        validate: value =>
                            watch('password') === value ||
                            'Password not matched'
                    })}
                    className={cn(
                        'mt-1',
                        errors.confirm_password ? 'focus-visible:ring-destructive border-destructive' : ''
                    )}
                />

                {errors?.confirm_password && (
                    <p className='text-sm text-destructive mt-1'>
                        {errors.confirm_password.message}
                    </p>
                )}
            </div>

            {/* submit button */}
            <div>
                <button
                    type='submit'
                    className='mt-1 flex justify-center items-center p-3 mx-auto text-center bg-primary hover:bg-primary/90 transition-all duration-150 text-primary-foreground w-full rounded-full cursor-pointer'>
                    {isLoading ? <Spinner /> : 'Sign Up'}
                </button>
            </div>
        </form>
    );
};

export default RegisterForm;

