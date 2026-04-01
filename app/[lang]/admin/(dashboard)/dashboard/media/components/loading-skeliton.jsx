const MasonryLoadingSkeleton = ({ itemCount = 16 }) => {
    // Generate random heights for masonry effect
    const getRandomHeight = () => {
        const heights = [200, 220, 250, 180, 250, 200];
        return heights[Math.floor(Math.random() * heights.length)];
    };

    // Create skeleton items with varied heights
    const skeletonItems = Array.from({ length: itemCount }, (_, index) => ({
        id: index,
        height: getRandomHeight() }));

    return (
        <div className='w-full overflow-hidden'>
            <div
                className='w-full '
                style={{
                    columnCount: 'auto',
                    columnWidth: '190px',
                    columnGap: '16px',
                    columnFill: 'balance',
                }}>
                {skeletonItems.map(item => (
                    <div
                        suppressHydrationWarning
                        key={item.id}
                        className='inline-block w-full  mb-4 break-inside-avoid'
                        style={{ height: `${item.height}px` }}>
                        <div className='w-full h-full bg-muted rounded-lg overflow-hidden relative animate-pulse'>
                            {/* Image placeholder */}
                            <div className='w-full h-full bg-gradient-to-r from-muted via-muted-foreground/20 to-muted bg-[length:200%_100%] animate-shimmer'>
                                {/* Image icon placeholder */}
                                <div className='absolute inset-0 flex items-center justify-center'>
                                    <div className='w-12 h-12 bg-muted-foreground/20 rounded-full flex items-center justify-center'>
                                        <svg
                                            className='w-6 h-6 text-muted-foreground/40'
                                            fill='currentColor'
                                            viewBox='0 0 20 20'>
                                            <path
                                                fillRule='evenodd'
                                                d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
                                                clipRule='evenodd'
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom overlay for title/info */}
                            <div className='absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/20 to-transparent'>
                                <div className='space-y-2'>
                                    {/* Title skeleton */}
                                    <div
                                        className='h-3 bg-white/30 rounded animate-pulse'
                                        style={{ width: '70%' }}></div>
                                    {/* Secondary info skeleton */}
                                    <div
                                        className='h-2 bg-white/20 rounded animate-pulse'
                                        style={{ width: '50%' }}></div>
                                </div>
                            </div>

                            {/* Top corner badges */}
                            <div className='absolute top-3 left-3'>
                                <div className='w-8 h-4 bg-muted-foreground/20 rounded-full animate-pulse'></div>
                            </div>

                            {/* Action buttons skeleton */}
                            <div className='absolute top-3 right-3 flex gap-2'>
                                <div className='w-8 h-8 bg-white/20 rounded-md animate-pulse'></div>
                                <div className='w-8 h-8 bg-white/20 rounded-md animate-pulse'></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Custom CSS for shimmer effect
const shimmerStyle = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;

// Component with inline styles
export default function MasonrySkeletonWithStyles() {
    return (
        <>
            <style>{shimmerStyle}</style>
            <MasonryLoadingSkeleton />
        </>
    );
}

