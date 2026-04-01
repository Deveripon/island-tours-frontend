import { cn } from '@/lib/utils';

const SectionTitle = ({ children, className }) => {
    return (
        <h2
            className={cn(
                'text-2xl sm:text-3xl font-bold mb-8 text-foreground tracking-tight',
                className
            )}>
            {children}
        </h2>
    );
};

export default SectionTitle;

