import { Badge } from '@/components/ui/badge';
import { AlertCircleIcon, ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const Header = ({ bookingData }) => {
    return (
        <div className='bg-card rounded-xl shadow-sm border border-border p-6 mb-4'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between '>
                <div>
                    <h1 className='text-lg text-foreground font-medium'>
                        Booking Details
                    </h1>
                    <p className='text-sm font-medium text-muted-foreground mt-2'>
                        Reference:{' '}
                        <span className='text-foreground font-mono'>
                            {bookingData?.bookingReference}
                        </span>
                    </p>
                </div>
                <div className='flex items-center gap-4 mt-4 md:mt-0'>
                    <Badge
                        className={`text-sm font-medium px-3 py-1.5 tracking-wide flex items-center gap-1.5 ${
                            bookingData.status === 'CONFIRMED'
                                ? 'bg-success/10 text-success border-success/20'
                                : bookingData.status === 'COMPLETED'
                                ? 'bg-success/10 text-success border-success/20 hover:bg-success/20'
                                : 'bg-muted border-border text-muted-foreground hover:bg-muted/80'
                        } `}>
                        {bookingData.status === 'DRAFT' ? (
                            <HugeiconsIcon icon={AlertCircleIcon} size={14} />
                        ) : (
                            <HugeiconsIcon icon={ArrowDown01Icon} size={14} />
                        )}
                        {bookingData.status}
                    </Badge>
                </div>
            </div>
        </div>
    );
};

export default Header;

