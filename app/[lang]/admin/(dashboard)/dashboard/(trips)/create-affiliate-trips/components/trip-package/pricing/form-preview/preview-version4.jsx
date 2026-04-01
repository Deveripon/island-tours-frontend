import { Calendar, Check, MapPin, Moon, Sun, User } from 'lucide-react';
import { useState } from 'react';
import DateSelectorPreview from './components/date-selector-preview';
import GuestSelectorPreview from './components/guest-selector-preview';
import PickupLocationPreview from './components/pickup-location-preview';

export default function BookingFormStaticPreviewv4() {
    const [isDark, setIsDark] = useState(true);

    return (
        <div className='w-full'>
            <div className='mx-auto'>
                {/* Theme Toggle Button */}
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

                <div
                    className={`rounded-lg shadow-2xl overflow-hidden border ${
                        isDark
                            ? 'bg-gray-900 border-gray-800'
                            : 'bg-white border-gray-200'
                    }`}>
                    <div className='flex'>
                        {/* Sidebar Navigation */}
                        <div
                            className={`w-64 text-white p-6 flex flex-col justify-between ${
                                isDark ? 'bg-gray-950' : 'bg-gray-900'
                            }`}>
                            <div className='space-y-6'>
                                <div
                                    className={`pb-6 border-b ${
                                        isDark
                                            ? 'border-gray-800'
                                            : 'border-gray-700'
                                    }`}>
                                    <p className='text-xs uppercase tracking-wider text-gray-400 mb-2'>
                                        Starting from
                                    </p>
                                    <div className='flex items-baseline gap-1'>
                                        <span className='text-4xl font-light'>
                                            $233
                                        </span>
                                    </div>
                                    <p className='text-xs text-gray-400 mt-1 font-light'>
                                        per person
                                    </p>
                                </div>

                                <nav className='space-y-2'>
                                    <div
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                                            isDark
                                                ? 'bg-gray-800 text-white'
                                                : 'bg-white text-gray-900'
                                        }`}>
                                        <div className='w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-500 text-white'>
                                            <Calendar className='w-4 h-4' />
                                        </div>
                                        <span className='text-sm font-light'>
                                            Trip Details
                                        </span>
                                    </div>

                                    <div
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                                            isDark
                                                ? 'text-gray-400'
                                                : 'text-gray-300'
                                        }`}>
                                        <div className='w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-500 text-white'>
                                            <Check className='w-4 h-4' />
                                        </div>
                                        <span className='text-sm font-light'>
                                            Add Extras
                                        </span>
                                    </div>

                                    <div
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                                            isDark
                                                ? 'text-gray-400'
                                                : 'text-gray-300'
                                        }`}>
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-gray-400 ${
                                                isDark
                                                    ? 'bg-gray-900'
                                                    : 'bg-gray-800'
                                            }`}>
                                            <User className='w-4 h-4' />
                                        </div>
                                        <span className='text-sm font-light'>
                                            Contact Info
                                        </span>
                                    </div>
                                </nav>
                            </div>

                            <div
                                className={`pt-6 border-t space-y-2 ${
                                    isDark
                                        ? 'border-gray-800'
                                        : 'border-gray-700'
                                }`}>
                                <div className='flex justify-between items-center text-xs'>
                                    <span className='text-gray-400 font-light'>
                                        Service Fee
                                    </span>
                                    <span className='text-white font-light'>
                                        $3.00
                                    </span>
                                </div>
                                <div
                                    className={`h-px my-3 ${
                                        isDark ? 'bg-gray-800' : 'bg-gray-700'
                                    }`}></div>
                                <div className='flex justify-between items-center'>
                                    <span
                                        className={`text-sm font-light ${
                                            isDark
                                                ? 'text-gray-400'
                                                : 'text-gray-300'
                                        }`}>
                                        Total
                                    </span>
                                    <span className='text-xl font-light text-white'>
                                        $198.00
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div
                            className={`flex-1 p-8 ${
                                isDark ? 'bg-gray-900' : 'bg-white'
                            }`}>
                            <div className='space-y-6'>
                                <div>
                                    <h2
                                        className={`text-2xl font-light mb-1 ${
                                            isDark
                                                ? 'text-gray-100'
                                                : 'text-gray-900'
                                        }`}>
                                        Plan Your Trip
                                    </h2>
                                    <p
                                        className={`text-sm font-light ${
                                            isDark
                                                ? 'text-gray-400'
                                                : 'text-gray-500'
                                        }`}>
                                        Select your preferred date and number of
                                        guests
                                    </p>
                                </div>

                                <div className='space-y-4'>
                                    {/* Date Selector */}
                                    <DateSelectorPreview isDark={isDark} />

                                    {/* Guests */}
                                    <GuestSelectorPreview isDark={isDark} />

                                    {/* Pickup Location */}
                                    <PickupLocationPreview isDark={isDark} />
                                </div>

                                {/* Included Services */}
                                <div
                                    className={`space-y-3 pt-6 border-t ${
                                        isDark
                                            ? 'border-gray-800'
                                            : 'border-gray-100'
                                    }`}>
                                    <h3
                                        className={`text-sm font-medium flex items-center gap-2 ${
                                            isDark
                                                ? 'text-gray-100'
                                                : 'text-gray-900'
                                        }`}>
                                        <MapPin className='w-4 h-4' />
                                        Included Services
                                    </h3>
                                    <div
                                        className={`p-4 rounded-lg border ${
                                            isDark
                                                ? 'border-gray-700'
                                                : 'border-gray-200'
                                        }`}>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex-1'>
                                                <div className='flex items-center gap-2 mb-1'>
                                                    <h5
                                                        className={`text-sm font-normal ${
                                                            isDark
                                                                ? 'text-gray-100'
                                                                : 'text-gray-900'
                                                        }`}>
                                                        Special BARBQ
                                                    </h5>
                                                </div>
                                                <p
                                                    className={`text-xs font-light ${
                                                        isDark
                                                            ? 'text-gray-400'
                                                            : 'text-gray-500'
                                                    }`}>
                                                    +$19 each
                                                </p>
                                            </div>
                                            <div className='flex items-center gap-2 ml-4'>
                                                <button
                                                    className={`h-8 w-8 rounded-md border flex items-center justify-center cursor-default text-gray-400 ${
                                                        isDark
                                                            ? 'border-gray-700 bg-gray-900'
                                                            : 'border-gray-200 bg-white'
                                                    }`}
                                                    disabled>
                                                    <span className='text-lg leading-none'>
                                                        −
                                                    </span>
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
                                                    className={`h-8 w-8 rounded-md border flex items-center justify-center cursor-default ${
                                                        isDark
                                                            ? 'border-gray-700 bg-gray-900 text-gray-200'
                                                            : 'border-gray-200 bg-white text-gray-900'
                                                    }`}>
                                                    <span className='text-lg leading-none'>
                                                        +
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button className='w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-light shadow-md transition-colors flex items-center justify-center gap-2 cursor-default'>
                                    Continue to Extras
                                    <svg
                                        className='w-4 h-4'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'>
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M14 5l7 7m0 0l-7 7m7-7H3'
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

