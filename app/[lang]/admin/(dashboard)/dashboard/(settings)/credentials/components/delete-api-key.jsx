import { Button } from '@/components/ui/button';
import { Delete02Icon, Tick02Icon, Copy01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';
import { toast } from 'sonner';

const DeleteApiKey = ({ row }) => {
    const apiKey = row.original;
    const [copied, setCopied] = useState(false);

    const handleCopyKey = async () => {
        try {
            await navigator.clipboard.writeText(apiKey.key);
            setCopied(true);
            toast.success('API key copied to clipboard');
            setTimeout(() => setCopied(false), 1000);
        } catch (error) {
            toast.error('Failed to copy API key');
        }
    };

    const handleDelete = () => {
        document.dispatchEvent(
            new CustomEvent('delete-apiKeys', {
                detail: apiKey.id })
        );
    };

    return (
        <div className='flex items-center gap-2 w-[190px]'>
            <Button
                variant='outline'
                size='sm'
                onClick={handleCopyKey}
                className='gap-2 hover:bg-accent'>
                {copied ? (
                    <>
                        <HugeiconsIcon icon={Tick02Icon} size={16} />
                        Copied!
                    </>
                ) : (
                    <>
                        <HugeiconsIcon icon={Copy01Icon} size={16} />
                        Copy
                    </>
                )}
            </Button>

            <Button
                variant='outline'
                onClick={handleDelete}
                className='gap-2 cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10'>
                <HugeiconsIcon icon={Delete02Icon} size={16} />
                Delete Key
            </Button>
        </div>
    );
};

export default DeleteApiKey;

