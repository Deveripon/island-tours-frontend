'use client';
import { cn } from '@/lib/utils';
import * as React from 'react';

export const CustomProgress = React.forwardRef(({ className, value = 0, barStyle, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn('relative h-4 w-full overflow-hidden rounded-full bg-muted', className)}
            {...props}>
            <div
                className='h-full transition-all duration-75 ease-linear'
                style={{
                    width: `${value}%`,
                    ...barStyle, // <-- use passed dynamic style
                }}
            />
        </div>
    );
});

CustomProgress.displayName = 'CustomProgress';

