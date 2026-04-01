const TourTypeSkeliton = () => {
    return (
        <div className='grid grid-cols-2 gap-2'>
            {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className='flex items-center space-x-2 animate-pulse'>
                    {/* Checkbox placeholder */}
                    <div className='w-4 h-4 bg-gray-300 rounded' />

                    {/* Label placeholder */}
                    <div className='h-4 w-24 bg-gray-300 rounded' />
                </div>
            ))}
        </div>
    );
};

export default TourTypeSkeliton;

