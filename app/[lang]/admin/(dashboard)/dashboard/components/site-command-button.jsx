import { ChevronUp, ExternalLink, Globe, Shield, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function SiteCommandDropdown({ preferences, content }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = e => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle keyboard shortcuts
    const handleKeyDown = useCallback(
        e => {
            if (e.metaKey && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                window.open(
                    `${process.env.NEXT_PUBLIC_STAGING_APP_URL}`,
                    '_blank'
                );
            }
            if (e.key === 'Escape') {
                setOpen(false);
            }
        },
        [preferences]
    );

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [handleKeyDown]);

    // Handle item clicks
    function handleItemClick(clickOn) {
        setOpen(false);
        switch (clickOn) {
            case 'visitWebsite':
                window.open(
                    `${process.env.NEXT_PUBLIC_STAGING_APP_URL}`,
                    '_blank'
                );
                break;
            case 'purgeCache':
                break;
            case 'clearAllCache':
                break;
            default:
                break;
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen  p-8'>
            <div className='relative inline-block text-left' ref={dropdownRef}>
                {/* Trigger Button */}
                <button
                    onClick={() => setOpen(!open)}
                    className='inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors'>
                    <Globe className='w-4 h-4 mr-2' />
                    {content?.visitSite}
                    <ChevronUp
                        className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                            open ? 'rotate-180' : ''
                        }`}
                    />
                </button>

                {/* Dropdown Menu */}
                {open && (
                    <div className='absolute right-0 mt-2 w-65 bg-background border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden text-sm'>
                        {/* Header Section */}
                        <div className='p-4'>
                            <p className='font-semibold text-gray-900'>
                                {preferences?.siteName || 'Your Website'}
                            </p>
                            <p className='text-gray-500 text-sm'>
                                {content?.manageSite}
                            </p>
                        </div>

                        {/* Menu Items */}
                        <div className='divide-y divide-gray-200'>
                            {/* Main Actions */}
                            <div className='py-1'>
                                <DropdownItem
                                    icon={<ExternalLink size={16} />}
                                    label={content?.visitSite}
                                    shortcut='⌘ + K'
                                    onClick={() =>
                                        handleItemClick('visitWebsite')
                                    }
                                    highlighted
                                />
                            </div>

                            {/* Site Protection */}
                            <div className='py-1'>
                                <div className='px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider'>
                                    {content?.siteProtection}
                                </div>
                                <DropdownItem
                                    icon={<Shield size={16} />}
                                    label={content?.purgeCache}
                                    description={content?.clearSiteCache}
                                    onClick={() =>
                                        handleItemClick('purgeCache')
                                    }
                                />
                            </div>

                            {/* Site Cache */}
                            <div className='py-1'>
                                <div className='px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider'>
                                    {content?.siteCache}
                                </div>
                                <div className='px-4 py-2 text-sm text-gray-400 italic'>
                                    {content?.noItemsAvailable}
                                </div>
                            </div>

                            {/* Cloudflare Cache */}
                            <div className='py-1'>
                                <div className='px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider'>
                                    {content?.cloudflareCache}
                                </div>
                                <DropdownItem
                                    icon={<Trash2 size={16} />}
                                    label={content?.clearAllCache}
                                    description={content?.removeAllCache}
                                    onClick={() =>
                                        handleItemClick('clearAllCache')
                                    }
                                    primary
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function DropdownItem({
    icon,
    label,
    description,
    shortcut,
    highlighted = false,
    primary = false,
    onClick }) {
    const baseClassName =
        'flex justify-between items-center w-full px-4 py-2 hover:bg-gray-100 transition text-left';

    let className = baseClassName;
    if (highlighted) {
        className += ' bg-primary/10 text-primary';
    } else if (primary) {
        className += ' text-primary';
    } else {
        className += ' text-gray-700';
    }

    return (
        <button className={className} onClick={onClick}>
            <div className='flex items-center gap-2'>
                {icon}
                <div className='flex flex-col items-start'>
                    <span className='font-medium'>{label}</span>
                    {description && (
                        <span className='text-sm text-gray-500'>
                            {description}
                        </span>
                    )}
                </div>
            </div>
            {shortcut && (
                <span className='text-sm text-gray-400 font-mono'>
                    {shortcut}
                </span>
            )}
        </button>
    );
}

