'use client';
import { sendOtpInEmail } from '@/app/_actions/otpActions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BellRing } from 'lucide-react';
import { useState } from 'react';
import OtpInputForm from './otp-input-form';

const NotificationWithOTPModal = ({ loggedInUser, className }) => {
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleOTPwithEmail = async () => {
        setIsLoading(true);
        try {
            if (loggedInUser?.user?.email) {
                await sendOtpInEmail(loggedInUser?.user?.email);
            }
            setShowModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Alert
                variant='default'
                className={cn(
                    'border-l-4 border-primary bg-muted/40 mb-4',
                    className
                )}>
                <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
                    <div className='flex items-start gap-3'>
                        <BellRing className='h-5 w-5 text-primary mt-0.5' />
                        <div>
                            <AlertTitle className='text-sm font-medium mb-1'>
                                Activate your account
                            </AlertTitle>
                            <AlertDescription className='text-sm text-gray-700'>
                                Please verify your email address to activate
                                your account.
                            </AlertDescription>
                        </div>
                    </div>
                    <Button
                        size='sm'
                        className='ml-0 md:ml-auto whitespace-nowrap text-white text-sm h-8'
                        onClick={handleOTPwithEmail}
                        disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Verify Email'}
                    </Button>
                </div>
            </Alert>

            {/* OTP Modal */}
            {showModal && (
                <OtpInputForm
                    showModal={showModal}
                    setShowModal={setShowModal}
                />
            )}
        </>
    );
};

export default NotificationWithOTPModal;

