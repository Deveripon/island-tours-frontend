import { Button } from '@/components/ui/button';
import {
    Copy01Icon,
    Tick02Icon,
    ViewIcon,
    ViewOffIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';
import { toast } from 'sonner';

const Apikey = ({ row }) => {
    const [showKey, setShowKey] = useState(false);
    const [copied, setCopied] = useState(false);
    const apiKey = row.getValue('key');

    const handleCopyKey = async e => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(apiKey);
            setCopied(true);
            toast.success('API key copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error('Failed to copy API key');
        }
    };

    return (
        <div className='flex items-center gap-1'>
            <div className='flex'>
                <code className='bg-muted px-3 py-2 rounded-md text-sm font-mono border border-border'>
                    {showKey
                        ? apiKey
                        : `${'*'.repeat(59)}${apiKey?.slice(-5) || ''}`}
                </code>
            </div>
            <div className='flex items-center gap-1'>
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setShowKey(!showKey)}
                    className='h-8 w-8 p-0 hover:bg-accent'>
                    {showKey ? (
                        <HugeiconsIcon
                            icon={ViewOffIcon}
                            size={16}
                            className='text-muted-foreground'
                        />
                    ) : (
                        <HugeiconsIcon
                            icon={ViewIcon}
                            size={16}
                            className='text-muted-foreground'
                        />
                    )}
                </Button>
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleCopyKey}
                    className='h-8 w-8 p-0 hover:bg-accent'>
                    {copied ? (
                        <HugeiconsIcon
                            icon={Tick02Icon}
                            size={16}
                            className='text-success'
                        />
                    ) : (
                        <HugeiconsIcon
                            icon={Copy01Icon}
                            size={16}
                            className='text-muted-foreground'
                        />
                    )}
                </Button>
            </div>
        </div>
    );
};

export default Apikey;

