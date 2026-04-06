import { InstagramIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import SectionTitle from './section-title';

export default function InstagramFeed() {
    const posts = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
            isVideo: true,
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
            isVideo: true,
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop',
            isVideo: true,
        },
        {
            id: 4,
            image: 'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=400&h=400&fit=crop',
            isVideo: true,
        },
        {
            id: 5,
            image: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400&h=400&fit=crop',
            isVideo: true,
        },
        {
            id: 6,
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop',
            isVideo: true,
        },
        {
            id: 7,
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
            isVideo: true,
        },
        {
            id: 8,
            image: 'https://images.unsplash.com/photo-1607153333879-c174d265f1d2?w=400&h=400&fit=crop',
            isVideo: true,
        },
    ];

    return (
        <div className=' bg-background dark:bg-background py-16 md:py-22 px-4'>
            <div className='container mx-auto'>
                {/* Header */}
                <SectionTitle
                    title='Follow us on'
                    highlightedText='Instagram'
                />

                {/* Profile Card */}
                <div className='bg-card rounded-2xl shadow-lg p-6 mb-8 max-w-3xl mx-auto'>
                    <div className='flex items-center justify-between flex-wrap gap-4'>
                        <div className='flex items-center gap-4'>
                            <div className='w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 p-0.5'>
                                <div className='w-full h-full rounded-full bg-white p-1'>
                                    <div className='w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center'>
                                        <svg
                                            className='w-8 h-8 text-white'
                                            fill='currentColor'
                                            viewBox='0 0 24 24'>
                                            <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z' />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className='font-bold text-lg text-foreground'>
                                    Travelease Tours
                                </h3>
                                <p className='text-sm text-muted-foreground'>
                                    @travelease.tours
                                </p>
                            </div>
                        </div>

                        <div className='flex items-center gap-6'>
                            <div className='text-center'>
                                <p className='font-bold text-lg text-foreground'>
                                    48
                                </p>
                                <p className='text-xs text-muted-foreground'>Posts</p>
                            </div>
                            <div className='text-center'>
                                <p className='font-bold text-lg text-foreground'>
                                    1.2K
                                </p>
                                <p className='text-xs text-muted-foreground'>
                                    Followers
                                </p>
                            </div>
                            <div className='text-center'>
                                <p className='font-bold text-lg text-foreground'>
                                    135
                                </p>
                                <p className='text-xs text-muted-foreground'>
                                    Following
                                </p>
                            </div>
                            <button className='bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 rounded-lg text-sm flex items-center gap-2 transition-all duration-300 hover:scale-105'>
                                <HugeiconsIcon icon={InstagramIcon} className='w-4 h-4' />
                                Follow
                            </button>
                        </div>
                    </div>
                </div>

                {/* Instagram Grid */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                    {posts.map(post => (
                        <div
                            key={post.id}
                            className='relative aspect-square rounded-lg overflow-hidden group cursor-pointer'>
                            <Image
                                fill
                                src={post.image}
                                alt={`Instagram post ${post.id}`}
                                className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                            />

                            {/* Video indicator */}
                            {post.isVideo && (
                                <div className='absolute top-3 right-3 bg-black/60 rounded-full p-2'>
                                    <svg
                                        className='w-4 h-4 text-white'
                                        fill='currentColor'
                                        viewBox='0 0 24 24'>
                                        <path d='M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z' />
                                    </svg>
                                </div>
                            )}

                            {/* Hover overlay */}
                            <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                                <HugeiconsIcon icon={InstagramIcon} className='w-8 h-8 text-white' />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More Button */}
                <div className='text-center'>
                    <button className='bg-primary border border-primary hover:bg-primary/80  text-primary-foreground font-semibold px-10 py-3 rounded-full text-md shadow-lg hover:shadow-xl transform transition-all duration-300'>
                        Load more
                    </button>
                </div>
            </div>
        </div>
    );
}

