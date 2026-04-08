'use client';
import { cn } from '@/lib/utils';
import {
    ArrowRight01Icon,
    DashboardSquare01Icon,
    EyeIcon,
    Globe02Icon,
    Home01Icon,
    LicenseDraftIcon,
    Logout01Icon,
    PencilEdit01Icon,
    Settings02Icon,
    UserCircleIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useAdmin } from '../hooks/useAdmin';

export default function AdminBar() {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);
    const {
        mode,
        setMode,
        MODES,
        isTripDetailsPage,
        isAdmin,
        handleLogout,
        user,
        lang,
    } = useAdmin();

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const handleStatus = e => setIsSaving(e.detail.isSaving);
        document.addEventListener('EDITOR_STATUS_UPDATE', handleStatus);
        return () =>
            document.removeEventListener('EDITOR_STATUS_UPDATE', handleStatus);
    }, []);

    useEffect(() => {
        const handleClickOutside = event => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = dropdown => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    if (!isAdmin || !isTripDetailsPage) {
        return null;
    }

    return (
        <motion.div
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{
                duration: 0.3,
                ease: 'easeIn',
            }}
            className='fixed top-0 left-0 right-0 z-[200] bg-gray-950/95 backdrop-blur-xl border-b border-white/10 shadow-2xl'
            ref={dropdownRef}>
            <div className='max-w-screen-2xl mx-auto px-4 sm:px-6'>
                <div className='flex items-center justify-between py-2.5'>
                    {/* Left Section: Brand & Navigation */}
                    <div className='flex flex-1 items-center justify-start gap-4 sm:gap-8'>
                        <div className='flex items-center gap-2.5 group cursor-pointer'>
                            <div className='w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors shrink-0'>
                                <HugeiconsIcon
                                    icon={Home01Icon}
                                    size={18}
                                    className='text-primary'
                                />
                            </div>
                            <div className='hidden sm:flex flex-col leading-none'>
                                <span className='text-[11px] font-black text-white tracking-tight'>
                                    TripWheel
                                </span>
                                <span className='text-[8px] text-white/40 font-bold uppercase tracking-[0.2em] mt-0.5 hidden md:block'>
                                    Site Editor
                                </span>
                            </div>
                        </div>

                        <div className='h-8 w-px bg-white/10 hidden sm:block' />

                        <div className='hidden sm:flex items-center gap-1'>
                            <Link
                                href={`/${lang}/admin/dashboard`}
                                className='flex items-center gap-2 px-3 py-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all text-xs font-medium group'>
                                <HugeiconsIcon
                                    icon={DashboardSquare01Icon}
                                    size={16}
                                    className='group-hover:scale-110 transition-transform'
                                />
                                Dashboard
                            </Link>
                        </div>
                    </div>

                    {/* Center Section: Mode Toggle */}
                    <div className='flex items-center  justify-center flex-1 px-2 max-w-xs mx-auto sm:ml-16'>
                        <div className='flex items-center bg-white/10 p-1 px-3 rounded-2xl border border-white/5 shadow-2xl relative w-full h-10'>
                            <button
                                type='button'
                                title='Preview Mode'
                                onClick={e => {
                                    e.preventDefault();
                                    setMode(MODES.preview);
                                }}
                                className={cn(
                                    'flex-1 flex items-center justify-center h-full rounded-xl text-[10px] font-black transition-all duration-300 relative z-10',
                                    mode === MODES.preview
                                        ? 'text-white bg-primary sm:bg-transparent'
                                        : 'text-white/40 hover:text-white/70'
                                )}>
                                <span className='hidden sm:inline'>
                                    PREVIEW
                                </span>
                                <HugeiconsIcon
                                    icon={EyeIcon}
                                    size={16}
                                    className='sm:hidden'
                                />
                            </button>
                            <button
                                type='button'
                                title='Edit Mode'
                                onClick={e => {
                                    e.preventDefault();
                                    setMode(MODES.edit);
                                }}
                                className={cn(
                                    'flex-1 flex items-center justify-center h-full rounded-xl text-[10px] font-black transition-all duration-300 relative z-10',
                                    mode === MODES.edit
                                        ? 'text-white bg-primary sm:bg-transparent'
                                        : 'text-white/40 hover:text-white/70'
                                )}>
                                <span className='hidden sm:inline'>EDIT</span>
                                <HugeiconsIcon
                                    icon={PencilEdit01Icon}
                                    size={16}
                                    className='sm:hidden'
                                />
                            </button>
                            <button
                                type='button'
                                title='Public View'
                                onClick={e => {
                                    e.preventDefault();
                                    setMode(MODES.public);
                                }}
                                className={cn(
                                    'flex-1 flex items-center justify-center h-full rounded-xl text-[10px] font-black transition-all duration-300 relative z-10',
                                    mode === MODES.public
                                        ? 'text-white bg-primary sm:bg-transparent'
                                        : 'text-white/40 hover:text-white/70'
                                )}>
                                <span className='hidden sm:inline'>PUBLIC</span>
                                <HugeiconsIcon
                                    icon={Globe02Icon}
                                    size={16}
                                    className='sm:hidden'
                                />
                            </button>

                            {/* Sliding Indicator */}
                            <motion.div
                                className='absolute inset-y-1 bg-primary rounded-xl shadow-lg shadow-primary/20 hidden sm:block'
                                initial={false}
                                animate={{
                                    left:
                                        mode === MODES.edit
                                            ? 'calc(33.33% + 8px)'
                                            : mode === MODES.public
                                              ? 'calc(66.66% + 4px)'
                                              : '12px',
                                    width: 'calc(33.33% - 16px)',
                                }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 500,
                                    damping: 38,
                                }}
                            />
                        </div>
                    </div>

                    {/* Right Section: User & Actions */}
                    <div className='flex items-center justify-end z-[100] gap-2 sm:gap-4 flex-1'>
                        {/* Editor Actions - Only in Edit Mode */}
                        <AnimatePresence>
                            {mode === MODES.edit && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 300,
                                        damping: 25,
                                    }}
                                    className='flex items-center gap-2 border-l border-white/10 pl-4 h-8'>
                                    <button
                                        type='button'
                                        title='Save Draft'
                                        onClick={e => {
                                            e.preventDefault();
                                            document.dispatchEvent(
                                                new CustomEvent(
                                                    'EDITOR_SAVE_DRAFT'
                                                )
                                            );
                                        }}
                                        disabled={isSaving}
                                        className='flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-black transition-all border border-blue-400/20 disabled:opacity-50 active:scale-95 shadow-lg shadow-blue-500/10'>
                                        <HugeiconsIcon
                                            icon={LicenseDraftIcon}
                                            size={16}
                                        />
                                        <span className='hidden md:inline'>
                                            {isSaving
                                                ? 'SAVING...'
                                                : 'SAVE DRAFT'}
                                        </span>
                                    </button>

                                    <button
                                        type='button'
                                        title='Publish Changes'
                                        onClick={e => {
                                            e.preventDefault();
                                            document.dispatchEvent(
                                                new CustomEvent(
                                                    'EDITOR_PUBLISH'
                                                )
                                            );
                                        }}
                                        disabled={isSaving}
                                        className='flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-[10px] font-black transition-all border border-primary/20 disabled:opacity-50 shadow-lg shadow-primary/20 active:scale-95'>
                                        <HugeiconsIcon
                                            icon={Globe02Icon}
                                            size={16}
                                        />
                                        <span className='hidden md:inline'>
                                            {isSaving
                                                ? 'PUBLISHING...'
                                                : 'PUBLISH'}
                                        </span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div className='relative'>
                            <button
                                type='button'
                                onClick={e => {
                                    e.preventDefault();
                                    toggleDropdown('user');
                                }}
                                className='flex items-center gap-2 p-2 md:p-1.5 md:px-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group'>
                                <div className='w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-primary-foreground/50 flex items-center justify-center text-[9px] font-bold text-white shadow-sm overflow-hidden relative'>
                                    {user?.image ? (
                                        <Image
                                            src={
                                                typeof user.image === 'string'
                                                    ? user.image
                                                    : user.image?.url ||
                                                      'https://github.com/shadcn.png'
                                            }
                                            alt={user?.name || 'User'}
                                            fill
                                            className='object-cover'
                                        />
                                    ) : (
                                        user?.name?.[0]?.toUpperCase() || 'A'
                                    )}
                                </div>
                                <span className='text-[11px] font-semibold text-white/80 group-hover:text-white transition-colors hidden sm:inline'>
                                    {user?.name?.split(' ')[0] || 'Admin'}
                                </span>
                            </button>

                            <AnimatePresence>
                                {activeDropdown === 'user' && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: 10,
                                            scale: 0.95,
                                        }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{
                                            opacity: 0,
                                            y: 10,
                                            scale: 0.95,
                                        }}
                                        className='absolute top-full right-0 mt-3 w-56 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2'>
                                        <div className='px-4 py-2 border-b border-white/5 mb-2'>
                                            <p className='text-xs font-bold text-white leading-none'>
                                                {user?.name || 'Administrator'}
                                            </p>
                                            <p className='text-[10px] text-white/40 font-medium mt-1 truncate'>
                                                {user?.email ||
                                                    'admin@tripwheel.com'}
                                            </p>
                                        </div>

                                        <Link
                                            target='_blank'
                                            href={`/${lang}/admin/dashboard/profile`}
                                            className='w-full flex items-center gap-3 px-4 py-2.5 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left group'>
                                            <HugeiconsIcon
                                                icon={UserCircleIcon}
                                                size={16}
                                            />
                                            Profile Settings
                                            <HugeiconsIcon
                                                icon={ArrowRight01Icon}
                                                size={12}
                                                className='ml-auto text-white/20 group-hover:translate-x-1 transition-transform'
                                            />
                                        </Link>

                                        <Link
                                            target='_blank'
                                            href={`/${lang}/admin/dashboard/site-settings`}
                                            className='w-full flex items-center gap-3 px-4 py-2.5 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left group'>
                                            <HugeiconsIcon
                                                icon={Settings02Icon}
                                                size={16}
                                            />
                                            Site Settings
                                            <HugeiconsIcon
                                                icon={ArrowRight01Icon}
                                                size={12}
                                                className='ml-auto text-white/20 group-hover:translate-x-1 transition-transform'
                                            />
                                        </Link>

                                        <div className='h-px bg-white/5 my-2' />

                                        <button
                                            type='button'
                                            onClick={e => {
                                                e.preventDefault();
                                                handleLogout();
                                            }}
                                            className='w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors text-left'>
                                            <HugeiconsIcon
                                                icon={Logout01Icon}
                                                size={16}
                                            />
                                            Logout Session
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

