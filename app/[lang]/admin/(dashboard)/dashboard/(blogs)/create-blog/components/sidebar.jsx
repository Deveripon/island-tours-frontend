import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Add01Icon,
    Calendar03Icon,
    Cancel01Icon,
    FolderOpenIcon,
    Globe02Icon,
    LicenseDraftIcon,
    Tag01Icon,
    ViewIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

const FormSidebar = ({ onSaveDraft, tags, setTags }) => {
    const [currentTag, setCurrentTag] = useState('');
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [customCategories, setCustomCategories] = useState([]);
    const {
        control,
        watch,
        setValue,
        formState: { errors },
    } = useFormContext();

    const defaultCategories = [
        { value: 'uncategorized', label: 'Uncategorized' },
        { value: 'travel-tips', label: 'Travel Tips' },
        { value: 'destinations', label: 'Destinations' },
        { value: 'food-culture', label: 'Food & Culture' },
        { value: 'adventure', label: 'Adventure' },
        { value: 'budget-travel', label: 'Budget Travel' },
        { value: 'photography', label: 'Photography' },
    ];

    const allCategories = [...defaultCategories, ...customCategories];

    const removeTag = tagToRemove => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyPress = e => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        }
    };

    const handleCategoryToggle = categoryValue => {
        const currentCategories = selectedCategories || [];
        const newCategories = currentCategories.includes(categoryValue)
            ? currentCategories.filter(c => c !== categoryValue)
            : [...currentCategories, categoryValue];
        setValue('category', newCategories);
    };

    const handleAddNewCategory = () => {
        if (newCategoryName.trim()) {
            const categoryValue = newCategoryName
                .toLowerCase()
                .replace(/\s+/g, '-');
            const newCategory = {
                value: categoryValue,
                label: newCategoryName.trim(),
            };
            setCustomCategories([...customCategories, newCategory]);
            setNewCategoryName('');
            setShowNewCategoryInput(false);
        }
    };

    const handleCancelNewCategory = () => {
        setNewCategoryName('');
        setShowNewCategoryInput(false);
    };

    const selectedCategories = watch('category');
    const addTag = () => {
        if (currentTag.trim() && !tags.includes(currentTag.trim())) {
            setTags([...tags, currentTag.trim()]);
            setCurrentTag('');
        }
    };

    const status = watch('status');

    return (
        <div className='space-y-4'>
            {/* Publish Actions */}
            <Card className='sticky top-6 shadow-sm border-border bg-card hover:shadow-md transition-shadow duration-200'>
                <CardHeader className='border-b border-border bg-muted/20 px-3 py-2.5'>
                    <CardTitle className='text-sm font-semibold flex items-center gap-2 text-foreground'>
                        <HugeiconsIcon
                            icon={Globe02Icon}
                            className='w-4 h-4 text-primary'
                        />
                        Publish
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-3 space-y-3'>
                    <div className='space-y-2.5'>
                        <div className='flex items-center justify-between text-sm'>
                            <span className='text-muted-foreground flex items-center gap-2 font-medium'>
                                <HugeiconsIcon
                                    icon={Calendar03Icon}
                                    className='w-4 h-4'
                                />
                                Status:
                            </span>
                            {status === 'PUBLISHED' ? (
                                <Badge
                                    variant='secondary'
                                    className='bg-success/10 text-success border-success/20 text-xs font-semibold'>
                                    Published
                                </Badge>
                            ) : (
                                <Badge
                                    variant='secondary'
                                    className='bg-warning/10 text-warning border-warning/20 text-xs font-semibold'>
                                    Draft
                                </Badge>
                            )}
                        </div>
                        <div className='flex items-center justify-between text-sm'>
                            <span className='text-muted-foreground flex items-center gap-2 font-medium'>
                                <HugeiconsIcon
                                    icon={ViewIcon}
                                    className='w-4 h-4'
                                />
                                Visibility:
                            </span>
                            <span className='font-semibold text-foreground text-xs'>
                                Public
                            </span>
                        </div>
                    </div>

                    <div className='pt-2 space-y-2 border-t border-border'>
                        <Button
                            type='submit'
                            className='w-full text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow transition-all duration-200'>
                            <HugeiconsIcon
                                icon={Globe02Icon}
                                className='w-4 h-4 mr-2'
                            />
                            Publish Now
                        </Button>
                        <Button
                            type='button'
                            onClick={onSaveDraft}
                            variant='outline'
                            className='w-full text-sm font-semibold border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200'>
                            <HugeiconsIcon
                                icon={LicenseDraftIcon}
                                className='w-4 h-4 mr-2'
                            />
                            Save Draft
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Category Selection */}
            <Card className='shadow-sm border-border bg-card hover:shadow-md transition-shadow duration-200'>
                <CardHeader className='border-b border-border bg-muted/20 px-3 py-2.5'>
                    <CardTitle className='text-sm font-semibold flex items-center gap-2 text-foreground'>
                        <HugeiconsIcon
                            icon={FolderOpenIcon}
                            className='w-5 h-5 text-primary'
                        />
                        Categories
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-3'>
                    <Controller
                        name='category'
                        control={control}
                        rules={{
                            validate: value =>
                                (value && value.length > 0) ||
                                'Please select at least one category',
                        }}
                        render={({ field }) => (
                            <div className='space-y-2'>
                                {allCategories.map(cat => (
                                    <label
                                        key={cat.value}
                                        className='flex items-center space-x-3 cursor-pointer group'>
                                        <Checkbox
                                            checked={(
                                                field.value || []
                                            ).includes(cat.value)}
                                            onCheckedChange={() =>
                                                handleCategoryToggle(cat.value)
                                            }
                                            className='w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-ring focus:ring-offset-0 cursor-pointer transition-all duration-200'
                                        />
                                        <span className='text-sm text-foreground font-medium group-hover:text-primary transition-colors duration-200'>
                                            {cat.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    />
                    {errors.category && (
                        <p className='text-xs text-destructive mt-2 font-medium'>
                            {errors.category.message}
                        </p>
                    )}

                    {showNewCategoryInput ? (
                        <div className='mt-2.5 space-y-2 p-2.5 bg-muted/20 rounded-lg border border-border'>
                            <Input
                                value={newCategoryName}
                                onChange={e =>
                                    setNewCategoryName(e.target.value)
                                }
                                placeholder='Enter category name...'
                                className='text-sm border-input bg-background focus:ring-2 focus:ring-ring'
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddNewCategory();
                                    }
                                }}
                            />
                            <div className='flex gap-2'>
                                <Button
                                    type='button'
                                    onClick={handleAddNewCategory}
                                    size='sm'
                                    className='flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold'>
                                    Add
                                </Button>
                                <Button
                                    type='button'
                                    onClick={handleCancelNewCategory}
                                    size='sm'
                                    variant='outline'
                                    className='flex-1 border-input bg-background hover:bg-accent hover:text-accent-foreground font-semibold'>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            type='button'
                            onClick={() => setShowNewCategoryInput(true)}
                            variant='link'
                            className='text-sm text-primary hover:text-primary/80 px-0 mt-2.5 font-semibold h-auto'>
                            + Add New Category
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Tags */}
            <Card className='shadow-sm border-border bg-card hover:shadow-md transition-shadow duration-200'>
                <CardHeader className='border-b border-border bg-muted/20 px-3 py-2.5'>
                    <CardTitle className='text-sm font-semibold flex items-center gap-2 text-foreground'>
                        <HugeiconsIcon
                            icon={Tag01Icon}
                            className='w-5 h-5 text-primary'
                        />
                        Tags
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-3'>
                    <div className='space-y-2.5'>
                        <div className='flex gap-2'>
                            <Input
                                value={currentTag}
                                onChange={e => setCurrentTag(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder='Add tags...'
                                className='flex-1 text-sm border-input bg-background focus:ring-2 focus:ring-ring'
                            />
                            <Button
                                type='button'
                                onClick={addTag}
                                size='sm'
                                className='bg-primary hover:bg-primary/90 text-primary-foreground'>
                                <HugeiconsIcon
                                    icon={Add01Icon}
                                    className='w-4 h-4'
                                />
                            </Button>
                        </div>

                        {tags.length > 0 && (
                            <div className='flex flex-wrap gap-2'>
                                {tags.map((tag, index) => (
                                    <Badge
                                        key={index}
                                        variant='secondary'
                                        className='bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-3 py-1.5 text-xs font-semibold transition-all duration-200'>
                                        {tag}
                                        <button
                                            type='button'
                                            onClick={() => removeTag(tag)}
                                            className='ml-2 hover:text-primary/70 transition-colors'>
                                            <HugeiconsIcon
                                                icon={Cancel01Icon}
                                                className='w-3 h-3'
                                            />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}

                        <p className='text-xs text-muted-foreground font-medium'>
                            Separate tags with commas or press Enter
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FormSidebar;

