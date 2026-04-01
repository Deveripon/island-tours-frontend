import { formateToCapitalize } from '@/lib/utils';
import { formatDate } from '@/utils/form-helpers';
import { Calendar, Clock } from 'lucide-react';
import Image from 'next/image';
import { generateBlogSchema } from '../../../../utils/generateBlogSchema';
import CommentsSection from './comments-section';
import Controlls from './controlls';

// Generate metadata for SEO

const BlogPostDetails = async ({ blog }) => {
    const blogData = await blog;

    const post = blogData?.blog?.data;
    const readPerMinute = 225;
    const jsonLd = generateBlogSchema(post, post?.slug);
    return (
        <>
            {/* JSON-LD Schema */}
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <article className='max-w-6xl pt-24 mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                {/* Category Badge */}
                <div className='mb-6'>
                    <span className='inline-block text-sm font-semibold px-4 py-1.5 rounded-full text-primary bg-primary/10'>
                        {formateToCapitalize(post?.category[0])}
                    </span>
                </div>

                {/* Title */}
                <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-300 mb-6 leading-tight'>
                    {post?.title}
                </h1>

                {/* Meta Information */}
                <div className='flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-400'>
                    {/*  Author */}
                    <div className='flex items-center'>
                        <Image
                            width={40}
                            height={40}
                            src={
                                post?.createdBy?.image?.url
                                    ? post?.createdBy?.image?.url
                                    : post?.createdBy?.image ||
                                      '/paceholder-user.jpg'
                            }
                            alt={post?.createdBy?.name}
                            className='w-12 h-12 rounded-full mr-3 ring-2 ring-primary/10'
                        />
                        <div>
                            <p className='font-semibold text-gray-900 dark:text-gray-400'>
                                {post?.createdBy?.name}
                            </p>
                        </div>
                    </div>
                    <div className='flex items-center'>
                        <Calendar className='w-4 h-4 mr-2' />
                        <span>{formatDate(post?.createdAt, 'short')}</span>
                    </div>
                    <div className='flex items-center'>
                        <Clock className='w-4 h-4 mr-2' />
                        <span>
                            {Math.ceil(
                                post?.content?.length / readPerMinute
                            ) === 0
                                ? 1
                                : Math.ceil(
                                      post?.content?.length / readPerMinute
                                  )}{' '}
                            min read
                        </span>
                    </div>
                    <Controlls />
                </div>

                {/* Featured Image */}
                <div className='mb-12 relative rounded-2xl aspect-video overflow-hidden shadow-2xl'>
                    <Image
                        fill
                        src={
                            post?.mainImage?.url ||
                            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=600&fit=crop'
                        }
                        alt='UX review presentations'
                        className='w-full h-auto object-cover'
                    />
                </div>

                {/* Article Content */}
                <div
                    className='prose prose-lg max-w-none
                  [&>p]:text-gray-700 dark:[&>p]:text-gray-300 [&>p]:leading-relaxed [&>p]:mb-6
                  [&>p:first-of-type]:text-xl [&>p:first-of-type]:mb-8
                  [&>h1]:text-4xl [&>h1]:font-bold [&>h1]:text-gray-900 dark:[&>h1]:text-gray-100 [&>h1]:mt-16 [&>h1]:mb-8
                  [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-gray-900 dark:[&>h2]:text-gray-100 [&>h2]:mt-12 [&>h2]:mb-6
                  [&>h3]:text-2xl [&>h3]:font-semibold [&>h3]:text-gray-900 dark:[&>h3]:text-gray-100 [&>h3]:mt-8 [&>h3]:mb-4
                  [&>h4]:text-xl [&>h4]:font-semibold [&>h4]:text-gray-900 dark:[&>h4]:text-gray-100 [&>h4]:mt-6 [&>h4]:mb-3
                  [&>h5]:text-lg [&>h5]:font-semibold [&>h5]:text-gray-900 dark:[&>h5]:text-gray-100 [&>h5]:mt-4 [&>h5]:mb-2
                  [&>h6]:text-base [&>h6]:font-semibold [&>h6]:text-gray-900 dark:[&>h6]:text-gray-100 [&>h6]:mt-4 [&>h6]:mb-2
                  [&>strong]:font-semibold [&>strong]:text-gray-900 dark:[&>strong]:text-gray-100
                  [&>em]:italic [&>em]:text-gray-700 dark:[&>em]:text-gray-300
                  [&>a]:text-primary [&>a]:underline [&>a]:hover:text-primary/80 [&>a]:transition-colors
                  [&>ul]:list-disc [&>ul]:list-inside [&>ul]:mb-6 [&>ul]:text-gray-700 dark:[&>ul]:text-gray-300 [&>ul]:space-y-2
                  [&>ol]:list-decimal [&>ol]:list-inside [&>ol]:mb-6 [&>ol]:text-gray-700 dark:[&>ol]:text-gray-300 [&>ol]:space-y-2
                  [&>li]:leading-relaxed
                  [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-6
                  [&>blockquote]:my-8 [&>blockquote]:italic [&>blockquote]:text-gray-800 dark:[&>blockquote]:text-gray-300
                  [&>code]:bg-gray-100 dark:[&>code]:bg-gray-800 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded
                  [&>code]:text-sm [&>code]:font-mono [&>code]:text-gray-800 dark:[&>code]:text-gray-200
                  [&>pre]:bg-gray-900 dark:[&>pre]:bg-gray-950 [&>pre]:text-gray-100 [&>pre]:p-6 [&>pre]:rounded-lg
                  [&>pre]:overflow-x-auto [&>pre]:my-8 [&>pre]:text-sm [&>pre]:font-mono
                  [&>img]:rounded-lg [&>img]:shadow-md [&>img]:my-8 [&>img]:w-full
                  [&>hr]:border-gray-200 dark:[&>hr]:border-gray-700 [&>hr]:my-12
                  [&>table]:w-full [&>table]:border-collapse [&>table]:my-8
                  [&>table_th]:bg-gray-100 dark:[&>table_th]:bg-gray-800 [&>table_th]:border [&>table_th]:border-gray-300 dark:[&>table_th]:border-gray-600
                  [&>table_th]:px-4 [&>table_th]:py-2 [&>table_th]:text-left [&>table_th]:font-semibold dark:[&>table_th]:text-gray-200
                  [&>table_td]:border [&>table_td]:border-gray-300 dark:[&>table_td]:border-gray-600 [&>table_td]:px-4 [&>table_td]:py-2 dark:[&>table_td]:text-gray-300
                  [&>.bg-purple-50]:bg-purple-50 dark:[&>.bg-purple-50]:bg-purple-900/20 [&>.bg-purple-50]:border-l-4 [&>.bg-purple-50]:border-primary
                  [&>.bg-purple-50]:p-6 [&>.bg-purple-50]:my-8 [&>.bg-purple-50]:rounded-r-lg
                  [&>.bg-purple-50>p]:text-gray-800 dark:[&>.bg-purple-50>p]:text-gray-300 [&>.bg-purple-50>p]:italic [&>.bg-purple-50>p]:mb-0
                  [&>iframe]:w-full [&>iframe]:aspect-video [&>iframe]:rounded-lg [&>iframe]:my-8
                  [&>video]:w-full [&>video]:rounded-lg [&>video]:my-8 [&>video]:shadow-md'
                    dangerouslySetInnerHTML={{ __html: post?.content || '' }}
                />

                {/* Engagement Section */}
                <CommentsSection
                    blogId={post?.id}
                    postTitle={post?.title}
                    comments={post?.comments || []}
                />
            </article>
        </>
    );
};

export default BlogPostDetails;
