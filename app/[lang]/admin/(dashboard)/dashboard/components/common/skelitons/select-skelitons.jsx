const SelectSkeiton = () => {
    return (
        <div className='space-y-2'>
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className='h-10 w-full rounded-md bg-gray-200 animate-pulse' />
            ))}
        </div>
    );
};

export default SelectSkeiton;

