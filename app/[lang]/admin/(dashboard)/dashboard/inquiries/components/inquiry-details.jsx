import {
    replyToInquiry,
    updateInquiryStatus,
} from '@/app/_actions/inquiryActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    ArrowLeft,
    Calendar,
    Check,
    Clock,
    MessageCircle,
    Reply,
    Send,
    User,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export function InquiryDetails({ inquiryData, onBack }) {
    const [showReply, setShowReply] = useState(false);
    const [replySubject, setReplySubject] = useState('');
    const [replyMessage, setReplyMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [localInquiryData, setLocalInquiryData] = useState(inquiryData);
    const replyRef = useRef(null);

    useEffect(() => {
        (async () => {
            if (inquiryData.status.includes('READ')) return;
            const res = await updateInquiryStatus(inquiryData.id, [...inquiryData.status, 'READ']);
        })();
    }, [inquiryData.id, inquiryData.status]);

    useEffect(() => {
        if (inquiryData) {
            setLocalInquiryData(inquiryData);
        }
    }, [inquiryData]);

    useEffect(() => {
        if (localInquiryData?.subject) {
            setReplySubject(`Re: ${localInquiryData.subject}`);
        }
    }, [localInquiryData?.subject]);

    useEffect(() => {
        if (showReply && replyRef.current) {
            setTimeout(() => {
                replyRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' });
            }, 100);
        }
    }, [showReply]);

    const generateAvatarColor = email => {
        if (!email) return 'bg-primary/80';
        const colors = [
            'bg-destructive',
            'bg-info',
            'bg-success',
            'bg-warning',
            'bg-primary',
            'bg-secondary',
            'bg-accent',
            'bg-chart-1',
        ];
        const index = email.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const getInitials = (name, email) => {
        if (name) {
            const nameParts = name.split(' ');
            return nameParts.length > 1
                ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
                : nameParts[0][0].toUpperCase();
        }
        if (email) {
            return email.charAt(0).toUpperCase();
        }
        return 'U';
    };

    const formatDate = dateString => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true });
    };

    const handleReply = () => {
        setShowReply(true);
    };

    const handleCancelReply = () => {
        setShowReply(false);
        setReplyMessage('');
    };

    const handleSendReply = async () => {
        setIsSending(true);

        try {
            const res = await replyToInquiry(localInquiryData.id, {
                replySubject,
                replyMessage });

            if (res.success) {
                const updatedInquiryData = {
                    ...localInquiryData,
                    status: [...localInquiryData.status, 'REPLIED'],
                    replyMessage: replyMessage,
                    repliedAt: new Date().toISOString(),
                };

                setLocalInquiryData(updatedInquiryData);
                setReplyMessage('');
                setShowReply(false);

                toast.success('Reply sent successfully!');
            } else {
                toast.error('Failed to send reply');
            }
        } catch (error) {
            toast.error('An error occurred while sending reply');
        } finally {
            setIsSending(false);
        }
    };

    if (!localInquiryData || !localInquiryData.id) {
        return (
            <div className='flex items-center justify-center min-h-[400px]'>
                <div className='text-center'>
                    <div className='animate-spin h-8 w-8 border-2 border-muted border-t-primary rounded-full mx-auto mb-4'></div>
                    <p className='text-sm text-muted-foreground'>
                        Loading inquiry details...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-6 p-6'>
            {/* Header */}
            <div className='flex items-center justify-between pb-4 border-b'>
                <div className='flex items-center gap-4'>
                    <Button
                        onClick={onBack}
                        variant='ghost'
                        size='sm'
                        className='text-muted-foreground hover:text-foreground'>
                        <ArrowLeft className='h-4 w-4 mr-2' />
                        Back to Inbox
                    </Button>
                    <div className='h-4 w-px bg-border'></div>
                    <span className='text-xs text-muted-foreground font-mono'>
                        ID: {localInquiryData?.id.split('-')[0]}
                    </span>
                </div>
            </div>

            {/* Sender Info Card */}
            <div className='rounded-lg border bg-card p-6 shadow-sm'>
                <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-4'>
                        <div
                            className={`w-12 h-12 ${generateAvatarColor(
                                localInquiryData?.email
                            )} rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md`}>
                            {getInitials(
                                localInquiryData?.name,
                                localInquiryData?.email
                            )}
                        </div>

                        <div className='space-y-1'>
                            <div className='flex items-center gap-2'>
                                <span className='font-semibold text-sm'>
                                    {localInquiryData?.name}
                                </span>
                                <span className='text-xs text-muted-foreground'>
                                    &lt;{localInquiryData?.email}&gt;
                                </span>
                            </div>
                            <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                                <div className='flex items-center gap-1'>
                                    <Calendar className='h-3 w-3' />
                                    {formatDate(localInquiryData?.createdAt)}
                                </div>
                                <div className='flex items-center gap-1'>
                                    <Clock className='h-3 w-3' />
                                    <span className='font-medium'>
                                        {localInquiryData?.status.join(', ')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reply Button */}
                    <Button
                        onClick={handleReply}
                        size='sm'
                        disabled={localInquiryData?.status.includes('REPLIED')}
                        className='gap-2'>
                        <Reply className='h-4 w-4' />
                        {localInquiryData?.status.includes('REPLIED')
                            ? 'Replied'
                            : 'Reply'}
                    </Button>
                </div>
            </div>

            {/* Original Message */}
            <div className='rounded-lg border bg-card shadow-sm overflow-hidden'>
                <div className='flex items-center gap-2 px-6 py-4 bg-muted/30 border-b'>
                    <MessageCircle className='h-4 w-4 text-muted-foreground' />
                    <span className='text-xs font-medium text-muted-foreground'>
                        Subject:
                    </span>
                    <h2 className='text-sm font-semibold flex-1'>
                        {localInquiryData?.subject}
                    </h2>
                </div>

                <div className='p-6'>
                    <div className='prose prose-sm max-w-none'>
                        <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground'>
                            {localInquiryData.message}
                        </p>
                    </div>
                </div>
            </div>

            {/* Reply Display */}
            {localInquiryData?.replyMessage &&
                localInquiryData?.status.includes('REPLIED') && (
                    <div className='rounded-lg border border-success/30 bg-success/5 shadow-sm overflow-hidden'>
                        <div className='flex items-center gap-3 px-6 py-4 bg-success/10 border-b border-success/30'>
                            <div className='w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-sm'>
                                <User className='h-5 w-5' />
                            </div>
                            <div className='flex-1'>
                                <h3 className='text-xs font-semibold text-success-foreground flex items-center gap-2'>
                                    Your Reply
                                    <Check className='h-4 w-4 text-success' />
                                </h3>
                                <div className='flex items-center gap-3 text-xs text-success-foreground/80'>
                                    <div className='flex items-center gap-1'>
                                        <Calendar className='h-3 w-3' />
                                        {formatDate(
                                            localInquiryData?.repliedAt
                                        )}
                                    </div>
                                    <span>To: {localInquiryData?.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className='p-6'>
                            <div className='prose prose-sm max-w-none'>
                                <p className='whitespace-pre-wrap text-sm leading-relaxed text-foreground'>
                                    {localInquiryData.replyMessage}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            {/* Reply Form */}
            {showReply && (
                <div
                    ref={replyRef}
                    className='rounded-lg border bg-card shadow-sm overflow-hidden'>
                    <div className='flex items-center justify-between px-6 py-4 bg-muted/30 border-b'>
                        <h3 className='text-sm font-semibold flex items-center gap-2'>
                            <Reply className='h-4 w-4' />
                            Compose Reply
                        </h3>
                        <Button
                            onClick={handleCancelReply}
                            variant='ghost'
                            size='sm'>
                            <X className='h-4 w-4' />
                        </Button>
                    </div>

                    <div className='p-6 space-y-4'>
                        <div className='space-y-2'>
                            <label className='text-xs font-medium text-muted-foreground'>
                                To:
                            </label>
                            <Input
                                value={localInquiryData?.email}
                                disabled
                                className='bg-muted'
                            />
                        </div>

                        <div className='space-y-2'>
                            <label className='text-xs font-medium text-muted-foreground'>
                                Subject:
                            </label>
                            <Input
                                value={replySubject}
                                onChange={e => setReplySubject(e.target.value)}
                            />
                        </div>

                        <div className='space-y-2'>
                            <label className='text-xs font-medium text-muted-foreground'>
                                Message:
                            </label>
                            <Textarea
                                value={replyMessage}
                                onChange={e => setReplyMessage(e.target.value)}
                                placeholder='Type your reply...'
                                rows={8}
                                className='resize-none'
                            />
                        </div>

                        <div className='flex items-center justify-between pt-4 border-t'>
                            <span className='text-xs text-muted-foreground'>
                                Ctrl+Enter to send
                            </span>
                            <div className='flex items-center gap-3'>
                                <Button
                                    onClick={handleCancelReply}
                                    variant='outline'
                                    disabled={isSending}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSendReply}
                                    disabled={
                                        !replyMessage.trim() || isSending
                                    }>
                                    {isSending ? (
                                        <>
                                            <div className='animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full'></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className='h-4 w-4 mr-2' />
                                            Send Reply
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

