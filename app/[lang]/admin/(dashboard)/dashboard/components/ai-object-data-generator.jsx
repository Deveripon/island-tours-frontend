'use client';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Bot,
    Calendar,
    DollarSign,
    Edit,
    Loader2,
    MapPin,
    RefreshCcw,
    Send,
    Sparkles,
    User,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { generateAffiliateTripAction } from '@/app/_actions/ai';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';

const suggestions = [
    'Create a 3-day luxury trip to Maldives',
    'Adventure tour in Patagonia with hiking',
    'City tour of Tokyo with food tasting',
    'Family friendly weekend in Paris',
];

const AiObjectDataGenerator = ({
    open,
    onOpenChange,
    className,
    setTripData,
    ...props
}) => {
    const scrollRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedTrip, setGeneratedTrip] = useState(null);
    const [lastPrompt, setLastPrompt] = useState('');

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth' });
        }
    }, [messages]);

    const handleSuggestionClick = suggestion => {
        setInput(suggestion);
    };

    const handleFillForm = data => {
        if (setTripData) {
            setTripData(data);
            onOpenChange(false);
        }
    };

    const handleRegenerate = async () => {
        if (!lastPrompt) return;
        setInput(lastPrompt);
        // We can't easily trigger handleSubmit directly due to event, so we'll simulate by setting input and letting user click or calling logic directly.
        // Actually best to extract generation logic. But for now, let's just populate.
        // Better: Extracted generation logic.
        await generateTrip(lastPrompt);
    };

    const handleRefine = () => {
        setInput('Refine this trip: ');
        // Focus input usually handled by React auto-focus or we canref, but simply setting text is good start.
    };

    const generateTrip = async text => {
        setIsLoading(true);
        const userMsg = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
        };
        // Only add user message if it's not a direct regeneration of the exact same last prompt?
        // Actually standard chat UX is to show the new request.
        setMessages(prev => [...prev, userMsg]);

        try {
            const res = await generateAffiliateTripAction(text);

            if (res.success && res.data) {
                const assistantMsg = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: 'Here is your trip plan!',
                    data: res.data,
                };
                setMessages(prev => [...prev, assistantMsg]);
                setGeneratedTrip(res.data);
            } else {
                toast.error(res.error || 'Failed to generate trip');
                const errorMsg = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.',
                };
                setMessages(prev => [...prev, errorMsg]);
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userText = input.trim();
        setInput('');
        setLastPrompt(userText);
        await generateTrip(userText);
    };

    if (!open) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className={cn(
                    'fixed bottom-4 right-4 z-50 w-[400px] md:w-[450px] shadow-2xl rounded-xl overflow-hidden border border-border bg-background',
                    className
                )}
                {...props}>
                {/* Header */}
                <div className='bg-primary/5 p-4 flex justify-between items-center border-b border-border/50 backdrop-blur-sm'>
                    <div className='flex items-center gap-2'>
                        <div className='h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary'>
                            <Sparkles className='h-4 w-4' />
                        </div>
                        <div>
                            <h3 className='font-semibold text-sm'>
                                AI Trip Generator
                            </h3>
                        </div>
                    </div>
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => onOpenChange(false)}
                        className='h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors'>
                        <X className='h-4 w-4' />
                    </Button>
                </div>

                {/* Chat Area */}
                <ScrollArea
                    className='h-[400px] w-full bg-muted/30 p-4'
                    ref={scrollRef}>
                    {messages.length === 0 ? (
                        <div className='h-full flex flex-col justify-center items-center text-center space-y-4 p-4'>
                            <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2'>
                                <Bot className='h-6 w-6 text-primary' />
                            </div>
                            <h4 className='font-medium text-muted-foreground'>
                                What journey shall we plan today?
                            </h4>
                            <div className='grid grid-cols-1 gap-2 w-full mt-4'>
                                {suggestions.map((suggestion, i) => (
                                    <Button
                                        key={i}
                                        variant='outline'
                                        size='sm'
                                        className='text-xs justify-start h-auto py-2 px-3 whitespace-normal text-left truncate hover:bg-primary/5 hover:text-primary transition-colors'
                                        onClick={() =>
                                            handleSuggestionClick(suggestion)
                                        }>
                                        {suggestion}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className='space-y-4 pb-4'>
                            {messages.map(m => (
                                <div
                                    key={m.id}
                                    className={cn(
                                        'flex gap-3 text-sm',
                                        m.role === 'user'
                                            ? 'flex-row-reverse'
                                            : ''
                                    )}>
                                    <div
                                        className={cn(
                                            'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
                                            m.role === 'user'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted border border-border'
                                        )}>
                                        {m.role === 'user' ? (
                                            <User className='h-4 w-4' />
                                        ) : (
                                            <Bot className='h-4 w-4' />
                                        )}
                                    </div>
                                    <div
                                        className={cn(
                                            'rounded-lg p-3 max-w-[85%] shadow-sm',
                                            m.role === 'user'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-card border border-border text-foreground'
                                        )}>
                                        <div className='whitespace-pre-wrap'>
                                            {m.content}
                                        </div>

                                        {/* Structured Data Card */}
                                        {m.data && (
                                            <Card className='mt-3 overflow-hidden border-border/50 shadow-md bg-card/50 backdrop-blur-sm'>
                                                {/* Card Header */}
                                                <div className='p-4 bg-gradient-to-r from-primary/10 to-transparent border-b border-border/50'>
                                                    <div className='flex items-center gap-2 mb-2'>
                                                        <Badge
                                                            variant='outline'
                                                            className='bg-primary/20 text-primary border-primary/30 gap-1.5 px-2 py-0.5 h-6'>
                                                            <Sparkles className='h-3 w-3' />
                                                            Trip Generated
                                                        </Badge>
                                                    </div>
                                                    <h3 className='font-bold text-lg leading-tight text-foreground'>
                                                        {m.data.title}
                                                    </h3>
                                                </div>

                                                {/* Card Content */}
                                                <div className='p-4 space-y-4'>
                                                    <div className='flex flex-wrap gap-2 text-xs'>
                                                        <Badge
                                                            variant='secondary'
                                                            className='gap-1 font-normal bg-muted'>
                                                            <Calendar className='h-3 w-3 text-muted-foreground' />
                                                            {m.data.duration}
                                                        </Badge>
                                                        <Badge
                                                            variant='secondary'
                                                            className='gap-1 font-normal bg-muted'>
                                                            <DollarSign className='h-3 w-3 text-muted-foreground' />
                                                            {m.data
                                                                .pricingConfig
                                                                ?.currency ||
                                                                'USD'}
                                                        </Badge>
                                                    </div>

                                                    <div className='text-sm text-muted-foreground leading-relaxed line-clamp-4'>
                                                        {
                                                            m.data
                                                                .shortDescription
                                                        }
                                                    </div>

                                                    {m.data.highlights &&
                                                        m.data.highlights
                                                            .length > 0 && (
                                                            <div className='space-y-2'>
                                                                <span className='text-xs font-semibold text-foreground/80 flex items-center gap-1'>
                                                                    <MapPin className='h-3 w-3' />{' '}
                                                                    Highlights
                                                                </span>
                                                                <div className='flex flex-wrap gap-1.5'>
                                                                    {m.data.highlights
                                                                        .slice(
                                                                            0,
                                                                            4
                                                                        )
                                                                        .map(
                                                                            (
                                                                                h,
                                                                                idx
                                                                            ) => (
                                                                                <span
                                                                                    key={
                                                                                        idx
                                                                                    }
                                                                                    className='inline-flex items-center px-2 py-1 rounded-md bg-primary/5 text-primary text-[10px] border border-primary/10'>
                                                                                    {
                                                                                        h
                                                                                    }
                                                                                </span>
                                                                            )
                                                                        )}
                                                                    {m.data
                                                                        .highlights
                                                                        .length >
                                                                        4 && (
                                                                        <span className='inline-flex items-center px-2 py-1 rounded-md bg-muted text-muted-foreground text-[10px]'>
                                                                            +
                                                                            {m
                                                                                .data
                                                                                .highlights
                                                                                .length -
                                                                                4}{' '}
                                                                            more
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>

                                                <Separator className='bg-border/50' />

                                                {/* Card Footer Actions */}
                                                <div className='p-3 bg-muted/20 flex flex-col gap-2'>
                                                    <Button
                                                        size='sm'
                                                        className='w-full bg-primary hover:bg-primary/90 shadow-sm transition-all group'
                                                        onClick={() =>
                                                            handleFillForm(
                                                                m.data
                                                            )
                                                        }>
                                                        <Sparkles className='h-3.5 w-3.5 mr-2 group-hover:animate-pulse' />
                                                        Fill Form with Trip
                                                    </Button>

                                                    <div className='grid grid-cols-2 gap-2'>
                                                        <Button
                                                            size='sm'
                                                            variant='outline'
                                                            className='w-full h-8 text-xs border-border/50 hover:bg-background hover:text-primary'
                                                            onClick={
                                                                handleRefine
                                                            }>
                                                            <Edit className='h-3 w-3 mr-1.5' />
                                                            Refine
                                                        </Button>
                                                        <Button
                                                            size='sm'
                                                            variant='outline'
                                                            className='w-full h-8 text-xs border-border/50 hover:bg-background hover:text-primary'
                                                            onClick={
                                                                handleRegenerate
                                                            }>
                                                            <RefreshCcw className='h-3 w-3 mr-1.5' />
                                                            Regenerate
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className='flex gap-3 text-sm'>
                                    <div className='h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center shrink-0'>
                                        <Bot className='h-4 w-4' />
                                    </div>
                                    <div className='flex items-center gap-1 text-muted-foreground text-xs h-8'>
                                        <Loader2 className='h-3 w-3 animate-spin' />
                                        Generating trip details...
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </ScrollArea>

                {/* Input Area */}
                <div className='p-4 bg-background border-t border-border'>
                    <form
                        onSubmit={handleSubmit}
                        className='flex items-center gap-2'>
                        <Input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder='Describe your trip...'
                            disabled={isLoading}
                            className='flex-1 bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary/20'
                        />
                        {isLoading ? (
                            <Button
                                type='button'
                                size='icon'
                                variant='ghost'
                                disabled
                                className='h-10 w-10 shrink-0'>
                                <Loader2 className='h-4 w-4 animate-spin' />
                            </Button>
                        ) : (
                            <Button
                                type='submit'
                                size='icon'
                                disabled={!input.trim()}
                                className='h-10 w-10 shrink-0 shadow-sm'>
                                <Send className='h-4 w-4' />
                            </Button>
                        )}
                    </form>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AiObjectDataGenerator;
