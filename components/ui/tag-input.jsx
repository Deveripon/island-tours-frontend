import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { useState } from 'react';

export function TagInput({
    placeholder = 'Add tag...',
    tags,
    setTags,
    disabled = false }) {
    const [inputValue, setInputValue] = useState('');

    const addTag = tag => {
        tag = tag.trim();
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
        }
        setInputValue('');
    };

    const removeTag = index => {
        setTags(tags.filter((_, i) => i !== index));
    };

    const handleKeyDown = e => {
        if (disabled) return;

        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    };

    const handleBlur = () => {
        if (inputValue.trim()) {
            addTag(inputValue);
        }
    };

    return (
        <div className='flex flex-wrap gap-2 p-2 bg-background rounded-md border border-input min-h-10'>
            {tags.map((tag, index) => (
                <Badge
                    key={index}
                    variant='outline'
                    className='h-7 bg-sass-primary/20 text-sass-primary  border border-sass-primary/20 px-2'>
                    {tag}
                    {!disabled && (
                        <button
                            type='button'
                            onClick={() => removeTag(index)}
                            className='ml-1 cursor-pointer text-gray-700 hover:text-foreground'>
                            <X className='h-3 w-3' />
                        </button>
                    )}
                </Badge>
            ))}
            <Input
                type='text'
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                disabled={disabled}
                placeholder={tags.length === 0 ? placeholder : ''}
                className='flex-1 min-w-[120px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-7 text-sm'
            />
        </div>
    );
}

