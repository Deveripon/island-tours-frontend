import { cn } from '@/lib/utils';

const VideoBackground = ({
    children,
    overlay,
    overlayStyles,
    className,
    video = '/video6.mp4' }) => {
    return (
        <div
            className={cn(
                'relative w-full min-h-screen overflow-hidden',
                className
            )}>
            <video
                autoPlay
                loop
                muted
                className='absolute inset-0 w-full h-full object-cover scale-x-[-1] z-0'>
                <source src={video} type='video/mp4' />
            </video>

            {overlay && <div className={overlayStyles}></div>}

            {/* make sure children are above the overlay */}
            <div className='relative z-20'>{children}</div>
        </div>
    );
};

export default VideoBackground;

