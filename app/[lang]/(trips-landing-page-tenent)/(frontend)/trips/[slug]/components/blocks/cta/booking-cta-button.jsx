import Link from 'next/link';

const BookingCTAButton = ({
    title,
    description,
    buttonText,
    link = '#sidebar',
}) => {
    return (
        <div className='p-8 rounded-xl bg-primary/5 border border-primary/10 relative overflow-hidden group/booking'>
            <div className='absolute top-0 right-0 p-12 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover/booking:scale-150 transition-transform duration-700' />
            <div className='relative z-10 space-y-4'>
                <h4 className='text-xl sm:text-2xl text-foreground tracking-tight'>
                    {title}
                </h4>
                <p className='text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed'>
                    {description}
                </p>
                <Link
                    href={link}
                    className='inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-bold h-14 px-8 rounded-2xl transition-all shadow-xl shadow-primary/20 group-hover/booking:translate-x-1 duration-300'>
                    {buttonText}
                </Link>
            </div>
        </div>
    );
};

export default BookingCTAButton;

