'use client';
import {
    sendOtpToCustomerEmail,
    verifyCustomerOtp,
} from '@/app/_actions/customerActions';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

function OTPInputForPassword({
    showModal,
    setShowModal,
    setIsVerified,
    showToast = true,
    email }) {
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [timeLeft, setTimeLeft] = useState(120);
    const { data: session } = useSession();
    const [error, setError] = useState(null);
    // Timer countdown
    useEffect(() => {
        if (!showModal) return;

        if (timeLeft === 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, showModal]);

    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleVerify = async () => {
        if (otp.join('').length !== 6) return alert('Please enter 6-digit OTP');

        if (email) {
            const result = await verifyCustomerOtp(email, otp.join(''));

            if (result.success === true) {
                showToast &&
                    toast.success('verified successfully', {
                        style: {
                            backgroundColor: 'rgba(16, 185, 129, 0.7)',
                            color: '#fff',
                        } });
                setIsVerified('verified');
                setShowModal(false);
            } else {
                setError('Invalid OTP provided');
            }
        }
    };

    const handleResend = async () => {
        setOtp(Array(6).fill(''));
        setTimeLeft(120);
        if (email) {
            await sendOtpToCustomerEmail(email);
        }
    };

    const handleOTPPaste = e => {
        const paste = e.clipboardData.getData('text').trim();
        if (/^\d{6}$/.test(paste)) {
            e.preventDefault();
            const newOtp = paste.split('');
            setOtp(newOtp);

            // focus on the last input
            setTimeout(() => {
                document.getElementById(`otp-5`)?.focus();
            }, 0);
        }
    };

    const canVerify = otp.every(digit => digit !== '') && timeLeft > 0;
    const canResend = timeLeft === 0;

    return (
        <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
            <div className='wrapper relative'>
                <button
                    onClick={() => setShowModal(false)}
                    className='absolute cursor-pointer top-4 right-5'>
                    <HugeiconsIcon
                        icon={Cancel01Icon}
                        size={24}
                        className='text-foreground hover:text-muted-foreground transition'
                    />
                </button>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className='bg-background rounded-2xl p-8 w-full max-w-md shadow-lg'>
                    <h2 className='text-lg font-semibold text-center mb-4'>
                        Enter OTP
                    </h2>
                    <p className='text-sm text-center text-muted-foreground mb-6'>
                        We’ve sent a 6-digit code to your email address
                    </p>

                    <div className='flex justify-center gap-3 mb-6'>
                        {otp.map((digit, idx) => (
                            <input
                                key={idx}
                                id={`otp-${idx}`}
                                type='text'
                                value={digit}
                                onChange={e =>
                                    handleChange(e.target.value, idx)
                                }
                                // only first box listens to paste
                                onPaste={
                                    idx === 0
                                        ? e => handleOTPPaste(e)
                                        : undefined
                                }
                                maxLength={1}
                                className='w-12 h-12 text-center border border-input rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-ring'
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleVerify}
                        disabled={!canVerify}
                        className={`w-full py-2 rounded-xl cursor-pointer transition-all ${
                            canVerify
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}>
                        Verify OTP
                    </button>

                    <button
                        onClick={handleResend}
                        disabled={!canResend}
                        className={`w-full mt-3 py-2 cursor-pointer rounded-xl transition-all ${
                            canResend
                                ? 'bg-success text-success-foreground hover:bg-success/90'
                                : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}>
                        Resend OTP
                    </button>

                    {error && (
                        <p className='error text-destructive text-sm'>
                            Invalid OTP provided
                        </p>
                    )}

                    <div className='text-center mt-4 text-sm text-muted-foreground'>
                        {canResend
                            ? 'Time expired'
                            : `Time remaining: ${timeLeft}s`}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default OTPInputForPassword;

