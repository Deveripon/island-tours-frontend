'use client';

import Image from 'next/image';
import React from 'react';

function Logomarquee({ logos = [] }) {
    console.log(`logos`, logos);
    // Use slice() instead of splice() to avoid mutating the original array
    const upperLine = logos.slice(0, 6).map(logo => {
        return {
            id: logo.id,
            component: (
                <Image
                    className='grayscale hover:grayscale-0 transition-all duration-300'
                    src={logo.url}
                    width={100}
                    height={100}
                    alt={logo.altText || 'partner logo'}
                    key={logo.id}
                />
            ),
        };
    });

    const bottomLine = logos.slice(6, 12).map(logo => {
        return {
            id: logo.id,
            component: (
                <Image
                    className='grayscale hover:grayscale-0 transition-all duration-300'
                    src={logo.url}
                    width={100}
                    height={100}
                    alt={logo.altText || 'partner logo'}
                    key={logo.id}
                />
            ),
        };
    });

    React.useEffect(() => {
        const styleSheet = document.createElement('style');
        styleSheet.innerText = `
      @keyframes marquee-move {
        to {
          transform: translateX(calc(-100cqw - var(--item-gap)));
        }
      }
    `;
        document.head.appendChild(styleSheet);
        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []);

    const Marquee = ({ logos, direction = 'forwards' }) => {
        const numItems = logos.length;
        const speed = '55s';
        const itemWidth = '140px';
        const itemGap = '20px';

        return (
            <div
                className='max-w-full overflow-hidden'
                style={{
                    '--speed': speed,
                    '--numItems': numItems,
                    '--item-width': itemWidth,
                    '--item-gap': itemGap,
                    '--direction': direction,
                    maskImage:
                        'linear-gradient(to right, transparent, black 3rem, black calc(100% - 3rem), transparent)',
                }}>
                <div
                    className='w-max flex'
                    style={{
                        '--track-width': `calc(var(--item-width) * ${numItems})`,
                        '--track-gap': `calc(var(--item-gap) * ${numItems})`,
                    }}>
                    {[...logos, ...logos, ...logos].map((logo, index) => (
                        <div
                            key={`${logo.id}-${index}`}
                            className='flex-shrink-0 flex justify-center items-center transition-all duration-300 rounded-xl shadow-sm hover:shadow-md border border-border/50'
                            style={{
                                width: 'var(--item-width)',
                                height: '60px',
                                marginRight: 'var(--item-gap)',
                                animation: `marquee-move var(--speed) linear infinite ${direction}`,
                            }}>
                            <div className='w-full h-full flex items-center justify-center'>
                                {logo.component}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className='w-full'>
            <div className='flex flex-col gap-y-8'>
                {upperLine.length > 0 && <Marquee logos={upperLine} />}
                {bottomLine.length > 0 && (
                    <Marquee logos={bottomLine} direction='reverse' />
                )}
            </div>
        </div>
    );
}

export default Logomarquee;

