'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Add01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';

const AddMoreButton = ({ text, ButtonText, goToUrl, onClick, className }) => {
    const router = useRouter();
    return (
        <div
            className={cn(
                `text-center p-8 border border-dashed rounded-md`,
                className
            )}>
            <p className='text-gray-700'>{text}</p>
            <Button
                type='button'
                onClick={e => {
                    e.stopPropagation();
                    onClick && onClick();
                    router.push(goToUrl);
                }}
                variant='outline'
                className='mt-2'>
                <HugeiconsIcon icon={Add01Icon} className='h-4 w-4 mr-2' />
                {ButtonText}
            </Button>
        </div>
    );
};

export default AddMoreButton;

