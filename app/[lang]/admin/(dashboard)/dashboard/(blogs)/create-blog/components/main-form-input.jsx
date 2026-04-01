import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { File02Icon, ImageUploadIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Controller, useFormContext } from 'react-hook-form';
import { ImageUploadWithSelector } from '../../../components/common/image-upload-selector';

const MainFormSection = () => {
    const {
        control,
        formState: { errors },
        watch,
    } = useFormContext();
    const content = watch('content');

    return (
        <div className='space-y-2'>
            {/* Title Card */}
            <Card className='shadow-sm border-border bg-card hover:shadow-md transition-shadow duration-200'>
                <CardContent className=''>
                    <div className='space-y-1'>
                        <label className='text-sm font-semibold text-foreground flex items-center gap-2'>
                            <HugeiconsIcon
                                icon={File02Icon}
                                className='w-4 h-4 text-primary'
                            />
                            Post Title
                            <span className='text-destructive'>*</span>
                        </label>
                        <Controller
                            name='title'
                            control={control}
                            rules={{
                                required: 'Title is required',
                                minLength: {
                                    value: 4,
                                    message:
                                        'Title must be at least 4 characters',
                                },
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder='Enter an engaging title for your post...'
                                    className='text-sm border-input bg-background focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200'
                                />
                            )}
                        />
                        {errors.title && (
                            <p className='text-xs text-destructive font-medium flex items-center gap-1'>
                                {errors.title.message}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Content Editor Card */}
            <Card className='shadow-sm border-border bg-card hover:shadow-md transition-shadow duration-200'>
                <CardHeader className='border-b border-border bg-muted/20 '>
                    <CardTitle className='text-sm font-semibold text-foreground'>
                        Content
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Controller
                        name='content'
                        control={control}
                        rules={{
                            required: 'Content is required',
                            minLength: {
                                value: 10,
                                message:
                                    'Content must be at least 10 characters',
                            },
                        }}
                        render={({ field }) => (
                            <div className='rounded-lg border border-input overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:border-ring transition-all duration-200'>
                                <RichTextEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder='Write comprehensive details of your blog post...'
                                />
                            </div>
                        )}
                    />
                    {errors.content && (
                        <p className='text-xs text-destructive font-medium flex items-center gap-1'>
                            {errors.content.message}
                        </p>
                    )}
                    <div className='flex justify-between items-center text-xs text-muted-foreground '>
                        <span className='flex items-center gap-1.5'>
                            Word count:{' '}
                            <span className='text-foreground font-semibold'>
                                {content.split(/\s+/).filter(Boolean).length}
                            </span>
                        </span>
                        <span className='flex items-center gap-1.5'>
                            Characters:{' '}
                            <span className='text-foreground font-semibold'>
                                {content.length}
                            </span>
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Featured Image Card */}
            <Card className='shadow-sm border-border bg-card hover:shadow-md transition-shadow duration-200'>
                <CardHeader className='border-b border-border bg-muted/20 px-4 py-2.5'>
                    <CardTitle className='text-sm font-semibold flex items-center gap-2 text-foreground'>
                        <HugeiconsIcon
                            icon={ImageUploadIcon}
                            className='w-5 h-5 text-primary'
                        />
                        Featured Image
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-3'>
                    <Controller
                        name='mainImage'
                        control={control}
                        render={({ field }) => (
                            <div className='rounded-lg border border-input overflow-hidden bg-muted/5 hover:bg-muted/10 transition-colors duration-200'>
                                <ImageUploadWithSelector
                                    fieldName='mainImage'
                                    onChange={field.onChange}
                                    multiple={false}
                                />
                            </div>
                        )}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default MainFormSection;

