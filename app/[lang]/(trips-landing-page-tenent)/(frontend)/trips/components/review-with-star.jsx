import { Star } from 'lucide-react';

const ReviewWithStar = ({ trip }) => {
    return (
        <div className='flex items-center space-x-1'>
            <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
            <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
            {/*    <span className='text-sm font-medium'>{trip.rating}</span> */}
            {trip?._count?.reviews > 0 && (
                <span className='text-sm text-gray-500'>
                    ({trip._count?.reviews})
                </span>
            )}
        </div>
    );
};

export default ReviewWithStar;

