const SectionTitle = ({ title, highlightedText }) => {
    return (
        <h1 className='text-4xl font-nyght-serif md:text-5xl font-bold text-center mb-16 text-foreground'>
            {title}{' '}
            <span className='text-primary italic'>{highlightedText}</span>
        </h1>
    );
};

export default SectionTitle;

