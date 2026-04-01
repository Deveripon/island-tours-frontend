'use client';

import LoginForm from './sign-in/login-form';

export default function Content() {
    return (
        <div className='content h-dvh flex justify-center items-center relative lg:px-[64px] px-4 py-12 sm:py-16'>
            <div className='mx-auto z-30 sm:w-auto max-w-lg liquid-glass-enhanced rounded-2xl '>
                <LoginForm className='max-w-lg liquid-glass-enhanced rounded-2xl' />
            </div>
        </div>
    );
}

