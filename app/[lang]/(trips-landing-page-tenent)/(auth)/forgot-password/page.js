'use client';

import {
    getCustomerByEmail,
    sendOtpToCustomerEmail,
} from '@/app/_actions/customerActions';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import OTPInputForPassword from './components/otp-input-for-password';
import ResetPassword from './components/reset-password';

const ForgotPasswordPage = () => {
    //opt modal states
    const [showModal, setShowModal] = useState(false);
    const [isVerified, setIsVerified] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState(null);
    //react hook form code
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm();

    const onSubmit = async data => {
        setIsLoading(true);
        try {
            const response = await getCustomerByEmail(data.email);

            setIsLoading(false);
            if (response?.success === true) {
                setShowModal(true);
                setEmail(response.user?.email);
                const result = await sendOtpToCustomerEmail(
                    response.user.email
                );
            } else {
                setError('global', {
                    type: 'manual',
                    message: 'Seems this email is incorrect!' });
            }
        } catch (error) {
            setError('global', {
                type: 'manual',
                message: 'Seems this email is incorrect!' });
        }
    };

    return (
        <div className='flex min-h-svh bg-muted w-full items-center justify-center p-6 md:p-10'>
            {/* confirm modal */}
            {showModal && (
                <OTPInputForPassword
                    email={email}
                    setIsVerified={setIsVerified}
                    showModal={showModal}
                    setShowModal={setShowModal}
                />
            )}

            {isVerified === 'verified' ? (
                email && <ResetPassword email={email} />
            ) : (
                <div className='send-otp-to-email w-full flex items-center p-6'>
                    <div className='w-[390px] mx-auto p-6 bg-background rounded-md flex flex-col'>
                        <h2 className='text-[22px] font-bold mb-2'>
                            Forgot Password
                        </h2>
                        <p className='text-[14px] font-light mb-3 '>
                            Input your email address to get OTP for reset
                            password
                        </p>
                        <form
                            className='flex flex-col gap-3'
                            onSubmit={handleSubmit(onSubmit)}>
                            {/* Email */}
                            <div>
                                <label className='text-sm font-medium'>
                                    Email address
                                </label>
                                <Input
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address',
                                        } })}
                                    placeholder='Enter your email address'
                                    className='mt-1'
                                    onChange={() => {
                                        clearErrors('global');
                                    }}
                                />
                                {errors.email && (
                                    <p className='error text-destructive text-[12px] mt-2'>
                                        {errors.email.message}
                                    </p>
                                )}
                                {errors.global && (
                                    <p className='error text-destructive text-[12px] mt-2'>
                                        {errors.global.message}
                                    </p>
                                )}
                            </div>
                            {/* Submit button */}
                            <div>
                                <button
                                    type='submit'
                                    className='mt-1 p-3 bg-primary hover:bg-primary/90 transition-all duration-150 text-primary-foreground w-full rounded-full cursor-pointer'>
                                    Sent Code
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForgotPasswordPage;

