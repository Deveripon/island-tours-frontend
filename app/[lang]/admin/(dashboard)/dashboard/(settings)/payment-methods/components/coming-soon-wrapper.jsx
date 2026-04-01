import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Notification02Icon, Time02Icon, LockIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const ComingSoonWrapper = ({
    children,
    isComingSoon = false,
    title = 'Feature',
    description = 'This feature is currently in development and will be available soon.',
    features = [],
    onNotifyMe = null }) => {
    if (!isComingSoon) {
        return children;
    }

    return (
        <div className='relative'>
            {/* Coming Soon Overlay */}
            <div className='absolute inset-0 z-10 bg-background/40 backdrop-blur-sm rounded-lg border border-dashed border-border'>
                <div className='flex flex-col items-center justify-center h-full text-center p-8 min-h-[400px]'>
                    <div className='bg-foreground p-6 rounded-full mb-6 shadow-lg'>
                        <HugeiconsIcon icon={LockIcon} size={48} className='text-background' />
                    </div>

                    <h3 className='text-2xl font-bold text-foreground mb-3'>
                        {title}
                    </h3>

                    <div className='flex items-center gap-2 mb-4'>
                        <Badge className='bg-primary text-white border-0 px-4 py-2'>
                            <HugeiconsIcon icon={Time02Icon} size={16} className='mr-2' />
                            Coming Soon
                        </Badge>
                    </div>

                    <p className='text-muted-foreground max-w-md mb-6 leading-relaxed'>
                        {description}
                    </p>

                    {features.length > 0 && (
                        <div className='bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-sm mb-6'>
                            <p className='text-sm text-primary font-medium mb-2'>
                                What&apos;s coming:
                            </p>
                            <div className='text-sm text-primary'>
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className='flex items-start gap-2 mb-1'>
                                        <span>•</span>
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {onNotifyMe && (
                        <Button
                            variant='outline'
                            className='flex items-center gap-2'
                            onClick={onNotifyMe}>
                            <HugeiconsIcon icon={Notification02Icon} size={16} />
                            Notify Me When Ready
                        </Button>
                    )}
                    {!onNotifyMe && (
                        <Button
                            variant='outline'
                            className='flex items-center cursor-default gap-2'>
                            <HugeiconsIcon icon={Notification02Icon} size={16} />
                            We Will Notify You When Ready
                        </Button>
                    )}
                </div>
            </div>

            {/* Original Component (blurred when coming soon is active) */}
            <div
                className={cn(
                    'transition-all duration-300',
                    'blur-sm pointer-events-none select-none'
                )}>
                {children}
            </div>
        </div>
    );
};

export default ComingSoonWrapper;

