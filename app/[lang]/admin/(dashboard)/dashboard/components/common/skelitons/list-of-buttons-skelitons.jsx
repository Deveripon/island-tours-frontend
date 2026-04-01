const ListOfButtonsSkeliton = () => {
    return (
        <div className='flex flex-wrap gap-2'>
            {Array.from({ length: 8 }).map((_, index) => (
                <div
                    key={index}
                    className='bg-gray-200 rounded-md flex items-center px-2 py-2 text-sm animate-pulse'>
                    {/* Simulate text */}
                    <div className='h-4 w-12 bg-gray-300 rounded' />
                </div>
            ))}
        </div>
    );
};

export default ListOfButtonsSkeliton;

