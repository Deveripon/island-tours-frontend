import { Badge } from '@/components/ui/badge';

const TripTypes = ({ trip }) => {
    return (
        <div className='flex flex-wrap gap-1 mb-4'>
            {trip?.tourTypes?.tourTypes.slice(0, 2).map((type, index) => (
                <Badge key={index} variant='outline' className='text-sm'>
                    {type}
                </Badge>
            ))}
        </div>
    );
};

export default TripTypes;

