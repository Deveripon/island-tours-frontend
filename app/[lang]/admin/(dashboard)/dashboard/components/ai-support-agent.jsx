'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Message01Icon } from '@hugeicons/core-free-icons';

import {
    Conversation,
    ConversationContent,
    ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
    Message,
    MessageAction,
    MessageActions,
    MessageContent,
    MessageResponse,
} from '@/components/ai-elements/message';
import {
    PromptInput,
    PromptInputActionAddAttachments,
    PromptInputActionMenu,
    PromptInputActionMenuContent,
    PromptInputActionMenuTrigger,
    PromptInputAttachment,
    PromptInputAttachments,
    PromptInputBody,
    PromptInputFooter,
    PromptInputHeader,
    PromptInputSubmit,
    PromptInputTextarea,
    PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import { Suggestion } from '@/components/ai-elements/suggestion';
import { useChat } from '@ai-sdk/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Check,
    CopyIcon,
    Maximize2,
    MessageCircle,
    Minimize2,
    PaperclipIcon,
    RefreshCcwIcon,
    Sparkles,
    Trash2,
    X,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const suggestions = [
    'How to create a trip',
    'What destinations are available?',
    'How to set up payments?',
    'Explain the activity flow',
];

const AiSupportAgent = () => {
    const [open, setIsOpen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [input, setInput] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const scrollRef = useRef(null);
    const { messages, sendMessage, setMessages, regenerate } = useChat();
    const clearChat = () => {
        setMessages([]);
    };

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
        toast.success('Copied to clipboard');
    };
    return (
        <div className='fixed bottom-6 left-6 z-50 font-sans'>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            width: isMaximized ? '90vw' : '450px',
                            height: isMaximized ? '85vh' : '650px',
                            left: isMaximized ? '5vw' : '0',
                        }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{
                            type: 'spring',
                            damping: 20,
                            stiffness: 300,
                        }}
                        className='absolute bottom-20 left-0 flex flex-col overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-950/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[60]'>
                        {/* Header */}
                        <header className='flex shrink-0 items-center justify-between border-b border-slate-800/60 bg-slate-950/40 px-5 py-4 backdrop-blur-md'>
                            <div className='flex items-center gap-3'>
                                <div className='relative'>
                                    <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20'>
                                        <HugeiconsIcon
                                            icon={Message01Icon}
                                            className='h-6 w-6 text-white'
                                        />
                                    </div>
                                    <span className='absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-500 animate-pulse' />
                                </div>
                                <div>
                                    <h2 className='text-sm font-bold tracking-wide text-slate-100 flex items-center gap-1.5'>
                                        Support Agent
                                        <Sparkles className='size-3 text-indigo-400' />
                                    </h2>
                                    <p className='text-[11px] font-medium text-slate-400 uppercase tracking-tighter'>
                                        Always Online • Powered by AI
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-center gap-1'>
                                <Button
                                    variant='ghost'
                                    size='icon-sm'
                                    className='text-slate-400 hover:text-red-400 hover:bg-red-400/10'
                                    onClick={clearChat}
                                    title='Clear conversation'>
                                    <Trash2 className='size-4' />
                                </Button>
                                <Button
                                    variant='ghost'
                                    size='icon-sm'
                                    className='text-slate-400 hover:text-slate-100'
                                    onClick={() =>
                                        setIsMaximized(!isMaximized)
                                    }>
                                    {isMaximized ? (
                                        <Minimize2 className='size-4' />
                                    ) : (
                                        <Maximize2 className='size-4' />
                                    )}
                                </Button>
                                <Button
                                    variant='ghost'
                                    size='icon-sm'
                                    className='text-slate-400 hover:text-slate-100'
                                    onClick={() => setIsOpen(false)}>
                                    <X className='size-4' />
                                </Button>
                            </div>
                        </header>

                        <Conversation className='flex-1 overflow-hidden'>
                            <ConversationContent>
                                {messages.length === 0 ? (
                                    <div className='flex h-full flex-col items-center justify-center space-y-6 px-6 text-center animate-in fade-in zoom-in duration-500'>
                                        <div className='size-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner'>
                                            <HugeiconsIcon
                                                icon={Message01Icon}
                                                className='size-8 text-slate-400'
                                            />
                                        </div>
                                        <div>
                                            <h3 className='text-lg font-semibold text-slate-100'>
                                                How can I help you today?
                                            </h3>
                                            <p className='mt-2 text-sm text-slate-400'>
                                                Ask me anything about trips,
                                                destinations, activities or
                                                payment setup.
                                            </p>
                                        </div>
                                        <div className='flex flex-wrap justify-center gap-2'>
                                            {suggestions.map(suggestion => (
                                                <Suggestion
                                                    key={suggestion}
                                                    onClick={() => {
                                                        sendMessage({
                                                            text: suggestion });
                                                        setInput('');
                                                    }}
                                                    suggestion={suggestion}
                                                    className='bg-slate-900/50 border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-xs text-slate-300'
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {messages.map((message, idx) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                key={message.id || idx}
                                                className={cn(
                                                    'w-full overflow-hidden',
                                                    message.role === 'user'
                                                        ? 'flex justify-end'
                                                        : 'flex justify-start'
                                                )}>
                                                <Message
                                                    from={message.role}
                                                    className={cn(
                                                        'max-w-[85%] min-w-0',
                                                        message.role === 'user'
                                                            ? 'items-end'
                                                            : 'items-start'
                                                    )}>
                                                    <MessageContent
                                                        className={cn(
                                                            'rounded-2xl p-4 text-sm leading-relaxed max-w-full break-words',
                                                            message.role ===
                                                                'user'
                                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                                                                : 'bg-slate-900/80 border border-slate-800 text-slate-200'
                                                        )}>
                                                        {message.parts.map(
                                                            (part, i) => {
                                                                switch (
                                                                    part.type
                                                                ) {
                                                                    case 'text':
                                                                        return (
                                                                            <MessageResponse
                                                                                className='w-full overflow-hidden break-words'
                                                                                key={`${message.id}-${i}`}>
                                                                                {
                                                                                    part.text
                                                                                }
                                                                            </MessageResponse>
                                                                        );
                                                                }
                                                            }
                                                        )}
                                                    </MessageContent>

                                                    {message.role ===
                                                        'assistant' && (
                                                        <MessageActions className='mt-1'>
                                                            <MessageAction
                                                                onClick={() =>
                                                                    handleCopy(
                                                                        message.content,
                                                                        message.id
                                                                    )
                                                                }
                                                                label={
                                                                    copiedId ===
                                                                    message.id
                                                                        ? 'Copied'
                                                                        : 'Copy'
                                                                }>
                                                                {copiedId ===
                                                                message.id ? (
                                                                    <Check className='size-3 text-emerald-400' />
                                                                ) : (
                                                                    <CopyIcon className='size-3' />
                                                                )}
                                                            </MessageAction>
                                                            <MessageAction
                                                                onClick={() =>
                                                                    regenerate()
                                                                }
                                                                label='Regenerate'>
                                                                <RefreshCcwIcon className='size-3' />
                                                            </MessageAction>
                                                        </MessageActions>
                                                    )}
                                                </Message>
                                            </motion.div>
                                        ))}
                                        <div ref={scrollRef} />
                                    </>
                                )}
                            </ConversationContent>
                            <ConversationScrollButton />
                        </Conversation>

                        <div className='shrink-0 border-t border-slate-800/60 bg-slate-950/60 p-4 backdrop-blur-md'>
                            <PromptInput
                                globalDrop
                                multiple
                                className='relative bg-transparent border-none p-0'>
                                <PromptInputHeader className='px-1'>
                                    <PromptInputAttachments>
                                        {attachment => (
                                            <PromptInputAttachment
                                                data={attachment}
                                                className='bg-slate-900 border-slate-800'
                                            />
                                        )}
                                    </PromptInputAttachments>
                                </PromptInputHeader>

                                <PromptInputBody className='relative bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all'>
                                    <PromptInputTextarea
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        placeholder={'Type your message...'}
                                        className='min-h-[44px] max-h-32 px-4 py-3 bg-transparent border-none text-slate-200 placeholder:text-slate-500 focus-visible:ring-0'
                                    />

                                    <PromptInputFooter className='px-3 pb-3 flex items-center justify-between'>
                                        <PromptInputTools className='flex items-center gap-1'>
                                            <PromptInputActionMenu>
                                                <PromptInputActionMenuTrigger
                                                    asChild>
                                                    <Button
                                                        variant='ghost'
                                                        size='icon-sm'
                                                        className='text-slate-400 hover:text-indigo-400 hover:bg-slate-800'>
                                                        <PaperclipIcon className='size-4' />
                                                    </Button>
                                                </PromptInputActionMenuTrigger>
                                                <PromptInputActionMenuContent
                                                    align='start'
                                                    className='bg-slate-900 border-slate-800 text-slate-200'>
                                                    <PromptInputActionAddAttachments />
                                                </PromptInputActionMenuContent>
                                            </PromptInputActionMenu>
                                        </PromptInputTools>

                                        <div className='flex items-center gap-2'>
                                            <PromptInputSubmit
                                                onClick={e => {
                                                    e.preventDefault();
                                                    sendMessage({
                                                        text: input });
                                                    setInput('');
                                                }}
                                                className={cn(
                                                    'rounded-xl h-10 w-10 p-0 transition-all',
                                                    'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
                                                )}
                                            />
                                        </div>
                                    </PromptInputFooter>
                                </PromptInputBody>
                            </PromptInput>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Float Toggler Button */}
            <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!open)}
                className={cn(
                    'relative flex h-16 w-16 items-center justify-center rounded-2xl shadow-2xl transition-all duration-300',
                    open
                        ? 'bg-slate-900 border border-slate-800'
                        : 'bg-gradient-to-br from-indigo-500 to-purple-600 border border-indigo-400/30'
                )}>
                <AnimatePresence mode='wait'>
                    {open ? (
                        <motion.div
                            key='cancel'
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}>
                            <X className='h-7 w-7 text-slate-100' />
                        </motion.div>
                    ) : (
                        <motion.div
                            key='message'
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            className='relative'>
                            <MessageCircle className='h-7 w-7 text-white' />
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 0, 0.5],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className='absolute -inset-2 rounded-2xl bg-indigo-500/30 blur-lg'
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
};

export default AiSupportAgent;
