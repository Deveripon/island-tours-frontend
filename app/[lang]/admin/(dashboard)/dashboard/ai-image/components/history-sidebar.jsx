import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Menu01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion } from 'framer-motion';
import {
    History as HistoryIcon,
    MessageSquare,
    MessageSquarePlus,
} from 'lucide-react';
import Image from 'next/image';

const HistorySidebar = ({
    isHistoryOpen,
    setIsHistoryOpen,
    chats,
    activeChatId,
    setActiveChatId,
    startNewChat }) => {
    return (
        <div
            className={cn(
                'history bg-card border border-white/5 rounded-2xl p-4 flex flex-col transition-all duration-300',
                // Mobile: Adapts height based on open state
                'w-full',
                // Desktop: Fixed height (full), animate width
                'lg:w-auto lg:h-[750px]'
            )}>
            <div className='flex justify-between w-full mb-2'>
                <div
                    className={cn(
                        'flex items-center gap-2 overflow-hidden transition-all duration-300',
                        isHistoryOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'
                    )}>
                    {/* New Chat Button when open */}
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={startNewChat}
                        className='bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white text-xs gap-2 rounded-full h-8 px-4 w-full'>
                        <MessageSquarePlus className='w-4 h-4' />
                        <span className='whitespace-nowrap'>New Chat</span>
                    </Button>
                </div>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                            className='h-8 w-8 text-white/50 hover:text-white hover:bg-white/10 rounded-full shrink-0'>
                            <HugeiconsIcon
                                icon={Menu01Icon}
                                size={24}
                                color='white'
                            />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{isHistoryOpen ? 'Close Sidebar' : 'History'}</p>
                    </TooltipContent>
                </Tooltip>
            </div>

            {/* DESKTOP ANIMATION (Width) */}
            <motion.div
                initial={false}
                animate={{
                    width: isHistoryOpen ? 320 : 0,
                    opacity: isHistoryOpen ? 1 : 0,
                    marginRight: isHistoryOpen ? 24 : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='hidden lg:flex flex-col h-full overflow-hidden'>
                <SidebarContent
                    chats={chats}
                    activeChatId={activeChatId}
                    setActiveChatId={setActiveChatId}
                />
            </motion.div>

            {/* MOBILE ANIMATION (Height) */}
            <motion.div
                initial={false}
                animate={{
                    height: isHistoryOpen ? 400 : 0,
                    opacity: isHistoryOpen ? 1 : 0,
                    marginBottom: isHistoryOpen ? 16 : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='lg:hidden flex flex-col overflow-hidden w-full'>
                <SidebarContent
                    chats={chats}
                    activeChatId={activeChatId}
                    setActiveChatId={setActiveChatId}
                />
            </motion.div>
        </div>
    );
};

// Extracted internal component for reusability in mobile/desktop views
const SidebarContent = ({ chats = [], activeChatId, setActiveChatId }) => (
    <div className='flex flex-col overflow-hidden relative h-full'>
        <div className='flex items-center justify-between mb-4 text-white/80 px-2'>
            <div className='flex items-center gap-2'>
                <h3 className='font-medium text-sm'>Recent Chats</h3>
            </div>
        </div>

        <div className='flex-1 overflow-hidden'>
            <ScrollArea className='h-full -mx-2 px-2'>
                <div className='space-y-2 pb-4'>
                    {chats.length === 0 ? (
                        <div className='flex flex-col items-center justify-center py-10 text-neutral-500 gap-2'>
                            <HistoryIcon className='w-8 h-8 opacity-20' />
                            <p className='text-xs text-center px-4'>
                                No recent history
                            </p>
                        </div>
                    ) : (
                        chats.map(chat => (
                            <button
                                key={chat.id}
                                onClick={() => setActiveChatId(chat.id)}
                                className={cn(
                                    'w-full max-w-[320px] px-2 text-left group relative rounded-xl overflow-hidden border transition-all duration-300 p-3 flex gap-3 items-start',
                                    activeChatId === chat.id
                                        ? 'bg-white/10 border-white/20'
                                        : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'
                                )}>
                                {/* Thumbnail (Latest Image) */}
                                <div className='w-10 h-10 rounded-lg overflow-hidden bg-white/5 border border-white/10 shrink-0 relative'>
                                    {chat.messages && chat.messages[0]?.url ? (
                                        <Image
                                            src={chat.messages[0].url}
                                            alt={chat.title}
                                            fill
                                            className='object-cover'
                                        />
                                    ) : (
                                        <MessageSquare className='w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20' />
                                    )}
                                </div>

                                <div className='flex-1 overflow-hidden'>
                                    <p
                                        className={cn(
                                            'text-sm font-medium truncate',
                                            activeChatId === chat.id
                                                ? 'text-white'
                                                : 'text-white/70 group-hover:text-white'
                                        )}>
                                        {chat.title}
                                    </p>
                                    <p className='text-[10px] text-neutral-400 mt-1 flex items-center gap-2'>
                                        {chat.updatedAt
                                            ? new Date(
                                                  chat.updatedAt
                                              ).toLocaleTimeString([], {
                                                  hour: '2-digit',
                                                  minute: '2-digit' })
                                            : 'Just now'}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    </div>
);

export default HistorySidebar;

