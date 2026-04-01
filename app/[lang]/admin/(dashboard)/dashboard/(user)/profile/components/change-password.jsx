'use client';

import PasswordFiled from '@/app/[lang]/(frontend)/(auth)/components/FormInputFields/password-field';
import { changeUserPassword } from '@/app/_actions/userActions';
import Spinner from '@/components/svg/spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const ChangePassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = async data => {
        clearErrors('global');
        setIsLoading(true);
        try {
            const result = await changeUserPassword(
                data.old_password,
                data.new_password
            );

            if (result?.success === true) {
                reset();
                setIsLoading(false);
                toast.success('Password Changed Successfully', {
                    style: {
                        backgroundColor: 'rgba(34, 197, 94, 0.9)',
                        color: '#fff',
                    } });
            }
            if (result?.success === false || result?.error) {
                setIsLoading(false);
                setError('global', {
                    type: 'manual',
                    message: 'Wrong old password' });
                setAlert(true);
            }
        } catch (error) {
            setIsLoading(false);
            setError('global', {
                type: 'manual',
                message: 'There was an error, please try again' });
            setAlert(true);
        }
    };

    return (
        <Card className='border-border bg-card'>
            <CardHeader>
                <CardTitle className='text-foreground'>
                    Change Password
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {alert && (
                        <div className='mb-6 bg-destructive/10 border border-destructive/30 px-4 py-3 rounded-md shadow-sm flex justify-between gap-3 text-sm text-destructive relative'>
                            <div className='flex-1'>
                                <p className='font-medium'>
                                    {errors?.global?.message}
                                </p>
                            </div>
                            <button
                                type='button'
                                onClick={() => {
                                    setAlert(false);
                                    clearErrors('global');
                                }}
                                className='text-destructive/60 hover:text-destructive transition duration-200'
                                aria-label='Dismiss error'>
                                <X className='w-5 h-5' />
                            </button>
                        </div>
                    )}

                    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
                        {/* Old Password */}
                        <div className='space-y-2'>
                            <label className='text-sm font-semibold text-foreground block'>
                                Old Password
                            </label>
                            <PasswordFiled
                                placeholder='Enter your old password'
                                register={register('old_password', {
                                    required: 'Old password is required',
                                    minLength: {
                                        value: 8,
                                        message:
                                            'Password should be at least 8 characters',
                                    },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
                                        message:
                                            'Password must contain at least 1 uppercase, 1 lowercase, and 1 number',
                                    } })}
                                error={errors?.old_password}
                            />
                            {errors?.old_password && (
                                <p className='text-xs font-medium text-destructive'>
                                    {errors.old_password.message}
                                </p>
                            )}
                        </div>

                        {/* New Password */}
                        <div className='space-y-2'>
                            <label className='text-sm font-semibold text-foreground block'>
                                New Password
                            </label>
                            <PasswordFiled
                                placeholder='Enter your new password'
                                register={register('new_password', {
                                    required: 'New password is required',
                                    minLength: {
                                        value: 8,
                                        message:
                                            'Password should be at least 8 characters',
                                    },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
                                        message:
                                            'Password must contain at least 1 uppercase, 1 lowercase, and 1 number',
                                    } })}
                                error={errors?.new_password}
                            />
                            {errors?.new_password && (
                                <p className='text-xs font-medium text-destructive'>
                                    {errors.new_password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className='space-y-2'>
                            <label className='text-sm font-semibold text-foreground block'>
                                Confirm Password
                            </label>
                            <PasswordFiled
                                placeholder='Confirm your new password'
                                register={register('confirm_password', {
                                    required: 'Please confirm your password',
                                    minLength: {
                                        value: 8,
                                        message:
                                            'Password should be at least 8 characters',
                                    },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
                                        message:
                                            'Password must contain at least 1 uppercase, 1 lowercase, and 1 number',
                                    },
                                    validate: value =>
                                        watch('new_password') === value ||
                                        'Passwords do not match' })}
                                error={errors?.confirm_password}
                            />
                            {errors?.confirm_password && (
                                <p className='text-xs font-medium text-destructive'>
                                    {errors.confirm_password.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className='mt-8'>
                        <Button
                            type='submit'
                            disabled={isLoading}
                            className='bg-primary hover:bg-primary/90 text-primary-foreground
                            transition-all duration-200 flex items-center gap-2'>
                            {isLoading ? <Spinner /> : null}
                            {isLoading ? 'Updating...' : 'Update Password'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default ChangePassword;

