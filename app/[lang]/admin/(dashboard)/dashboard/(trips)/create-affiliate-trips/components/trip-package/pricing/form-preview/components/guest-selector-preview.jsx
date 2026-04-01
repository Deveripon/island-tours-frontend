import { User } from 'lucide-react';
import React from 'react'

const GuestSelectorPreview = ({ isDark }) => {
  return (
      <div>
          <label
              className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Guests <span className='text-red-500'>*</span>
          </label>
          <div
              className={`p-3 rounded-lg border mb-2 ${
                  isDark
                      ? 'bg-gray-800/50 border-gray-700'
                      : 'bg-blue-50/50 border-blue-100'
              }`}>
              <div className='flex items-center gap-2'>
                  <svg
                      className='w-4 h-4 text-blue-500'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                  </svg>
                  <p
                      className={`text-xs font-light ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      Now you have to deposit only 33% for per person
                  </p>
              </div>
          </div>
          <div className='relative'>
              <User className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
              <input
                  type='text'
                  value='3 Guests'
                  readOnly
                  className={`w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none ${
                      isDark
                          ? 'border-gray-700 bg-gray-800 text-gray-100'
                          : 'border-gray-300 bg-white text-gray-900'
                  }`}
              />
          </div>
      </div>
  );
}


export default GuestSelectorPreview