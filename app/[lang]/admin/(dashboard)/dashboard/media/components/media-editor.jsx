import { updateUploadedMedia } from '@/app/_actions/mediaActions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatFileSize } from '@/lib/utils';
import {
    ArrowLeft01Icon,
    Cancel01Icon,
    Copy01Icon,
    Download02Icon,
    File02Icon,
    FloppyDiskIcon,
    Image02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export default function MediaEditor({
    item,
    onClose,
    onUpdateSuccess,
    selector,
}) {
    const [formData, setFormData] = useState({
        fileName: item.fileName || '',
        caption: item.caption || '',
        altText: item.altText || '',
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(item.url);
            toast.success('URL copied to clipboard');
        } catch (error) {
            toast.error('Failed to copy URL');
        }
    };

    const handleSave = useCallback(async () => {
        const updatedData = { ...formData };
        const res = await updateUploadedMedia(item.id, updatedData);

        if (res.success && res.result) {
            toast.success('Updated');

            if (onUpdateSuccess) onUpdateSuccess(res.result);
            if (!selector) onClose();
        } else {
            toast.error('Failed to update');
        }
    }, [formData, item.id, onClose, onUpdateSuccess, selector]);

    const seoScore = () => {
        let completed = 0;
        let total = 3;

        if (formData.fileName) completed++;
        if (formData.caption) completed++;
        if (formData.altText) completed++;

        return {
            completed,
            total,
            percentage: Math.round((completed / total) * 100),
        };
    };

    const score = seoScore();
    const filenameForDownload = (
        item.originalName ||
        item.fileName ||
        'download'
    )
        .split('.')
        .slice(0, -1)
        .join('.');

    if (selector) {
        return (
            <div className='h-full bg-card border border-border rounded-lg flex flex-col relative z-10 overflow-hidden'>
                <div className='flex items-center justify-between p-4 border-b border-border rounded-t-lg bg-card flex-shrink-0'>
                    <div className='flex items-center gap-2 flex-1 min-w-0'>
                        {item.resourceType === 'image' ||
                        item.type === 'image' ? (
                            <HugeiconsIcon
                                icon={Image02Icon}
                                size={20}
                                className='text-primary flex-shrink-0'
                            />
                        ) : (
                            <HugeiconsIcon
                                icon={File02Icon}
                                size={20}
                                className='text-primary flex-shrink-0'
                            />
                        )}
                        <h2 className='text-sm font-semibold text-foreground truncate'>
                            Edit Media
                        </h2>
                    </div>
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={onClose}
                        className='text-muted-foreground hover:text-foreground flex-shrink-0 h-8 w-8'>
                        <HugeiconsIcon icon={Cancel01Icon} size={16} />
                    </Button>
                </div>

                <div
                    data-lenis-prevent
                    className='flex-1 overflow-y-auto p-4 space-y-4'>
                    {(item.resourceType === 'image' ||
                        item.type === 'image') && (
                        <div className='relative dark:bg-gray-200 bg-muted rounded-lg p-4 flex items-center justify-center border border-border'>
                            <Image
                                width={200}
                                height={150}
                                src={item.url || item.src}
                                alt={formData.altText || formData.fileName}
                                className='max-w-full max-h-32 object-contain rounded'
                                priority
                            />
                        </div>
                    )}

                    <div className='space-y-2'>
                        <p
                            className='text-xs text-muted-foreground truncate'
                            title={item.originalName || item.fileName}>
                            {item.originalName || item.fileName}
                        </p>
                        <div className='flex gap-2'>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={handleCopyUrl}
                                className='h-8 px-2.5 text-xs'>
                                <HugeiconsIcon
                                    icon={Copy01Icon}
                                    size={12}
                                    className='mr-1'
                                />
                                Copy URL
                            </Button>
                            <Link
                                href={item.url.replace(
                                    '/upload/',
                                    `/upload/fl_attachment:${filenameForDownload}/`
                                )}
                                download={
                                    item.originalName ||
                                    item.fileName ||
                                    'media-file'
                                }
                                className='inline-flex items-center px-2.5 h-8 text-xs font-medium border border-border rounded-md hover:bg-accent text-foreground transition-colors'>
                                <HugeiconsIcon
                                    icon={Download02Icon}
                                    size={12}
                                    className='mr-1'
                                />
                                Download
                            </Link>
                        </div>
                    </div>

                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Label
                                htmlFor='seo-title'
                                className='text-xs font-medium text-foreground'>
                                SEO Title
                            </Label>
                            <Input
                                id='seo-title'
                                value={formData.fileName}
                                onChange={e =>
                                    handleInputChange(
                                        'fileName',
                                        e.target.value
                                    )
                                }
                                placeholder='Enter SEO-friendly title'
                                className='border-border text-sm h-8'
                            />
                            <div className='flex justify-between text-xs'>
                                <span className='text-muted-foreground'>
                                    Recommended: 20-30 characters
                                </span>
                                <span
                                    className={
                                        formData.fileName.length > 30
                                            ? 'text-destructive'
                                            : 'text-muted-foreground'
                                    }>
                                    {formData.fileName.length}/30
                                </span>
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <Label
                                htmlFor='seo-description'
                                className='text-xs font-medium text-foreground'>
                                SEO Description
                            </Label>
                            <Textarea
                                id='seo-description'
                                value={formData.caption}
                                onChange={e =>
                                    handleInputChange('caption', e.target.value)
                                }
                                placeholder='Enter detailed description for search engines'
                                rows={3}
                                className='border-border resize-none text-sm'
                            />
                            <div className='flex justify-between text-xs'>
                                <span className='text-muted-foreground'>
                                    Recommended: 150-160 characters
                                </span>
                                <span
                                    className={
                                        formData.caption.length > 160
                                            ? 'text-destructive'
                                            : 'text-muted-foreground'
                                    }>
                                    {formData.caption.length}/160
                                </span>
                            </div>
                        </div>

                        {(item.resourceType === 'image' ||
                            item.type === 'image') && (
                            <div className='space-y-2'>
                                <Label
                                    htmlFor='alt-text'
                                    className='text-xs font-medium text-foreground'>
                                    Alt Text
                                </Label>
                                <Textarea
                                    id='alt-text'
                                    value={formData.altText}
                                    onChange={e =>
                                        handleInputChange(
                                            'altText',
                                            e.target.value
                                        )
                                    }
                                    placeholder='Describe the image for accessibility'
                                    rows={2}
                                    className='border-border resize-none text-sm'
                                />
                                <p className='text-xs text-muted-foreground'>
                                    Brief, descriptive text for screen readers
                                </p>
                            </div>
                        )}

                        <Card className='p-3 border-border'>
                            <div className='flex items-center justify-between mb-2'>
                                <h4 className='text-xs font-medium text-foreground'>
                                    SEO Completeness
                                </h4>
                                <span
                                    className={`text-xs font-medium px-2 py-1 rounded-md ${
                                        score.percentage === 100
                                            ? 'bg-success/10 text-success'
                                            : score.percentage >= 66
                                              ? 'bg-warning/10 text-warning'
                                              : 'bg-destructive/10 text-destructive'
                                    }`}>
                                    {score.completed}/{score.total}
                                </span>
                            </div>

                            <div className='space-y-1'>
                                <div className='flex items-center gap-2'>
                                    <div
                                        className={`w-1.5 h-1.5 rounded-full ${
                                            formData.fileName
                                                ? 'bg-success'
                                                : 'bg-muted-foreground/30'
                                        }`}
                                    />
                                    <span className='text-xs text-foreground'>
                                        SEO Title
                                    </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div
                                        className={`w-1.5 h-1.5 rounded-full ${
                                            formData.caption
                                                ? 'bg-success'
                                                : 'bg-muted-foreground/30'
                                        }`}
                                    />
                                    <span className='text-xs text-foreground'>
                                        SEO Description
                                    </span>
                                </div>
                                {(item.resourceType === 'image' ||
                                    item.type === 'image') && (
                                    <div className='flex items-center gap-2'>
                                        <div
                                            className={`w-1.5 h-1.5 rounded-full ${
                                                formData.altText
                                                    ? 'bg-success'
                                                    : 'bg-muted-foreground/30'
                                            }`}
                                        />
                                        <span className='text-xs text-foreground'>
                                            Alt Text
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className='mt-2'>
                                <div className='w-full bg-muted-foreground/20 rounded-full h-1'>
                                    <div
                                        className={`h-1 rounded-full transition-all duration-300 ${
                                            score.percentage === 100
                                                ? 'bg-success'
                                                : score.percentage >= 66
                                                  ? 'bg-warning'
                                                  : 'bg-destructive'
                                        }`}
                                        style={{
                                            width: `${score.percentage}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className='flex items-center rounded-b-lg justify-between p-4 border-t border-border bg-card flex-shrink-0'>
                    <div className='text-xs text-muted-foreground'>
                        SEO Score:{' '}
                        <span
                            className={`font-medium ${
                                score.percentage === 100
                                    ? 'text-success'
                                    : score.percentage >= 66
                                      ? 'text-warning'
                                      : 'text-destructive'
                            }`}>
                            {score.percentage}%
                        </span>
                    </div>
                    <Button
                        onClick={handleSave}
                        size='sm'
                        className='bg-primary hover:bg-primary/90 text-primary-foreground h-8 px-3 text-xs flex items-center gap-1'>
                        <HugeiconsIcon icon={FloppyDiskIcon} size={12} />
                        {item?.fileName || item?.altText || item?.caption
                            ? 'Update'
                            : 'Update & Save'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className='fixed inset-0 z-[9999] flex bg-background overflow-hidden'>
            <div className='flex flex-col w-full h-full'>
                <div className='flex items-center justify-between p-6 border-b border-border bg-card flex-shrink-0'>
                    <div className='flex items-center gap-4 flex-1 min-w-0'>
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={onClose}
                            className='text-muted-foreground hover:text-foreground flex-shrink-0 h-9 w-9'>
                            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
                        </Button>

                        <div className='flex items-center gap-3 flex-1 min-w-0'>
                            {item.resourceType === 'image' ||
                            item.type === 'image' ? (
                                <HugeiconsIcon
                                    icon={Image02Icon}
                                    size={24}
                                    className='text-primary flex-shrink-0'
                                />
                            ) : (
                                <HugeiconsIcon
                                    icon={File02Icon}
                                    size={24}
                                    className='text-primary flex-shrink-0'
                                />
                            )}

                            <div className='min-w-0 flex-1'>
                                <h1 className='text-lg font-semibold text-foreground'>
                                    Edit Media
                                </h1>
                                <div className='flex items-center gap-2 mt-1'>
                                    <p
                                        className='text-xs text-muted-foreground truncate max-w-md'
                                        title={
                                            item.originalName || item.fileName
                                        }>
                                        {item.originalName || item.fileName}
                                    </p>
                                </div>
                                <div className='flex items-center gap-2 mt-1.5'>
                                    <p
                                        className='text-xs text-muted-foreground truncate max-w-md'
                                        title={item.url}>
                                        {item.url}
                                    </p>
                                    <Button
                                        variant='outline'
                                        size='sm'
                                        onClick={handleCopyUrl}
                                        className='h-8 px-2.5 text-xs flex-shrink-0'>
                                        <HugeiconsIcon
                                            icon={Copy01Icon}
                                            size={14}
                                            className='mr-1'
                                        />
                                        Copy URL
                                    </Button>

                                    <Link
                                        href={item.url.replace(
                                            '/upload/',
                                            `/upload/fl_attachment:${filenameForDownload}/`
                                        )}
                                        download={
                                            item.originalName ||
                                            item.fileName ||
                                            'media-file'
                                        }
                                        className='inline-flex items-center px-2.5 h-8 text-xs font-medium border border-border rounded-md hover:bg-accent text-foreground transition-colors flex-shrink-0'>
                                        <HugeiconsIcon
                                            icon={Download02Icon}
                                            size={14}
                                            className='mr-1'
                                        />
                                        Download
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center gap-3 flex-shrink-0'>
                        <div className='text-xs text-muted-foreground'>
                            SEO Score:{' '}
                            <span
                                className={`font-medium ${
                                    score.percentage === 100
                                        ? 'text-success'
                                        : score.percentage >= 66
                                          ? 'text-warning'
                                          : 'text-destructive'
                                }`}>
                                {score.percentage}%
                            </span>
                        </div>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={onClose}
                            className='h-9'>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            className='bg-primary hover:bg-primary/90 text-primary-foreground h-9 flex items-center gap-2'>
                            <HugeiconsIcon icon={FloppyDiskIcon} size={16} />
                            Save Changes
                        </Button>
                    </div>
                </div>

                <div className='flex flex-1 overflow-hidden'>
                    <div className='flex-1 bg-muted flex items-center justify-center p-4 md:p-8 min-h-0 border-r border-border overflow-hidden'>
                        <div className='w-full h-full relative flex items-center justify-center'>
                            {item.resourceType === 'image' ||
                            item.type === 'image' ? (
                                <div className='relative w-full h-full'>
                                    <Image
                                        fill
                                        src={item.url || item.src}
                                        alt={
                                            formData.altText ||
                                            formData.fileName
                                        }
                                        className='object-contain rounded-lg shadow-lg'
                                        priority
                                    />

                                    <div className='absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-md text-xs'>
                                        {item.width && item.height && (
                                            <span>
                                                {item.width} × {item.height}
                                            </span>
                                        )}
                                        {item.size && (
                                            <span className='ml-2'>
                                                • {formatFileSize(item.size)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className='flex flex-col items-center justify-center text-center p-12 bg-card rounded-lg shadow-md border border-border max-w-md'>
                                    <HugeiconsIcon
                                        icon={File02Icon}
                                        size={96}
                                        className='text-muted-foreground mb-6'
                                    />
                                    <h3 className='text-base font-semibold mb-2 text-foreground'>
                                        {formData.fileName || 'Document'}
                                    </h3>
                                    <p className='text-xs text-muted-foreground'>
                                        Preview not available for this file type
                                    </p>
                                    {item.size && (
                                        <p className='text-xs text-muted-foreground mt-2'>
                                            Size: {formatFileSize(item.size)}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='w-96 bg-card border-l border-border flex flex-col'>
                        <div
                            data-lenis-prevent
                            className='flex-1 overflow-y-auto p-6 pb-20'>
                            <div className='space-y-6'>
                                <div className='space-y-2'>
                                    <Label
                                        htmlFor='seo-title'
                                        className='text-sm font-medium text-foreground'>
                                        SEO Title
                                    </Label>
                                    <Input
                                        id='seo-title'
                                        value={formData.fileName}
                                        onChange={e =>
                                            handleInputChange(
                                                'fileName',
                                                e.target.value
                                            )
                                        }
                                        placeholder='Enter SEO-friendly title'
                                        className='bg-muted border-border h-9'
                                    />
                                    <div className='flex justify-between text-xs'>
                                        <span className='text-muted-foreground'>
                                            Recommended: 20-30 characters
                                        </span>
                                        <span
                                            className={`${
                                                formData.fileName.length > 30
                                                    ? 'text-destructive'
                                                    : 'text-muted-foreground'
                                            }`}>
                                            {formData.fileName.length}/30
                                        </span>
                                    </div>
                                </div>

                                <div className='space-y-2'>
                                    <Label
                                        htmlFor='seo-description'
                                        className='text-sm font-medium text-foreground'>
                                        SEO Description
                                    </Label>
                                    <Textarea
                                        id='seo-description'
                                        value={formData.caption}
                                        onChange={e =>
                                            handleInputChange(
                                                'caption',
                                                e.target.value
                                            )
                                        }
                                        placeholder='Enter detailed description for search engines'
                                        rows={4}
                                        className='bg-muted border-border resize-none'
                                    />
                                    <div className='flex justify-between text-xs'>
                                        <span className='text-muted-foreground'>
                                            Recommended: 150-160 characters
                                        </span>
                                        <span
                                            className={`${
                                                formData.caption.length > 160
                                                    ? 'text-destructive'
                                                    : 'text-muted-foreground'
                                            }`}>
                                            {formData.caption.length}/160
                                        </span>
                                    </div>
                                </div>

                                {(item.resourceType === 'image' ||
                                    item.type === 'image') && (
                                    <div className='space-y-2'>
                                        <Label
                                            htmlFor='alt-text'
                                            className='text-sm font-medium text-foreground'>
                                            Alt Text
                                        </Label>
                                        <Textarea
                                            id='alt-text'
                                            value={formData.altText}
                                            onChange={e =>
                                                handleInputChange(
                                                    'altText',
                                                    e.target.value
                                                )
                                            }
                                            placeholder='Describe the image for accessibility'
                                            rows={3}
                                            className='bg-muted border-border resize-none'
                                        />
                                        <p className='text-xs text-muted-foreground'>
                                            Brief, descriptive text for screen
                                            readers
                                        </p>
                                    </div>
                                )}

                                <Card className='p-4 bg-muted border-border'>
                                    <div className='flex items-center justify-between mb-3'>
                                        <h4 className='text-sm font-medium text-foreground'>
                                            SEO Completeness
                                        </h4>
                                        <span
                                            className={`text-xs font-medium px-2 py-1 rounded-md ${
                                                score.percentage === 100
                                                    ? 'bg-success/10 text-success'
                                                    : score.percentage >= 66
                                                      ? 'bg-warning/10 text-warning'
                                                      : 'bg-destructive/10 text-destructive'
                                            }`}>
                                            {score.completed}/{score.total}
                                        </span>
                                    </div>

                                    <div className='space-y-2'>
                                        <div className='flex items-center gap-2'>
                                            <div
                                                className={`w-2 h-2 rounded-full ${
                                                    formData.fileName
                                                        ? 'bg-success'
                                                        : 'bg-muted-foreground/30'
                                                }`}
                                            />
                                            <span className='text-sm text-foreground'>
                                                SEO Title
                                            </span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <div
                                                className={`w-2 h-2 rounded-full ${
                                                    formData.caption
                                                        ? 'bg-success'
                                                        : 'bg-muted-foreground/30'
                                                }`}
                                            />
                                            <span className='text-sm text-foreground'>
                                                SEO Description
                                            </span>
                                        </div>
                                        {(item.resourceType === 'image' ||
                                            item.type === 'image') && (
                                            <div className='flex items-center gap-2'>
                                                <div
                                                    className={`w-2 h-2 rounded-full ${
                                                        formData.altText
                                                            ? 'bg-success'
                                                            : 'bg-muted-foreground/30'
                                                    }`}
                                                />
                                                <span className='text-sm text-foreground'>
                                                    Alt Text
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className='mt-3'>
                                        <div className='w-full bg-muted-foreground/20 rounded-full h-1.5'>
                                            <div
                                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                                    score.percentage === 100
                                                        ? 'bg-success'
                                                        : score.percentage >= 66
                                                          ? 'bg-warning'
                                                          : 'bg-destructive'
                                                }`}
                                                style={{
                                                    width: `${score.percentage}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

