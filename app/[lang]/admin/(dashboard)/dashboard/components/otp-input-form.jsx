'use client';
import { sendOtpInEmail, verifyOtp } from '@/app/_actions/otpActions';
import { updateUserInformationById } from '@/app/_actions/userActions';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useVerification } from '@/hooks/use-verification';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

function OtpInputForm({ showModal, setShowModal, showToast = true }) {
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [timeLeft, setTimeLeft] = useState(120);
    const { data: session } = useSession();
    const [error, setError] = useState(null);
    const { isVerified, setIsVerified } = useVerification();

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
        if (session?.user?.email) {
            const result = await verifyOtp(session.user.email, otp.join(''));

            if (result.success === true) {
                const result = await updateUserInformationById(
                    session?.user?.id,
                    {
                        isVerified: true });

                if (result?.success === true) {
                    toast.success('Email verified successfully', {
                        style: {
                            backgroundColor: 'rgba(16, 185, 129, 0.7)',
                            color: '#fff',
                        } });

                    setIsVerified(true);
                    setShowModal(false);
                } else {
                    setError('Invalid OTP provided');
                }
            } else {
                setError('Invalid OTP provided');
            }
        }
    };

    const handleResend = async () => {
        setOtp(Array(6).fill(''));
        setTimeLeft(120);
        setError(null);
        if (session?.user?.email) {
            await sendOtpInEmail(session.user.email);
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
        <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent
                className='sm:max-w-md z-[99999]'
                style={{ zIndex: 99999 }}
                onInteractOutside={e => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className='text-lg font-semibold text-center'>
                        Enter OTP
                    </DialogTitle>
                    <DialogDescription className='text-sm text-center text-gray-500'>
                        We&apos;ve sent a 6-digit code to your email address
                    </DialogDescription>
                </DialogHeader>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className='space-y-6'>
                    <div className='flex justify-center gap-3'>
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
                                className='w-12 h-12 text-center border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary'
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleVerify}
                        disabled={!canVerify}
                        className={`w-full py-2 rounded-xl cursor-pointer transition-all ${
                            canVerify
                                ? 'bg-primary text-white hover:bg-primary/80'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}>
                        Verify OTP
                    </button>

                    <button
                        onClick={handleResend}
                        disabled={!canResend}
                        className={`w-full py-2 cursor-pointer rounded-xl transition-all ${
                            canResend
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}>
                        Resend OTP
                    </button>

                    {error && (
                        <p className='text-red-500 text-sm text-center'>
                            {error}
                        </p>
                    )}

                    <div className='text-center text-sm text-gray-500'>
                        {canResend
                            ? 'Time expired'
                            : `Time remaining: ${timeLeft}s`}
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}

export default OtpInputForm;

