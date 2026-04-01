import { cn } from '@/lib/utils';
import {
    ArrowRight,
    Calendar,
    Check,
    Gift,
    Minus,
    Moon,
    Plus,
    Sun,
    User,
} from 'lucide-react';
import { Fragment, useState } from 'react';
import DateSelectorPreview from './components/date-selector-preview';
import GuestSelectorPreview from './components/guest-selector-preview';
import PickupLocationPreview from './components/pickup-location-preview';

export default function BookingFormStaticPreviewv3() {
    const [isDark, setIsDark] = useState(true);
    const [step, setStep] = useState(1);

    const steps = [
        { number: 1, label: 'Trip Details', icon: Calendar },
        { number: 2, label: 'Add Extras', icon: Gift },
        { number: 3, label: 'Your Info', icon: User },
    ];

    return (
        <div
            className={`p-8 transition-colors ${
                isDark ? 'bg-gray-950' : 'bg-gray-50'
            }`}>
            <div className='max-w-sm mx-auto'>
                {/* Theme Toggle */}
                <div className='flex justify-end mb-4'>
                    <button
                        onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsDark(!isDark);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border shadow-sm transition-colors ${
                            isDark
                                ? 'bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700'
                                : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
                        }`}>
                        {isDark ? (
                            <>
                                <Sun className='w-4 h-4' />
                                <span className='text-sm font-medium'>
                                    Light Mode
                                </span>
                            </>
                        ) : (
                            <>
                                <Moon className='w-4 h-4' />
                                <span className='text-sm font-medium'>
                                    Dark Mode
                                </span>
                            </>
                        )}
                    </button>
                </div>

                {/* Booking Card */}
                <div
                    className={`rounded-lg border-2 shadow-lg overflow-hidden transition-colors ${
                        isDark
                            ? 'bg-gray-900 border-gray-700'
                            : 'bg-white border-gray-200'
                    }`}>
                    {/* Header with Price */}
                    <div
                        className={`px-6 py-6 border-b-2 transition-colors ${
                            isDark
                                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
                                : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
                        }`}>
                        <div className='flex items-end justify-between'>
                            <div>
                                <p
                                    className={`text-xs uppercase tracking-wider font-light mb-1 ${
                                        isDark
                                            ? 'text-gray-400'
                                            : 'text-gray-500'
                                    }`}>
                                    From
                                </p>
                                <div className='flex items-baseline gap-1'>
                                    <span
                                        className={`text-4xl font-light ${
                                            isDark
                                                ? 'text-white'
                                                : 'text-gray-900'
                                        }`}>
                                        $233
                                    </span>
                                    <span
                                        className={`text-sm font-light mb-1 ${
                                            isDark
                                                ? 'text-gray-400'
                                                : 'text-gray-500'
                                        }`}>
                                        /person
                                    </span>
                                </div>
                            </div>
                            <div
                                className={`px-3 py-1 rounded-md border font-light ${
                                    isDark
                                        ? 'bg-gray-800 border-gray-600 text-gray-300'
                                        : 'bg-white border-gray-300 text-gray-700'
                                }`}>
                                Step {step} of 3
                            </div>
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <div
                        className={cn(
                            'px-6 py-4 border-b',
                            isDark
                                ? 'bg-gray-900 border-gray-700'
                                : 'bg-gray-100 border-gray-200'
                        )}>
                        <div className='flex items-center justify-between'>
                            {steps.map((s, index) => {
                                const Icon = s.icon;
                                const isActive = step === s.number;
                                const isCompleted = step > s.number;

                                return (
                                    <Fragment key={s.number}>
                                        <div className='flex flex-col items-center gap-2 flex-1'>
                                            <div
                                                className={cn(
                                                    `  w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300`,

                                                    isCompleted
                                                        ? 'bg-primary  shadow-md'
                                                        : isActive
                                                        ? 'bg-primary text-gray-100 shadow-lg scale-110'
                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-2 border-gray-200 dark:border-gray-700',
                                                    isDark
                                                        ? 'bg-gray-800 text-gray-500 border-gray-700'
                                                        : 'bg-white text-gray-900 border-gray-200'
                                                )}>
                                                {isCompleted ? (
                                                    <Check className='w-5 h-5' />
                                                ) : (
                                                    <Icon className='w-5 h-5' />
                                                )}
                                            </div>
                                            <span
                                                className={cn(
                                                    `
                                                                      text-xs font-light text-center transition-colors
                                                                      ${
                                                                          isActive ||
                                                                          isCompleted
                                                                              ? 'text-gray-900 dark:text-white'
                                                                              : 'text-gray-400 dark:text-gray-500'
                                                                      }
                                                                  `,
                                                    isDark
                                                        ? 'text-gray-400 dark:text-gray-500'
                                                        : 'text-gray-500 dark:text-gray-400'
                                                )}>
                                                {s.label}
                                            </span>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div
                                                className={`
                                                                      h-0.5 flex-1 mx-2 mt-[-20px] transition-all duration-300
                                                                      ${
                                                                          step >
                                                                          s.number
                                                                              ? 'bg-gray-900 dark:bg-gray-100'
                                                                              : 'bg-gray-200 dark:bg-gray-700'
                                                                      }
                                                                  `}
                                            />
                                        )}
                                    </Fragment>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content */}
                    <div
                        className={`px-6 py-6 ${
                            isDark ? 'bg-gray-900' : 'bg-white'
                        }`}>
                        {/* Step 1: Trip Details */}
                        {step === 1 && (
                            <div className='space-y-6'>
                                {/* Date Selector */}
                                <DateSelectorPreview isDark={isDark} />

                                {/* Guests */}
                                <GuestSelectorPreview isDark={isDark} />

                                {/* Pickup Location */}
                                <PickupLocationPreview isDark={isDark} />

                                {/* Included Services */}
                                <div
                                    className={`space-y-3 pt-4 border-t ${
                                        isDark
                                            ? 'border-gray-800'
                                            : 'border-gray-200'
                                    }`}>
                                    <div className='flex items-center gap-2'>
                                        <div
                                            className={`w-1 h-5 rounded-full ${
                                                isDark
                                                    ? 'bg-gray-100'
                                                    : 'bg-gray-900'
                                            }`}></div>
                                        <h3
                                            className={`text-base font-light ${
                                                isDark
                                                    ? 'text-white'
                                                    : 'text-gray-900'
                                            }`}>
                                            Included Services
                                        </h3>
                                    </div>
                                    <div
                                        className={`p-4 rounded-lg border transition-all ${
                                            isDark
                                                ? 'border-gray-700 hover:border-gray-600'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex-1'>
                                                <h5
                                                    className={`text-sm font-normal mb-1 ${
                                                        isDark
                                                            ? 'text-white'
                                                            : 'text-gray-900'
                                                    }`}>
                                                    Special BARBQ
                                                </h5>
                                                <p
                                                    className={`text-xs font-light ${
                                                        isDark
                                                            ? 'text-gray-400'
                                                            : 'text-gray-500'
                                                    }`}>
                                                    +$19 each
                                                </p>
                                            </div>
                                            <div className='flex items-center gap-3 ml-4'>
                                                <button
                                                    disabled
                                                    className={`h-7 w-7 rounded-full border flex items-center justify-center ${
                                                        isDark
                                                            ? 'border-gray-700 bg-gray-900 text-gray-600'
                                                            : 'border-gray-200 bg-white text-gray-400'
                                                    }`}>
                                                    <Minus className='w-3.5 h-3.5' />
                                                </button>
                                                <span
                                                    className={`w-8 text-center text-sm font-light ${
                                                        isDark
                                                            ? 'text-white'
                                                            : 'text-gray-900'
                                                    }`}>
                                                    0
                                                </span>
                                                <button
                                                    className={`h-7 w-7 rounded-full border flex items-center justify-center ${
                                                        isDark
                                                            ? 'border-gray-700 bg-gray-900 text-gray-200 hover:bg-gray-700'
                                                            : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
                                                    }`}>
                                                    <Plus className='w-3.5 h-3.5' />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Add Extras */}
                        {step === 2 && (
                            <div className='space-y-5'>
                                <div className='text-center py-4'>
                                    <div
                                        className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                                            isDark
                                                ? 'bg-gray-800'
                                                : 'bg-gray-100'
                                        }`}>
                                        <Gift
                                            className={`w-8 h-8 ${
                                                isDark
                                                    ? 'text-white'
                                                    : 'text-gray-900'
                                            }`}
                                        />
                                    </div>
                                    <h3
                                        className={`text-xl font-light mb-2 ${
                                            isDark
                                                ? 'text-white'
                                                : 'text-gray-900'
                                        }`}>
                                        Make It Special
                                    </h3>
                                    <p
                                        className={`text-sm font-light ${
                                            isDark
                                                ? 'text-gray-400'
                                                : 'text-gray-500'
                                        }`}>
                                        Add optional extras to enhance your
                                        experience
                                    </p>
                                </div>

                                <div className='space-y-3'>
                                    <div
                                        className={`p-4 rounded border ${
                                            isDark
                                                ? 'border-gray-700'
                                                : 'border-gray-200'
                                        }`}>
                                        <div className='flex items-start justify-between mb-2'>
                                            <div className='flex-1'>
                                                <h5
                                                    className={`text-sm font-normal ${
                                                        isDark
                                                            ? 'text-gray-100'
                                                            : 'text-gray-900'
                                                    }`}>
                                                    Premium Photography Package
                                                </h5>
                                                <p
                                                    className={`text-xs font-light mt-1 ${
                                                        isDark
                                                            ? 'text-gray-400'
                                                            : 'text-gray-500'
                                                    }`}>
                                                    +$50 each
                                                </p>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <button
                                                    disabled
                                                    className={`h-7 w-7 rounded-full border flex items-center justify-center ${
                                                        isDark
                                                            ? 'border-gray-700 bg-gray-900 text-gray-600'
                                                            : 'border-gray-200 bg-white text-gray-400'
                                                    }`}>
                                                    <Minus className='w-3 h-3' />
                                                </button>
                                                <span
                                                    className={`w-6 text-center text-sm font-light ${
                                                        isDark
                                                            ? 'text-gray-300'
                                                            : 'text-gray-900'
                                                    }`}>
                                                    0
                                                </span>
                                                <button
                                                    className={`h-7 w-7 rounded-full border flex items-center justify-center ${
                                                        isDark
                                                            ? 'border-gray-700 bg-gray-900 text-gray-200 hover:bg-gray-700'
                                                            : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
                                                    }`}>
                                                    <Plus className='w-3 h-3' />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Contact Info */}
                        {step === 3 && (
                            <div className='space-y-4'>
                                <div>
                                    <label
                                        className={`block text-sm font-medium mb-2 ${
                                            isDark
                                                ? 'text-gray-300'
                                                : 'text-gray-700'
                                        }`}>
                                        Full Name{' '}
                                        <span className='text-red-500'>*</span>
                                    </label>
                                    <input
                                        type='text'
                                        placeholder='Enter your name'
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
                                            isDark
                                                ? 'border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-500'
                                                : 'border-gray-200 bg-white text-gray-900 placeholder-gray-400'
                                        }`}
                                    />
                                </div>
                                <div>
                                    <label
                                        className={`block text-sm font-medium mb-2 ${
                                            isDark
                                                ? 'text-gray-300'
                                                : 'text-gray-700'
                                        }`}>
                                        Email{' '}
                                        <span className='text-red-500'>*</span>
                                    </label>
                                    <input
                                        type='email'
                                        placeholder='your.email@example.com'
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
                                            isDark
                                                ? 'border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-500'
                                                : 'border-gray-200 bg-white text-gray-900 placeholder-gray-400'
                                        }`}
                                    />
                                </div>
                                <div>
                                    <label
                                        className={`block text-sm font-medium mb-2 ${
                                            isDark
                                                ? 'text-gray-300'
                                                : 'text-gray-700'
                                        }`}>
                                        Phone Number{' '}
                                        <span className='text-red-500'>*</span>
                                    </label>
                                    <input
                                        type='tel'
                                        placeholder='+1 (555) 000-0000'
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
                                            isDark
                                                ? 'border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-500'
                                                : 'border-gray-200 bg-white text-gray-900 placeholder-gray-400'
                                        }`}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div
                        className={`border-t-2 transition-colors ${
                            isDark
                                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
                                : 'bg-gradient-to-br from-gray-50 to-white border-gray-200'
                        }`}>
                        <div className='px-6 py-5'>
                            <div className='space-y-3 mb-5'>
                                <div className='flex justify-between items-center text-sm font-light'>
                                    <span
                                        className={
                                            isDark
                                                ? 'text-gray-400'
                                                : 'text-gray-600'
                                        }>
                                        Service Fee
                                    </span>
                                    <span
                                        className={
                                            isDark
                                                ? 'text-white'
                                                : 'text-gray-900'
                                        }>
                                        $3.00
                                    </span>
                                </div>
                                <div
                                    className={`h-px my-3 ${
                                        isDark ? 'bg-gray-700' : 'bg-gray-200'
                                    }`}></div>
                                <div className='flex justify-between items-center pt-2'>
                                    <div>
                                        <p
                                            className={`text-xs font-light mb-1 ${
                                                isDark
                                                    ? 'text-gray-400'
                                                    : 'text-gray-500'
                                            }`}>
                                            Total Deposit
                                        </p>
                                        <p
                                            className={`text-2xl font-light ${
                                                isDark
                                                    ? 'text-white'
                                                    : 'text-gray-900'
                                            }`}>
                                            $198.00
                                        </p>
                                    </div>
                                    <div
                                        className={`px-3 py-1.5 rounded-md border font-light ${
                                            isDark
                                                ? 'bg-gray-800 border-gray-600 text-gray-300'
                                                : 'bg-white border-gray-300 text-gray-700'
                                        }`}>
                                        Due Today
                                    </div>
                                </div>
                            </div>

                            <div className='flex gap-3'>
                                {step > 1 && (
                                    <button
                                        onClick={() => setStep(step - 1)}
                                        className={`flex-1 h-11 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                                            isDark
                                                ? 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-300'
                                                : 'bg-white hover:bg-gray-100 border-gray-300 text-gray-700'
                                        }`}>
                                        Back
                                    </button>
                                )}
                                <button
                                    onClick={() =>
                                        step < 3 && setStep(step + 1)
                                    }
                                    className='flex-1 h-11 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-light flex items-center justify-center gap-2 transition-colors'>
                                    {step < 3
                                        ? 'Continue'
                                        : 'Proceed to Payment'}
                                    <ArrowRight className='w-4 h-4' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

