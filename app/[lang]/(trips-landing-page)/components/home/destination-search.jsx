import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ArrowUpRight01Icon, Clock01Icon, Location01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useRef, useState } from 'react';

const DestinationSearch = ({
    destination,
    setDestination,
    content = {},
    className = '',
    availableDestinations,
    iconColor = 'text-muted-foreground',
    onChange = () => {} }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(destination);
    const [filteredDestinations, setFilteredDestinations] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const wrapperRef = useRef(null);

    useEffect(() => {
        setSearchQuery(destination);
    }, [destination]);

    useEffect(() => {
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const filtered = availableDestinations.filter(
                dest =>
                    dest.name.toLowerCase().includes(query) ||
                    dest.country.toLowerCase().includes(query) ||
                    dest.city.toLowerCase().includes(query) ||
                    dest.region.toLowerCase().includes(query)
            );
            setFilteredDestinations(filtered);
        } else {
            setFilteredDestinations([]);
        }
    }, [searchQuery, availableDestinations]);

    useEffect(() => {
        const handleClickOutside = event => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = e => {
        const value = e.target.value;
        setSearchQuery(value);
        setDestination(value);
        setIsOpen(true);

        const syntheticEvent = {
            ...e,
            target: {
                ...e.target,
                value: value,
            },
        };
        onChange(syntheticEvent);
    };

    const handleSelectDestination = dest => {
        const selectedValue = `${dest.name}, ${dest.country}`;
        setSearchQuery(selectedValue);
        setDestination(selectedValue);

        setRecentSearches(prev => {
            const updated = [
                selectedValue,
                ...prev.filter(item => item !== selectedValue),
            ];
            return updated.slice(0, 4);
        });

        setIsOpen(false);

        onChange({
            target: {
                value: selectedValue,
            } });
    };

    const handleRecentSearch = search => {
        setSearchQuery(search);
        setDestination(search);
        setIsOpen(true);

        onChange({
            target: {
                value: search,
            } });
    };

    const showRecentSearches = !searchQuery.trim() && recentSearches.length > 0;
    const showSuggestions =
        searchQuery.trim() && filteredDestinations.length > 0;

    return (
        <div className='relative w-full max-w-md' ref={wrapperRef}>
            {/* Search Input */}
            <div className='relative'>
                <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none z-10'>
                    <HugeiconsIcon icon={Location01Icon} className={cn('h-4 w-4 ', iconColor)} />
                </div>
                <Input
                    type='text'
                    placeholder={content?.whereTo || 'Where to ?'}
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    className={cn(
                        'pl-10 border border-input dark:border-input dark:text-foreground  ring-0 outline-0  !focus:ring-0 !focus:outline-0 bg-background dark:bg-background',
                        className
                    )}
                />
            </div>

            {/* Dropdown */}
            {isOpen && (showRecentSearches || showSuggestions) && (
                <div className='absolute z-50 w-sm mt-2 bg-background dark:bg-background border border-border dark:border-border rounded-lg shadow-lg max-h-96 overflow-y-auto'>
                    {/* Recent Searches */}
                    {showRecentSearches && (
                        <div className='p-2'>
                            <div className='flex items-center justify-between px-3 py-2 mb-1 border-b border-border dark:border-border'>
                                <span className='text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase'>
                                    Your Recent Searches
                                </span>
                                <button
                                    onClick={() => setRecentSearches([])}
                                    className='text-xs text-success dark:text-success hover:text-success/80 dark:hover:text-success/80 font-medium'>
                                    Clear All
                                </button>
                            </div>
                            {recentSearches.map((search, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleRecentSearch(search)}
                                    className='w-full flex items-center justify-between px-3 py-2.5 hover:bg-accent dark:hover:bg-accent rounded-md group transition-colors'>
                                    <div className='flex items-center gap-3'>
                                        <HugeiconsIcon icon={Clock01Icon} className='h-4 w-4 text-muted-foreground dark:text-muted-foreground' />
                                        <span className='text-sm text-foreground dark:text-foreground'>
                                            {search}
                                        </span>
                                    </div>
                                    <HugeiconsIcon icon={ArrowUpRight01Icon} className='h-4 w-4 text-muted-foreground dark:text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity' />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Destination Suggestions */}
                    {showSuggestions && (
                        <div className='p-2 border-t border-border dark:border-border'>
                            <div className='px-3 py-2 mb-1'>
                                <span className='text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase'>
                                    Destinations
                                </span>
                            </div>
                            {filteredDestinations.map(dest => (
                                <button
                                    key={dest.id}
                                    onClick={() =>
                                        handleSelectDestination(dest)
                                    }
                                    className='w-full flex items-start gap-3 px-3 py-2.5 hover:bg-accent dark:hover:bg-accent rounded-md transition-colors text-left'>
                                    <HugeiconsIcon icon={Location01Icon} className='h-4 w-4 text-success dark:text-success mt-0.5 flex-shrink-0' />
                                    <div className='flex-1 min-w-0'>
                                        <div className='text-sm font-medium text-foreground dark:text-foreground truncate'>
                                            {dest.name}
                                        </div>
                                        <div className='text-xs text-muted-foreground dark:text-muted-foreground mt-0.5'>
                                            {[
                                                dest.city,
                                                dest.country,
                                                dest.region,
                                            ]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {searchQuery.trim() &&
                        filteredDestinations.length === 0 && (
                            <div className='p-8 text-center'>
                                <HugeiconsIcon icon={Location01Icon} className='h-8 w-8 text-muted-foreground dark:text-muted-foreground mx-auto mb-2' />
                                <p className='text-sm text-muted-foreground dark:text-muted-foreground'>
                                    No destinations found
                                </p>
                                <p className='text-xs text-muted-foreground dark:text-muted-foreground mt-1'>
                                    Try a different search term
                                </p>
                            </div>
                        )}

                    {/* Quick Tags */}
                    {showRecentSearches && (
                        <div className='p-3 border-t border-border dark:border-border'>
                            <div className='flex flex-wrap gap-2'>
                                {recentSearches
                                    .slice(0, 3)
                                    .map((tag, index) => (
                                        <button
                                            key={`${tag}-${index}`}
                                            onClick={() => {
                                                handleRecentSearch(tag);
                                                setIsOpen(true);
                                            }}
                                            className='px-3 py-1.5 bg-secondary dark:bg-secondary hover:bg-secondary/80 dark:hover:bg-secondary/80 rounded-full text-xs font-medium text-foreground dark:text-foreground transition-colors'>
                                            {tag}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DestinationSearch;

