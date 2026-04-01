import { formatDate } from '@/utils/form-helpers';
import Image from 'next/image';
import Link from 'next/link';
import { RxArrowTopRight } from 'react-icons/rx';

const RelatedBlogCard = ({ post, tenantId }) => {
    return (
        <Link href={`/site/${tenantId}/blogs/${post.slug}`}>
            <article className='group flex flex-col overflow-hidden rounded-3xl bg-card text-card-foreground ring-1 ring-border shadow-lg dark:shadow-[0_22px_60px_rgba(15,23,42,0.85)] hover:-translate-y-1 hover:shadow-xl hover:ring-primary/60 dark:hover:bg-accent/10 hover:bg-accent/10 dark:hover:shadow-[0_26px_80px_rgba(15,23,42,0.95)] transition-all duration-500 ease-out h-full'>
                <div className='relative aspect-[4/3] overflow-hidden'>
                    <Image
                        src={post.mainImage?.url || '/placeholder.svg'}
                        alt={post.title}
                        fill
                        className='transition-transform duration-700 ease-out group-hover:scale-105 w-full h-full object-cover'
                    />
                    <div className='flex absolute right-4 bottom-4 left-4 justify-between'>
                        <span className='inline-flex items-center rounded-full bg-black/80 px-3 py-1 text-xs font-medium text-white backdrop-blur'>
                            {post.category[0]}
                        </span>
                    </div>
                </div>

                <div className='flex flex-1 flex-col gap-4 px-5 pb-5 pt-4 z-20'>
                    <div className='flex items-center justify-between gap-3 text-xs text-muted-foreground'>
                        <div className='flex flex-wrap items-center gap-1.5'>
                            <div className='flex items-center gap-2'>
                                <Image
                                    width={24}
                                    height={24}
                                    src={
                                        post.createdBy?.image?.url
                                            ? post.createdBy.image.url
                                            : post.createdBy?.image || '/placeholder.svg'
                                    }
                                    alt={post.createdBy?.name || 'Author'}
                                    className='w-6 h-6 rounded-full'
                                />
                                <span className='text-sm font-medium'>
                                    {post.createdBy?.name || 'Anonymous'}
                                </span>
                            </div>
                            <span>{formatDate(post.createdAt, 'short')}</span>
                        </div>
                    </div>

                    <div className='div min-h-[140px]'>
                        <div className='space-y-1.5 group flex items-center justify-between'>
                            <h2 className='text-lg tracking-tight font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors'>
                                {post.title}
                            </h2>
                            <RxArrowTopRight className='w-6 h-6 hidden group-hover:block text-primary' />
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
};

export default RelatedBlogCard;
