import BlogCard from '../../components/blog-card';

const RelatedPosts = async ({ relatedPosts }) => {
    const res = await relatedPosts;
    const posts = res?.data?.data?.relatedBlogs;
    if (!posts || posts.length === 0) {
        return null;
    }
    return (
        <section className=' py-16 mt-16'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-gray-300 mb-8'>
                    Related Articles
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    {posts.map(post => (
                        <BlogCard
                            key={post.id}
                            post={post}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RelatedPosts;
