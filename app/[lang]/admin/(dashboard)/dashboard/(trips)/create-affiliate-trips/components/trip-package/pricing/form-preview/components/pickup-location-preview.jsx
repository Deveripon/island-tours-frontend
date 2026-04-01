import { ChevronDown, MapPin } from 'lucide-react';

const PickupLocationPreview = ({ isDark }) => {
    return (
        <div>
            <label
                className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                Pickup Location (Optional)
            </label>
            <div className='relative'>
                <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                <select
                    className={`w-full pl-10 pr-10 py-2 text-sm border rounded-lg focus:outline-none appearance-none ${
                        isDark
                            ? 'border-gray-700 bg-gray-800 text-gray-400'
                            : 'border-gray-300 bg-white text-gray-400'
                    }`}>
                    <option>Select pickup location...</option>
                </select>
                <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
            </div>
        </div>
    );
};

export default PickupLocationPreview;
