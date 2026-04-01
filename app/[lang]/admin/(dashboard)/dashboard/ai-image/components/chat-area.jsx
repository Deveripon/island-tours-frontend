import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
    Check,
    Copy,
    Download,
    Loader2,
    Share2,
    Sparkles,
    UploadCloud,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import ShimmerEffect from './shimmer-effect';

const ChatArea = ({
    history,
    status,
    prompt,
    attachments,
    handleDownload,
    handleCopy,
    handleCloudinary,
    handleShare,
    isDownloading,
    copied,
    children }) => {
    const { data: session } = useSession();

    return (
        <div className='flex-1 w-full h-full lg:max-h-[750px] flex flex-col relative bg-card rounded-2xl border border-white/5 overflow-hidden hide-scrollbar'>
            <div className='main-content mx-auto pt-8 w-full h-full flex flex-col'>
                {/* CHAT / SCROLL AREA */}
                <ScrollArea className='flex-1 w-full hide-scrollbar'>
                    <div className='flex max-w-4xl mx-auto flex-col min-h-full p-4 gap-8'>
                        {/* WELCOME / EMPTY STATE */}
                        {history.length === 0 && status !== 'generating' && (
                            <div className='flex-1 flex flex-col items-center justify-center min-h-[400px] space-y-6'>
                                <div className='space-y-2 text-center'>
                                    <h1 className='text-4xl md:text-5xl font-medium tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent'>
                                        Hello,{' '}
                                        {session?.user?.name?.split(' ')[0] ||
                                            'Creator'}
                                    </h1>
                                    <p className='text-xl text-white/40 font-medium'>
                                        Where should we start?
                                    </p>
                                </div>
                            </div>
                        )}
                        {/* HISTORY STREAM (Reversed for Chronological Chat View) */}
                        {[...history].reverse().map(item => (
                            <div key={item.id} className='flex flex-col gap-4'>
                                {/* USER PROMPT */}
                                <div className='flex justify-end'>
                                    <div className='bg-white/10 text-white px-5 py-3 rounded-[2rem] rounded-tr-sm max-w-[80%] flex flex-col gap-3'>
                                        {/* MULTIPLE IMAGES IN CHAT BUBBLE */}
                                        {item.userInputImages?.length > 0 && (
                                            <div className='flex flex-wrap gap-2 justify-end'>
                                                {item.userInputImages.map(
                                                    (img, i) => (
                                                        <div
                                                            key={i}
                                                            className='relative w-32 h-32 rounded-xl overflow-hidden border border-white/10'>
                                                            <Image
                                                                src={img}
                                                                alt='User input'
                                                                fill
                                                                className='object-cover'
                                                            />
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                        <p>{item.prompt}</p>
                                    </div>
                                </div>

                                {/* AI RESPONSE */}
                                <div className='flex justify-start gap-4'>
                                    <div className='w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0 mt-1'>
                                        <Sparkles className='w-4 h-4 text-white' />
                                    </div>
                                    <div className='max-w-[80%] space-y-3'>
                                        <div className='relative group rounded-2xl overflow-hidden border border-white/10 bg-black/20'>
                                            <Image
                                                src={item.url}
                                                alt={item.prompt}
                                                width={350}
                                                height={350}
                                                className='w-[350px] h-[350px] object-cover'
                                            />

                                            {/* FLOATING ACTION TOOLBAR */}
                                            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-xl p-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-2xl z-20'>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant='ghost'
                                                            size='icon'
                                                            onClick={() =>
                                                                handleDownload(
                                                                    item.url,
                                                                    item.id
                                                                )
                                                            }
                                                            disabled={
                                                                isDownloading
                                                            }
                                                            className={cn(
                                                                'text-white hover:bg-white/20 hover:text-white rounded-full h-9 w-9 transition-all',
                                                                isDownloading &&
                                                                    'animate-pulse bg-white/10 cursor-not-allowed'
                                                            )}>
                                                            {isDownloading ? (
                                                                <Loader2 className='w-4 h-4 animate-spin' />
                                                            ) : (
                                                                <Download className='w-4 h-4' />
                                                            )}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Download</p>
                                                    </TooltipContent>
                                                </Tooltip>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant='ghost'
                                                            size='icon'
                                                            onClick={() =>
                                                                handleCopy(
                                                                    item.url
                                                                )
                                                            }
                                                            className='text-white hover:bg-white/20 hover:text-white rounded-full h-9 w-9'>
                                                            {copied ? (
                                                                <Check className='w-4 h-4 text-green-500' />
                                                            ) : (
                                                                <Copy className='w-4 h-4' />
                                                            )}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Copy Link</p>
                                                    </TooltipContent>
                                                </Tooltip>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant='ghost'
                                                            size='icon'
                                                            onClick={() =>
                                                                handleCloudinary(
                                                                    item.url,
                                                                    item.prompt
                                                                )
                                                            }
                                                            disabled={
                                                                status ===
                                                                'uploading'
                                                            }
                                                            className={cn(
                                                                'text-white hover:bg-white/20 hover:text-white rounded-full h-9 w-9 transition-all',
                                                                status ===
                                                                    'uploading' &&
                                                                    'animate-pulse bg-white/10 cursor-not-allowed'
                                                            )}>
                                                            {status ===
                                                            'uploading' ? (
                                                                <Loader2 className='w-4 h-4 animate-spin' />
                                                            ) : (
                                                                <UploadCloud className='w-4 h-4' />
                                                            )}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            {status ===
                                                            'uploading'
                                                                ? 'Uploading...'
                                                                : 'Upload to Media Library'}
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>

                                                <div className='w-px h-4 bg-white/20 mx-1' />

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant='ghost'
                                                            size='icon'
                                                            onClick={() =>
                                                                handleShare(
                                                                    item.prompt
                                                                )
                                                            }
                                                            className='text-white hover:bg-white/20 hover:text-white rounded-full h-9 w-9'>
                                                            <Share2 className='w-4 h-4' />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Share</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* GENERATING STATE (Bottom of list) */}
                        {status === 'generating' && (
                            <div className='flex flex-col gap-4'>
                                {/* PENDING USER PROMPT */}
                                <div className='flex justify-end'>
                                    <div className='bg-white/10 text-white px-5 py-3 rounded-[2rem] rounded-tr-sm max-w-[80%] opacity-70'>
                                        {/* Show the image currently in the state (attachment) while loading */}
                                        {attachments.length > 0 && (
                                            <div className='flex flex-wrap gap-2 justify-end'>
                                                {attachments.map((img, i) => (
                                                    <div
                                                        key={i}
                                                        className='relative w-24 h-24 rounded-lg overflow-hidden border border-white/5'>
                                                        <Image
                                                            src={img}
                                                            alt='Uploading'
                                                            fill
                                                            className='object-cover'
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <p>{prompt}</p>
                                    </div>
                                </div>

                                {/* GENERATING SKELETON */}
                                <div className='flex justify-start gap-4'>
                                    <div className='w-8 h-8 rounded-full  p-2 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0 mt-1 animate-pulse'>
                                        <Sparkles className='w-4 h-4 text-white' />
                                    </div>
                                    <div className='w-full p-2 max-w-[350px] aspect-square rounded-2xl !overflow-hidden relative border border-white/10'>
                                        <ShimmerEffect />
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Spacer for scrolling */}
                        <div className='h-32' />{' '}
                        {/* Added more spacer for the floating input */}
                    </div>
                </ScrollArea>
                {children}
            </div>
        </div>
    );
};

export default ChatArea;

