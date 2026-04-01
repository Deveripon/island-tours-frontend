import Spinner from '@/components/svg/spinner';
import { cn } from '@/lib/utils';
import { Delete02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const BulkActionSpinner = ({
    bulkSelectedItems,
    title = 'Deleting Media Files',
    state = 'Deleteing',
    className }) => {
    return (
        <div
            className={cn(
                'min-h-[60vh] flex items-center justify-center',
                className
            )}>
            <div className='p-8 mx-4 text-center '>
                {/* Subtle background pattern */}
                <div className='absolute inset-0 opacity-5'>
                    <div className='absolute top-0 left-0 w-full h-full '></div>
                </div>

                {/* Floating particles */}
                <div
                    className='absolute top-6 left-8 w-1 h-1 bg-destructive/30 rounded-full animate-ping'
                    style={{ animationDelay: '0s' }}></div>
                <div
                    className='absolute top-12 right-10 w-1.5 h-1.5 bg-destructive/40 rounded-full animate-ping'
                    style={{ animationDelay: '0.5s' }}></div>
                <div
                    className='absolute bottom-16 left-12 w-1 h-1 bg-destructive/50 rounded-full animate-ping'
                    style={{ animationDelay: '1s' }}></div>
                <div
                    className='absolute bottom-8 right-6 w-1.5 h-1.5 bg-destructive/50 rounded-full animate-ping'
                    style={{ animationDelay: '1.5s' }}></div>

                <div className='relative mb-8'>
                    {/* Outer rotating ring */}
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <div
                            className='w-24 h-24 border-4 border-transparent border-t-destructive/20 border-r-destructive/30 rounded-full animate-spin'
                            style={{
                                animationDuration: '3s',
                            }}></div>
                    </div>
                    {/* Middle pulsing ring */}
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <div className='w-20 h-20 border-4 border-destructive/10 rounded-full animate-pulse shadow-lg'></div>
                    </div>
                    {/* Inner breathing ring */}
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <div className='w-16 h-16 bg-gradient-to-br from-destructive/10 to-destructive/20 rounded-full animate-ping opacity-60'></div>
                    </div>
                    {/* Main spinner container */}
                    <div className='relative flex items-center justify-center'>
                        <div className='w-12 h-12 bg-gradient-to-br from-destructive/5 to-destructive/10 rounded-full flex items-center justify-center shadow-inner'>
                            <Spinner className='h-6 w-6 animate-spin text-destructive' />
                        </div>
                    </div>
                </div>

                <div className='space-y-4 relative'>
                    <div className='space-y-2'>
                        <h3 className='text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent'>
                            {title || 'Deleting Media Files'}
                        </h3>
                        <div className='flex items-center justify-center space-x-2'>
                            <HugeiconsIcon icon={Delete02Icon} size={16} className='text-destructive' />
                            <p className='text-muted-foreground font-medium'>
                                {state} {bulkSelectedItems} selected{' '}
                                {bulkSelectedItems === 1 ? 'item' : 'items'}
                            </p>
                        </div>
                    </div>

                    {/* Enhanced loading dots */}
                    <div className='flex items-center  justify-center space-x-3 py-2'>
                        <div className='flex space-x-1.5'>
                            <div className='w-2.5 h-2.5 bg-gradient-to-r from-destructive/40 to-destructive/50 rounded-full animate-bounce shadow-sm'></div>
                            <div
                                className='w-2.5 h-2.5 bg-gradient-to-r from-destructive/50 to-destructive/60 rounded-full animate-bounce shadow-sm'
                                style={{
                                    animationDelay: '0.1s',
                                }}></div>
                            <div
                                className='w-2.5 h-2.5 bg-gradient-to-r from-destructive/60 to-destructive/70 rounded-full animate-bounce shadow-sm'
                                style={{
                                    animationDelay: '0.2s',
                                }}></div>
                        </div>
                        <span className='text-sm text-muted-foreground ml-3 font-medium'>
                            Please wait
                        </span>
                    </div>
                    <h5 className='text-sm text-muted-foreground'>
                        This may take a few seconds
                    </h5>
                </div>
            </div>
        </div>
    );
};

export default BulkActionSpinner;

