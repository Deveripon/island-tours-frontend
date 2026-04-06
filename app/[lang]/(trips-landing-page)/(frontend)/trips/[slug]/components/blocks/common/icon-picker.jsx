import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { iconCategories, iconMapping } from '../../../config/trip-icons';

export const IconPicker = ({ value, onChange, className }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredCategories = useMemo(() => {
        if (!search) return iconCategories;

        return iconCategories
            .map(category => ({
                ...category,
                icons: category.icons.filter(
                    icon =>
                        icon.label
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                        icon.value.toLowerCase().includes(search.toLowerCase())
                ),
            }))
            .filter(category => category.icons.length > 0);
    }, [search]);

    const SelectedIcon = value ? iconMapping[value] : null;

    return (
        <Popover open={open} onOpenChange={setOpen} modal={false}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    type='button'
                    onPointerDown={e => e.stopPropagation()}
                    onMouseDown={e => e.stopPropagation()}
                    role='combobox'
                    aria-expanded={open}
                    className={cn(
                        'w-10 h-10 p-0 rounded-lg border-dashed hover:border-solid hover:border-primary/50 hover:bg-primary/5 transition-all',
                        value
                            ? 'border-primary/20 bg-primary/5'
                            : 'text-muted-foreground',
                        className
                    )}>
                    {SelectedIcon ? (
                        <SelectedIcon className='w-5 h-5 text-primary' />
                    ) : (
                        <Search className='w-4 h-4 opacity-50' />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className='w-[320px] p-0 rounded-2xl shadow-2xl border-border z-[500]'
                align='start'
                onPointerDown={e => e.stopPropagation()}>
                <div className='flex items-center border-b px-4 py-1'>
                    <Search className='mr-2 h-4 w-4 shrink-0 opacity-40' />
                    <Input
                        placeholder='Search icons...'
                        className='flex h-11 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground/50 border-none focus-visible:ring-0 px-0'
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div
                    className='h-[350px] overflow-y-auto px-1 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent overscroll-contain touch-pan-y'
                    data-lenis-prevent
                    onWheel={e => e.stopPropagation()}>
                    <div className='p-3 space-y-6'>
                        {filteredCategories.map(category => (
                            <div key={category.name} className='space-y-2.5'>
                                <h4 className='text-[10px] font-black   tracking-[0.1em] text-muted-foreground/60 px-1'>
                                    {category.name}
                                </h4>
                                <div className='grid grid-cols-6 gap-1.5'>
                                    {category.icons.map(icon => {
                                        const IconComponent = icon.component;
                                        return (
                                            <button
                                                key={icon.value}
                                                type='button'
                                                onClick={() => {
                                                    onChange(icon.value);
                                                    setOpen(false);
                                                }}
                                                className={cn(
                                                    'flex items-center justify-center h-10 w-10 rounded-xl transition-all hover:scale-110 hover:bg-primary/40 hover:text-foreground   active:scale-95',
                                                    value === icon.value
                                                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                                        : 'text-muted-foreground hover:bg-primary/40 hover:text-foreground'
                                                )}
                                                title={icon.label}>
                                                <IconComponent className='h-5 w-5' />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                        {filteredCategories.length === 0 && (
                            <div className='py-12 text-center text-sm text-muted-foreground flex flex-col items-center gap-2'>
                                <Search className='w-8 h-8 opacity-10' />
                                <p>No icons found</p>
                            </div>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

