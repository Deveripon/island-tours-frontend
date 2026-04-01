'use client';
import {
    Bookmark01Icon,
    Facebook01Icon,
    Linkedin01Icon,
    NewTwitterIcon,
    Share08Icon,
    Tick01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useState } from 'react';
import {
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
} from 'react-share';

const Controls = ({ postTitle, postUrl }) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [shareTitle, setShareTitle] = useState('');

    useEffect(() => {
        // Get the current URL
        if (typeof window !== 'undefined') {
            setShareUrl(postUrl || window.location.href);
        }

        // Get the share title
        if (postTitle) {
            setShareTitle(postTitle);
        } else if (typeof document !== 'undefined') {
            setShareTitle(document.title);
        }
    }, [postTitle, postUrl]);

    const handleShare = async () => {
        // Check if native share is available (mobile devices)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    url: shareUrl });
            } catch (err) {
                // User cancelled or error occurred
                if (err.name !== 'AbortError') {
                    console.error('Error sharing:', err);
                    setShowShareMenu(true);
                }
            }
        } else {
            // Fallback to custom share menu
            setShowShareMenu(!showShareMenu);
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
                setShowShareMenu(false);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    // Close share menu when clicking outside
    useEffect(() => {
        const handleClickOutside = e => {
            if (showShareMenu && !e.target.closest('.share-menu-container')) {
                setShowShareMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [showShareMenu]);

    return (
        <div className='ml-auto flex items-center gap-3'>
            <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg transition-colors ${
                    isBookmarked
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}>
                <HugeiconsIcon icon={Bookmark01Icon} className='w-5 h-5' />
            </button>

            <div className='relative share-menu-container'>
                <button
                    onClick={handleShare}
                    className='p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
                    title='Share'>
                    <HugeiconsIcon icon={Share08Icon} className='w-5 h-5' />
                </button>

                {/* Share Menu */}
                {showShareMenu && (
                    <div className='absolute right-0 mt-2 w-56 bg-card rounded-lg shadow-lg border border-border z-50 py-2'>
                        <div className='px-3 py-2 border-b border-border'>
                            <p className='text-sm font-semibold text-foreground'>
                                Share this post
                            </p>
                        </div>

                        <div className='py-2'>
                            <TwitterShareButton
                                url={shareUrl}
                                title={shareTitle}
                                className='w-full px-4 py-2 flex items-center gap-3 hover:bg-accent transition-colors text-left'>
                                <div className='w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center'>
                                    <HugeiconsIcon
                                        icon={NewTwitterIcon}
                                        className='w-4 h-4 text-white'
                                    />
                                </div>
                                <span className='text-sm text-foreground font-medium'>
                                    Twitter
                                </span>
                            </TwitterShareButton>

                            <FacebookShareButton
                                url={shareUrl}
                                quote={shareTitle}
                                className='w-full px-4 py-2 flex items-center gap-3 hover:bg-accent transition-colors text-left'>
                                <div className='w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center'>
                                    <HugeiconsIcon
                                        icon={Facebook01Icon}
                                        className='w-4 h-4 text-white'
                                    />
                                </div>
                                <span className='text-sm text-foreground font-medium'>
                                    Facebook
                                </span>
                            </FacebookShareButton>

                            <LinkedinShareButton
                                url={shareUrl}
                                title={shareTitle}
                                className='w-full px-4 py-2 flex items-center gap-3 hover:bg-accent transition-colors text-left'>
                                <div className='w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center'>
                                    <HugeiconsIcon
                                        icon={Linkedin01Icon}
                                        className='w-4 h-4 text-white'
                                    />
                                </div>
                                <span className='text-sm text-foreground font-medium'>
                                    LinkedIn
                                </span>
                            </LinkedinShareButton>

                            <button
                                onClick={handleCopyLink}
                                className='w-full px-4 py-2 flex items-center gap-3 hover:bg-accent transition-colors text-left'>
                                <div className='w-8 h-8 rounded-full bg-muted flex items-center justify-center'>
                                    {copied ? (
                                        <HugeiconsIcon
                                            icon={Tick01Icon}
                                            className='w-4 h-4 text-white'
                                        />
                                    ) : (
                                        <HugeiconsIcon
                                            icon={Share08Icon}
                                            className='w-4 h-4 text-white'
                                        />
                                    )}
                                </div>
                                <span className='text-sm text-foreground font-medium'>
                                    {copied ? 'Link copied!' : 'Copy link'}
                                </span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Controls;

