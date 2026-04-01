'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowDown01Icon,
    FloppyDiskIcon,
    Globe02Icon,
    Loading03Icon,
    Tick02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const LanguageSettings = () => {
    const [selectedLang, setSelectedLang] = useState('en');
    const [currentLang, setCurrentLang] = useState('en');
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Language options
    const languages = useMemo(
        () => [
            { code: 'en', name: 'English', flag: '🇺🇸' },
            { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
        ],
        []
    );

    // Get current language from URL path
    const getLanguageFromURL = useCallback(() => {
        if (typeof window === 'undefined') return 'en';

        const segments = window.location.pathname.split('/').filter(Boolean);
        const firstSegment = segments[0];

        const supportedCodes = languages.map(lang => lang.code);
        if (supportedCodes.includes(firstSegment)) {
            return firstSegment;
        }

        return 'en';
    }, [languages]);

    // Initialize current language
    useEffect(() => {
        const urlLang = getLanguageFromURL();
        setCurrentLang(urlLang);
        setSelectedLang(urlLang);
    }, [getLanguageFromURL]);

    // Check for changes
    useEffect(() => {
        setHasChanges(selectedLang !== currentLang);
    }, [selectedLang, currentLang]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = event => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Save language preference
    const saveLanguagePreference = langCode => {
        try {
            localStorage.setItem('preferredLanguage', langCode);
            document.cookie = `preferred-language=${langCode}; path=/; max-age=${
                365 * 24 * 60 * 60
            }; SameSite=Lax${
                window.location.protocol === 'https:' ? '; Secure' : ''
            }`;
            return true;
        } catch (error) {
            return false;
        }
    };

    // Handle language selection
    const handleLanguageSelect = langCode => {
        setSelectedLang(langCode);
        setIsDropdownOpen(false);
        setSaveStatus(null);
    };

    // Handle save
    const handleSave = async () => {
        if (!hasChanges || isSaving) return;

        setIsSaving(true);
        setSaveStatus(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 800));

            const success = saveLanguagePreference(selectedLang);

            if (success) {
                const currentURL = new URL(window.location.href);
                const segments = currentURL.pathname.split('/').filter(Boolean);

                const supportedCodes = languages.map(lang => lang.code);
                if (supportedCodes.includes(segments[0])) {
                    segments.shift();
                }

                const newPathname = `/${selectedLang}/${segments.join('/')}`;
                const newURL = new URL(newPathname, currentURL.origin);
                newURL.search = currentURL.search;
                newURL.hash = currentURL.hash;

                setCurrentLang(selectedLang);
                setSaveStatus('success');

                setTimeout(() => {
                    window.location.href = newURL.href;
                }, 1200);
            } else {
                setSaveStatus('error');
            }
        } catch (error) {
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    const selectedLanguage =
        languages.find(lang => lang.code === selectedLang) || languages[0];

    return (
        <Card className='mb-12'>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <HugeiconsIcon icon={Globe02Icon} size={20} />
                    Language Settings
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='grid grid-cols-1 sm:grid-cols-2 place-content-center md:grid-cols-3 gap-4'>
                    {/* Language Selector */}
                    <div className='mb-6'>
                        <label className='text-sm font-medium text-foreground '>
                            Interface Language
                        </label>

                        <div className='relative mt-2' ref={dropdownRef}>
                            <button
                                onClick={() =>
                                    setIsDropdownOpen(!isDropdownOpen)
                                }
                                className='w-full flex items-center justify-between px-4 py-2 text-left border border-input rounded-lg hover:border-ring focus:outline-none transition-colors duration-200 bg-background'>
                                <div className='flex items-center'>
                                    <span className='text-xs mr-3'>
                                        {selectedLanguage.flag}
                                    </span>
                                    <span className=' text-sm font-normal text-foreground'>
                                        {selectedLanguage.name}
                                    </span>
                                </div>
                                <HugeiconsIcon
                                    icon={ArrowDown01Icon}
                                    size={16}
                                    className={`text-muted-foreground transition-transform duration-200 ${
                                        isDropdownOpen
                                            ? 'transform rotate-180'
                                            : ''
                                    }`}
                                />
                            </button>

                            {/* Dropdown Options */}
                            {isDropdownOpen && (
                                <div className='absolute top-full left-0 right-0 mt-1 bg-popover border border-input rounded-lg shadow-lg z-10'>
                                    <div className='py-1'>
                                        {languages.map(language => (
                                            <button
                                                key={language.code}
                                                onClick={() =>
                                                    handleLanguageSelect(
                                                        language.code
                                                    )
                                                }
                                                className={`w-full flex items-center justify-between px-4 py-3 text-left font-normal text-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-150 ${
                                                    selectedLang ===
                                                    language.code
                                                        ? 'bg-primary/10'
                                                        : ''
                                                }`}>
                                                <div className='flex items-center'>
                                                    <span className='text-xs mr-3'>
                                                        {language.flag}
                                                    </span>
                                                    <span
                                                        className={` ${
                                                            selectedLang ===
                                                            language.code
                                                                ? 'text-primary'
                                                                : 'text-foreground'
                                                        }`}>
                                                        {language.name}
                                                    </span>
                                                </div>
                                                {selectedLang ===
                                                    language.code && (
                                                    <HugeiconsIcon
                                                        icon={Tick02Icon}
                                                        size={16}
                                                        className='text-primary'
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Save Button */}
                </div>

                <Button
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                    className={` my-auto  w-fit  flex items-center justify-center rounded-lg  focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                        hasChanges && !isSaving
                            ? 'bg-primary hover:bg-primary/90 text-primary-foreground focus:ring-ring shadow-sm'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}>
                    {isSaving ? (
                        <>
                            <HugeiconsIcon
                                icon={Loading03Icon}
                                size={16}
                                className='mr-2 animate-spin'
                            />
                            Saving...
                        </>
                    ) : (
                        <>
                            <HugeiconsIcon
                                icon={FloppyDiskIcon}
                                size={16}
                                className='mr-2'
                            />
                            Save Changes
                        </>
                    )}
                </Button>
                <div className='my-5'>
                    {/* Status Messages */}
                    {saveStatus === 'success' && (
                        <div className='mb-6 p-3 bg-green-50 border border-green-200 rounded-lg'>
                            <p className='text-xs text-green-800 '>
                                Language updated successfully!
                            </p>
                            <p className='text-xs text-green-700 mt-1'>
                                Redirecting...
                            </p>
                        </div>
                    )}

                    {saveStatus === 'error' && (
                        <div className='mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg'>
                            <p className='text-xs text-destructive '>
                                Failed to update language
                            </p>
                            <p className='text-xs text-destructive/80 mt-1'>
                                Please try again
                            </p>
                        </div>
                    )}

                    {/* Changes Indicator */}
                    {hasChanges && !saveStatus && (
                        <p className='text-xs text-muted-foreground text-center mt-3'>
                            You have unsaved changes
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default LanguageSettings;

