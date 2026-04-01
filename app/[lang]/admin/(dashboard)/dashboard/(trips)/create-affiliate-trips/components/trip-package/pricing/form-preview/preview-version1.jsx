import { ArrowRight, Minus, Moon, Plus, Sun } from 'lucide-react';
import { useState } from 'react';
import DateSelectorPreview from './components/date-selector-preview';
import GuestSelectorPreview from './components/guest-selector-preview';
import PickupLocationPreview from './components/pickup-location-preview';

export default function BookingFormStaticPreviewv1() {
    const [isDark, setIsDark] = useState(true);
    const [selectedDate, setSelectedDate] = useState(true);

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
                                ? 'bg-gray-800 border-gray-700 text-gray-100 text-sm hover:bg-gray-700'
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
                    className={`rounded-lg border py-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
                        isDark
                            ? 'bg-gray-900 border-gray-800'
                            : 'bg-white border-gray-200'
                    }`}>
                    {/* Header */}
                    <div className='p-6 space-y-1'>
                        <span
                            className={`inline-block px-4 py-1 rounded text-sm font-medium ${
                                isDark
                                    ? 'bg-red-900/30 text-red-400 border border-red-800'
                                    : 'bg-red-100 text-red-700'
                            }`}>
                            Likely to sell out
                        </span>
                        <h2
                            className={`text-lg font-bold ${
                                isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                            Make your reservation
                        </h2>
                    </div>
                    <>
                        {/* Content */}
                        <div className='px-6  space-y-4'>
                            {/* Price */}
                            <div>
                                <h3
                                    className={`text-lg font-bold mb-2 ${
                                        isDark
                                            ? 'text-gray-300'
                                            : 'text-gray-600'
                                    }`}>
                                    Price
                                </h3>
                                <div className='flex items-center gap-2'>
                                    <span
                                        className={`text-lg font-bold ${
                                            isDark
                                                ? 'text-blue-400'
                                                : 'text-blue-600'
                                        }`}>
                                        $199
                                    </span>
                                    <span
                                        className={`px-2 py-1 rounded text-sm ${
                                            isDark
                                                ? 'bg-gray-800 text-gray-300'
                                                : 'bg-gray-200 text-gray-700'
                                        }`}>
                                        Standard
                                    </span>
                                </div>
                            </div>

                            {/* Date Selection */}
                            <DateSelectorPreview isDark={isDark} />

                            {/* Guests */}
                            <GuestSelectorPreview isDark={isDark} />

                            {/* Pickup Location */}
                            <PickupLocationPreview isDark={isDark} />

                            {/* Other Services */}
                            <div>
                                <h3
                                    className={`text-sm font-medium mb-3 ${
                                        isDark
                                            ? 'text-gray-300'
                                            : 'text-gray-700'
                                    }`}>
                                    Other Services
                                </h3>
                                <div
                                    className={`p-4 rounded-lg border ${
                                        isDark
                                            ? 'border-gray-700 bg-gray-800/50'
                                            : 'border-gray-300 bg-white'
                                    }`}>
                                    <div className='flex items-start justify-between'>
                                        <div className='flex-1'>
                                            <h5
                                                className={`text-sm font-medium ${
                                                    isDark
                                                        ? 'text-gray-100'
                                                        : 'text-gray-900'
                                                }`}>
                                                Special BARBQ
                                            </h5>
                                            <p
                                                className={`text-xs mt-1 ${
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
                                                        : 'border-gray-300 bg-white text-gray-400'
                                                }`}>
                                                <Minus className='w-3 h-3' />
                                            </button>
                                            <span
                                                className={`w-6 text-center text-sm ${
                                                    isDark
                                                        ? 'text-gray-300'
                                                        : 'text-gray-900'
                                                }`}>
                                                0
                                            </span>
                                            <button
                                                disabled
                                                className={`h-7 w-7 rounded-full border flex items-center justify-center transition-colors ${
                                                    isDark
                                                        ? 'border-gray-700 bg-gray-900 text-gray-200 hover:bg-gray-700'
                                                        : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                                                }`}>
                                                <Plus className='w-3 h-3' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Extras Checkbox */}
                            <div className='flex items-center gap-3'>
                                <input
                                    type='checkbox'
                                    readOnly
                                    id='extras'
                                    checked={true}
                                    className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                                />
                                <label
                                    htmlFor='extras'
                                    className={`text-sm ${
                                        isDark
                                            ? 'text-gray-300'
                                            : 'text-gray-700'
                                    }`}>
                                    I need to add extras
                                </label>
                            </div>

                            {/* Extras Section */}

                            <div>
                                <h3
                                    className={`text-sm font-medium mb-3 ${
                                        isDark
                                            ? 'text-gray-300'
                                            : 'text-gray-700'
                                    }`}>
                                    Extras
                                </h3>
                                <div
                                    className={`p-4 rounded-lg border ${
                                        isDark
                                            ? 'border-gray-700 bg-gray-800/50'
                                            : 'border-gray-300 bg-white'
                                    }`}>
                                    <div className='flex items-start justify-between'>
                                        <div className='flex-1'>
                                            <h5
                                                className={`text-sm font-medium ${
                                                    isDark
                                                        ? 'text-gray-100'
                                                        : 'text-gray-900'
                                                }`}>
                                                Premium Photography
                                            </h5>
                                            <p
                                                className={`text-xs mt-1 ${
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
                                                        : 'border-gray-300 bg-white text-gray-400'
                                                }`}>
                                                <Minus className='w-3 h-3' />
                                            </button>
                                            <span
                                                className={`w-6 text-center text-sm ${
                                                    isDark
                                                        ? 'text-gray-300'
                                                        : 'text-gray-900'
                                                }`}>
                                                0
                                            </span>
                                            <button
                                                disabled
                                                className={`h-7 w-7 rounded-full border flex items-center justify-center transition-colors ${
                                                    isDark
                                                        ? 'border-gray-700 bg-gray-900 text-gray-200 hover:bg-gray-700'
                                                        : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                                                }`}>
                                                <Plus className='w-3 h-3' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Total Deposit */}
                            <div className='pt-2'>
                                <h3
                                    className={`text-sm font-medium ${
                                        isDark
                                            ? 'text-gray-400'
                                            : 'text-gray-500'
                                    }`}>
                                    Total Deposit:{' '}
                                    <span
                                        className={`font-semibold text-lg ml-1 ${
                                            isDark
                                                ? 'text-blue-400'
                                                : 'text-blue-600'
                                        }`}>
                                        $198.00
                                    </span>
                                </h3>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className='px-6 pb-6'>
                            <button
                                disabled
                                className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
                                    selectedDate
                                        ? isDark
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : isDark
                                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}>
                                {!selectedDate
                                    ? 'Select Date to Continue'
                                    : 'Next'}
                                <ArrowRight className='w-4 h-4' />
                            </button>
                        </div>
                    </>
                </div>
            </div>
        </div>
    );
}

