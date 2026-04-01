const NewsLatter = () => {
    return (
        <section className='py-16 bg-primary/10'>
            <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
                <h2 className='text-3xl font-bold text-primary mb-4'>
                    Stay Updated
                </h2>
                <p className='text-sm text-muted-foreground mb-8'>
                    Get the latest updates and exclusive offers straight to your
                    inbox.
                </p>
                <div className='flex flex-col sm:flex-row gap-3 max-w-md mx-auto'>
                    <input
                        type='email'
                        placeholder='Enter your email'
                        className='flex-1 px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary'
                    />
                    <button className='px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors'>
                        Subscribe
                    </button>
                </div>
            </div>
        </section>
    );
};

export default NewsLatter;

