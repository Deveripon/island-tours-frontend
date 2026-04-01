import { Calendar, X } from 'lucide-react';

const DateSelectorPreview = ({ isDark }) => {
    return (
        <div>
            <label
                className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                Trip Date <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
                <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                <input
                    type='text'
                    value='Oct 30, 2025'
                    readOnly
                    className={`w-full pl-10 pr-10 py-2 text-sm border rounded-lg focus:outline-none ${
                        isDark
                            ? 'border-gray-700 bg-gray-800 text-gray-100'
                            : 'border-gray-300 bg-white text-gray-900'
                    }`}
                />
                <X className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer' />
            </div>
        </div>
    );
};

export default DateSelectorPreview;

