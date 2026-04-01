import { cn } from '@/lib/utils';

function SectionTitle({ children, subtitle, className, ...props }) {
    return (
        <>
            <h3 className='text-sm font-bold tracking-wide uppercase text-sass-primary'>
                {subtitle}
            </h3>
            <h2
                {...props}
                className={cn(
                    ` text-[30px] sm:text-[42px] font-bold mb-12`,
                    className
                )}>
                {children}
            </h2>
        </>
    );
}

export default SectionTitle;

