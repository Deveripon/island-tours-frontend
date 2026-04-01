'use client';

import { useTrip } from '@/app/[lang]/(trips-landing-page-tenent)/hooks/use-trip';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight,
    CheckCircle,
    CreditCard,
    Lock,
    Shield,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PaymentProcessing() {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const { userId, tripData } = useTrip();
    const router = useRouter();

    const steps = [
        'Initializing secure payment gateway...',
        'Verifying payment methods...',
        'Encrypting transaction data...',
        'Connecting to payment processor...',
        'Finalizing payment setup...',
    ];

    // Progress and step animation
    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    setIsCompleted(true);
                    return 100;
                }
                return prev + 1.5;
            });
        }, 120);

        const stepInterval = setInterval(() => {
            setCurrentStep(prev => {
                if (prev >= steps.length - 1) {
                    clearInterval(stepInterval);
                    return prev;
                }
                return prev + 1;
            });
        }, 100);

        return () => {
            clearInterval(progressInterval);
            clearInterval(stepInterval);
        };
    });

    return (
        <div className='fixed inset-0 z-[9999] bg-gradient-to-br from-emerald-50 via-white to-primary/10 flex items-center justify-center p-4'>
            <div className='max-w-md w-full'>
                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className='bg-background rounded-2xl shadow-xl p-8 text-center border border-gray-100'>
                    {/* Header Icon */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            delay: 0.3,
                            type: 'spring',
                            stiffness: 200,
                        }}
                        className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                            isCompleted
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                                : 'bg-gradient-to-r from-primary to-indigo-700'
                        }`}>
                        {isCompleted ? (
                            <CheckCircle className='w-8 h-8 text-white' />
                        ) : (
                            <CreditCard className='w-8 h-8 text-white' />
                        )}
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className='text-lg font-bold text-gray-900 mb-3'>
                        {isCompleted
                            ? 'Payment Setup Complete!'
                            : 'Processing Payment Setup'}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className='text-gray-600 mb-8'>
                        {isCompleted
                            ? 'Redirecting to secure payment page...'
                            : 'Setting up your secure payment environment'}
                    </motion.p>

                    {/* Payment Amount Display */}
                    {tripData?.price && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 }}
                            className='bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200'>
                            <p className='text-sm text-gray-600 mb-1'>
                                Trip Total
                            </p>
                            <p className='text-lg font-bold text-gray-900'>
                                ${tripData.price}
                            </p>
                        </motion.div>
                    )}

                    {/* Animated Spinner */}
                    <div className='relative mb-8'>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: 'linear',
                            }}
                            className={`w-16 h-16 mx-auto border-4 rounded-full ${
                                isCompleted
                                    ? 'border-green-100 border-t-green-500'
                                    : 'border-primary/20 border-t-blue-500'
                            }`}
                        />
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className='absolute inset-0 flex items-center justify-center'>
                            <div
                                className={`w-8 h-8 rounded-full opacity-20 ${
                                    isCompleted ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                            />
                        </motion.div>
                    </div>

                    {/* Progress Bar */}
                    <div className='mb-6'>
                        <div className='flex justify-between text-sm text-gray-500 mb-2'>
                            <span>Setup Progress</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-3'>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                                className={`h-3 rounded-full ${
                                    isCompleted
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                                        : 'bg-gradient-to-r from-primary/90 to-indigo-600'
                                }`}
                            />
                        </div>
                    </div>

                    {/* Current Step */}
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={isCompleted ? 'completed' : currentStep}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className='mb-8'>
                            <p className='text-gray-700 font-medium'>
                                {isCompleted
                                    ? 'Redirecting to payment gateway...'
                                    : steps[currentStep]}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Security Indicators */}
                    <div className='flex items-center justify-center space-x-6 text-sm text-gray-500'>
                        <div className='flex items-center space-x-1'>
                            <Shield className='w-4 h-4 text-green-500' />
                            <span>SSL Secured</span>
                        </div>
                        <div className='flex items-center space-x-1'>
                            <Lock className='w-4 h-4 text-green-500' />
                            <span>Bank-level Encryption</span>
                        </div>
                    </div>

                    {/* Payment Methods Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className='mt-6 flex justify-center items-center space-x-3'>
                        <div className='text-sm text-gray-500'>
                            Accepted payments:
                        </div>
                        <div className='flex space-x-2'>
                            <div className='w-8 h-5 bg-primary rounded text-white text-sm flex items-center justify-center font-bold'>
                                VISA
                            </div>
                            <div className='w-8 h-5 bg-red-500 rounded text-white text-sm flex items-center justify-center font-bold'>
                                MC
                            </div>
                            <div className='w-8 h-5 bg-primary  rounded text-white text-sm flex items-center justify-center font-bold'>
                                AMEX
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Bottom Animation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className='mt-6 flex items-center justify-center text-gray-500'>
                    <span className='text-sm mr-2'>
                        {isCompleted
                            ? 'Redirecting to payment'
                            : 'Preparing secure checkout'}
                    </span>
                    <motion.div
                        animate={{
                            x: isCompleted ? [0, 20, 0] : [0, 10, 0],
                            scale: isCompleted ? [1, 1.2, 1] : 1,
                        }}
                        transition={{
                            duration: isCompleted ? 1 : 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                        }}>
                        <ArrowRight
                            className={`w-4 h-4 ${
                                isCompleted ? 'text-green-500' : 'text-blue-500'
                            }`}
                        />
                    </motion.div>
                </motion.div>

                {/* Floating Payment Icons Animation */}
                <div className='fixed inset-0 pointer-events-none overflow-hidden z-10'>
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                x:
                                    Math.random() *
                                    (typeof window !== 'undefined'
                                        ? window.innerWidth
                                        : 800),
                                y:
                                    Math.random() *
                                    (typeof window !== 'undefined'
                                        ? window.innerHeight
                                        : 600),
                                opacity: 0,
                            }}
                            animate={{
                                y: [null, -30, null],
                                opacity: [0, 0.3, 0],
                                rotate: [0, 360],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: i * 0.8,
                                ease: 'easeInOut',
                            }}
                            className='absolute w-4 h-4 bg-gradient-to-r from-primary/50 to-emerald-400 rounded-full'
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

