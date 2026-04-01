import Link from 'next/link';

const SearchClearButton = () => {
    return (
        <Link
            href={`?`}
            className='inline-flex items-center px-4 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors'>
            Clear search
        </Link>
    );
};

export default SearchClearButton;

