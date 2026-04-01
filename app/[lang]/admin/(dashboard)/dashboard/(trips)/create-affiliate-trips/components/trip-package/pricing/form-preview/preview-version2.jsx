import {
    ArrowLeft01Icon,
    ArrowRight01Icon,
    MinusSignIcon,
    Moon02Icon,
    PlusSignIcon,
    Sun01Icon,
    Tick01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Fragment, useState } from 'react';
import DateSelectorPreview from './components/date-selector-preview';
import GuestSelectorPreview from './components/guest-selector-preview';
import PickupLocationPreview from './components/pickup-location-preview';

export default function BookingFormStaticPreviewv2() {
    const [isDark, setIsDark] = useState(true);
    const [step, setStep] = useState(1);

    return (
        <div
            className={`min-h-screen p-8 transition-colors ${
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
                                <HugeiconsIcon
                                    icon={Sun01Icon}
                                    className='w-4 h-4'
                                />
                                <span className='text-sm font-medium'>
                                    Light Mode
                                </span>
                            </>
                        ) : (
                            <>
                                <HugeiconsIcon
                                    icon={Moon02Icon}
                                    className='w-4 h-4'
                                />
                                <span className='text-sm font-medium'>
                                    Dark Mode
                                </span>
                            </>
                        )}
                    </button>
                </div>

                {/* Booking Card */}
                <div
                    className={`rounded-lg border shadow-lg transition-colors ${
                        isDark
                            ? 'bg-gray-900 border-gray-700'
                            : 'bg-white border-gray-200'
                    }`}>
                    {/* Progress Steps */}

                    <div className='px-6 pt-6 pb-4'>
                        <div className='flex items-center mb-6'>
                            {[1, 2, 3].map((s, index) => (
                                <Fragment key={s}>
                                    <div
                                        className={`
                                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-light transition-all
                                      ${
                                          step >= s
                                              ? 'bg-primary text-white dark:text-gray-900'
                                              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700'
                                      }
                                  `}>
                                        {step > s ? (
                                            <HugeiconsIcon
                                                icon={Tick01Icon}
                                                className='w-4 h-4'
                                            />
                                        ) : (
                                            s
                                        )}
                                    </div>
                                    {index < 2 && (
                                        <div
                                            className={`
                                          h-px flex-1 mx-2 transition-all
                                          ${
                                              step > s
                                                  ? 'bg-gray-900 dark:bg-gray-100'
                                                  : 'bg-gray-200 dark:bg-gray-700'
                                          }
                                      `}
                                        />
                                    )}
                                </Fragment>
                            ))}
                        </div>
                        <div className='flex justify-between text-xs font-light text-gray-500 dark:text-gray-400'>
                            <span>Details</span>
                            <span>Services</span>
                            <span>Contact</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className='px-6 pb-6'>
                        {/* Step 1: Date & Guests */}
                        {step === 1 && (
                            <div className='space-y-6'>
                                <div>
                                    <div className='flex items-center justify-between mb-4'>
                                        <h3
                                            className={`text-sm font-light ${
                                                isDark
                                                    ? 'text-gray-400'
                                                    : 'text-gray-500'
                                            }`}>
                                            Starting from
                                        </h3>
                                        <div className='text-right'>
                                            <span
                                                className={`text-2xl font-light ${
                                                    isDark
                                                        ? 'text-gray-100'
                                                        : 'text-gray-900'
                                                }`}>
                                                $199
                                            </span>
                                            <span
                                                className={`ml-2 text-xs font-light px-2 py-1 rounded border ${
                                                    isDark
                                                        ? 'border-gray-600 text-gray-300'
                                                        : 'border-gray-200 text-gray-600'
                                                }`}>
                                                per person
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Date Selector */}
                                <DateSelectorPreview isDark={isDark} />
                                {/* Guests */}
                                <GuestSelectorPreview isDark={isDark} />

                                {/* Pickup */}
                                <PickupLocationPreview isDark={isDark} />

                                {/* Other Services */}
                                <div className='space-y-3'>
                                    <h3
                                        className={`text-sm font-light ${
                                            isDark
                                                ? 'text-gray-400'
                                                : 'text-gray-500'
                                        }`}>
                                        Other Services
                                    </h3>
                                    <div
                                        className={`p-4 rounded border transition-all ${
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
                                                    Special BARBQ
                                                </h5>
                                                <p
                                                    className={`text-xs font-light mt-1 ${
                                                        isDark
                                                            ? 'text-gray-400'
                                                            : 'text-gray-500'
                                                    }`}>
                                                    +$19 each
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
                                                    <HugeiconsIcon
                                                        icon={MinusSignIcon}
                                                        className='w-3 h-3'
                                                    />
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
                                                    <HugeiconsIcon
                                                        icon={PlusSignIcon}
                                                        className='w-3 h-3'
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Extras */}
                        {step === 2 && (
                            <div className='space-y-4'>
                                <div className='text-center mb-6'>
                                    <h3
                                        className={`text-lg font-light mb-1 ${
                                            isDark
                                                ? 'text-gray-100'
                                                : 'text-gray-900'
                                        }`}>
                                        Enhance Your Experience
                                    </h3>
                                    <p
                                        className={`text-sm font-light ${
                                            isDark
                                                ? 'text-gray-400'
                                                : 'text-gray-500'
                                        }`}>
                                        Optional extras for your trip
                                    </p>
                                </div>

                                <div
                                    className={`p-4 rounded border transition-all ${
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
                                                Premium Photography
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
                                                <HugeiconsIcon
                                                    icon={MinusSignIcon}
                                                    className='w-3 h-3'
                                                />
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
                                                <HugeiconsIcon
                                                    icon={PlusSignIcon}
                                                    className='w-3 h-3'
                                                />
                                            </button>
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
                                <div>
                                    <label
                                        className={`block text-sm font-medium mb-2 ${
                                            isDark
                                                ? 'text-gray-300'
                                                : 'text-gray-700'
                                        }`}>
                                        City
                                    </label>
                                    <input
                                        type='text'
                                        placeholder='Your city'
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
                        className={`px-6 pb-6 pt-4 border-t ${
                            isDark ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                        <div className='space-y-2 mb-4'>
                            <div className='flex justify-between text-sm font-light'>
                                <span
                                    className={
                                        isDark
                                            ? 'text-gray-400'
                                            : 'text-gray-500'
                                    }>
                                    Service Fee
                                </span>
                                <span
                                    className={
                                        isDark
                                            ? 'text-gray-100'
                                            : 'text-gray-900'
                                    }>
                                    $3.00
                                </span>
                            </div>
                            <div className='flex justify-between text-sm font-light'>
                                <span
                                    className={
                                        isDark
                                            ? 'text-gray-400'
                                            : 'text-gray-500'
                                    }>
                                    Additional Services
                                </span>
                                <span
                                    className={
                                        isDark
                                            ? 'text-gray-100'
                                            : 'text-gray-900'
                                    }>
                                    +$0.00
                                </span>
                            </div>
                            <div
                                className={`flex justify-between items-center pt-3 border-t ${
                                    isDark
                                        ? 'border-gray-700'
                                        : 'border-gray-200'
                                }`}>
                                <span
                                    className={`text-sm font-normal ${
                                        isDark
                                            ? 'text-gray-300'
                                            : 'text-gray-600'
                                    }`}>
                                    Total Deposit
                                </span>
                                <span
                                    className={`text-xl font-light ${
                                        isDark
                                            ? 'text-gray-100'
                                            : 'text-gray-900'
                                    }`}>
                                    $198.00
                                </span>
                            </div>
                        </div>

                        <div className='flex gap-3'>
                            {step > 1 && (
                                <button
                                    onClick={() => setStep(step - 1)}
                                    className={`flex-1 h-11 transition-all rounded-lg border flex items-center justify-center gap-2 ${
                                        isDark
                                            ? 'bg-gray-800 hover:bg-gray-700 border-gray-500 text-gray-300'
                                            : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-900'
                                    }`}>
                                    <HugeiconsIcon
                                        icon={ArrowLeft01Icon}
                                        className='w-4 h-4'
                                    />
                                    Back
                                </button>
                            )}
                            <button
                                onClick={() => step < 3 && setStep(step + 1)}
                                className='flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-light flex items-center justify-center gap-2 transition-colors'>
                                {step < 3 ? 'Continue' : 'Proceed to Payment'}
                                <HugeiconsIcon
                                    icon={ArrowRight01Icon}
                                    className='w-4 h-4'
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

