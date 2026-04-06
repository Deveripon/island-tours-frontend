import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
    ArrowDown01Icon,
    ArrowUp01Icon,
    EyeIcon,
    Facebook01Icon,
    Search01Icon,
    ViewOffIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ImageUploadWithSelector } from '../../../components/common/image-upload-selector';

const CollapsibleSection = ({ title, isOpen, onToggle, children }) => {
    return (
        <div className='border border-border rounded-lg overflow-hidden shadow-sm bg-card hover:shadow-md transition-shadow duration-200'>
            <button
                type='button'
                onClick={onToggle}
                className='w-full flex items-center justify-between px-3 py-6 bg-muted/20 hover:bg-muted/30 transition-all duration-200'>
                <h3 className='text-sm font-semibold text-foreground'>
                    {title}
                </h3>
                {isOpen ? (
                    <HugeiconsIcon
                        icon={ArrowUp01Icon}
                        className='w-5 h-5 text-muted-foreground'
                    />
                ) : (
                    <HugeiconsIcon
                        icon={ArrowDown01Icon}
                        className='w-5 h-5 text-muted-foreground'
                    />
                )}
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}>
                        <div className='p-3 space-y-4 bg-card border-t border-border'>
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export function BlogSeoForm() {
    const { control, watch, setValue } = useFormContext();
    const [showPreview, setShowPreview] = useState(false);
    const [openSections, setOpenSections] = useState({
        main: false,
        basic: false,
        social: false,
        advanced: false });
    const [userEdited, setUserEdited] = useState({
        seoTitle: false,
        seoDescription: false,
        ogTitle: false,
        ogDescription: false,
        twitterTitle: false,
        twitterDescription: false });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';

    const title = watch('title');
    const content = watch('content');
    const mainImage = watch('mainImage');
    const seoTitleValue = watch('seo.title');
    const seoDescriptionValue = watch('seo.description');
    const ogTitleValue = watch('seo.ogTitle');
    const ogDescriptionValue = watch('seo.ogDescription');
    const ogImageValue = watch('seo.ogImage');
    const twitterTitleValue = watch('seo.twitterTitle');
    const twitterDescriptionValue = watch('seo.twitterDescription');

    const getPlainText = html => {
        if (!html) return '';
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    };

    useEffect(() => {
        const plainContent = getPlainText(content);
        const contentPreview = plainContent.substring(0, 160).trim();

        if (title && !userEdited.seoTitle) {
            setValue('seo.title', title, {
                shouldValidate: false,
                shouldDirty: false });
        }

        if (plainContent && !userEdited.seoDescription) {
            setValue('seo.description', contentPreview, {
                shouldValidate: false,
                shouldDirty: false });
        }

        if (title && !userEdited.ogTitle) {
            setValue('seo.ogTitle', title, {
                shouldValidate: false,
                shouldDirty: false });
        }

        if (plainContent && !userEdited.ogDescription) {
            setValue('seo.ogDescription', contentPreview, {
                shouldValidate: false,
                shouldDirty: false });
        }

        if (title && !userEdited.twitterTitle) {
            setValue('seo.twitterTitle', title, {
                shouldValidate: false,
                shouldDirty: false });
        }

        if (plainContent && !userEdited.twitterDescription) {
            setValue('seo.twitterDescription', contentPreview, {
                shouldValidate: false,
                shouldDirty: false });
        }

        if (mainImage && !ogImageValue) {
            setValue('seo.ogImage', mainImage, {
                shouldValidate: false,
                shouldDirty: false });
        }
    }, [title, content, mainImage, userEdited, setValue, ogImageValue]);

    const toggleSection = section => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section] }));
    };

    const getPreviewValue = (primary, fallback1, fallback2 = '') => {
        return primary || fallback1 || fallback2;
    };

    const plainContent = getPlainText(content);
    const contentPreview = plainContent.substring(0, 160).trim();

    const seoTitle = getPreviewValue(
        seoTitleValue,
        title,
        'Your SEO Title Will Appear Here'
    );
    const seoDescription = getPreviewValue(
        seoDescriptionValue,
        contentPreview,
        'Your meta description will appear here.'
    );
    const ogTitle = getPreviewValue(ogTitleValue, seoTitleValue, title);
    const ogDescription = getPreviewValue(
        ogDescriptionValue,
        seoDescriptionValue,
        contentPreview
    );
    const ogImage = ogImageValue || mainImage;
    const twitterTitle = getPreviewValue(
        twitterTitleValue,
        ogTitleValue,
        seoTitleValue
    );
    const twitterDescription = getPreviewValue(
        twitterDescriptionValue,
        ogDescriptionValue,
        seoDescriptionValue
    );

    return (
        <CollapsibleSection
            title='SEO Configuration'
            isOpen={openSections.main}
            onToggle={() => toggleSection('main')}>
            <div className='flex justify-end'>
                <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => setShowPreview(!showPreview)}
                    className='h-9 border-input bg-background hover:bg-accent hover:text-accent-foreground font-semibold transition-all duration-200'>
                    {showPreview ? (
                        <span className='text-sm flex items-center gap-2'>
                            <HugeiconsIcon
                                icon={ViewOffIcon}
                                className='w-4 h-4'
                            />
                            Hide Preview
                        </span>
                    ) : (
                        <span className='text-sm flex items-center gap-2'>
                            <HugeiconsIcon icon={EyeIcon} className='w-4 h-4' />
                            Show Preview
                        </span>
                    )}
                </Button>
            </div>
            <div className='space-y-6'>
                {/* Basic SEO Section */}
                <CollapsibleSection
                    title='Basic SEO'
                    isOpen={openSections.basic}
                    onToggle={() => toggleSection('basic')}>
                    <FormField
                        control={control}
                        name='seo.title'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm font-semibold text-foreground'>
                                    SEO Title{' '}
                                    <span className='text-destructive'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='e.g. Explore Bali – 5 Day Luxury Adventure Tour'
                                        {...field}
                                        onChange={e => {
                                            setUserEdited(prev => ({
                                                ...prev,
                                                seoTitle: true }));
                                            field.onChange(e.target.value);
                                        }}
                                        maxLength={60}
                                        className='h-10 border-input bg-background focus:ring-2 focus:ring-ring'
                                    />
                                </FormControl>
                                <FormDescription className='text-xs font-medium text-muted-foreground'>
                                    {field.value?.length || 0}/60 characters.
                                    Optimal length: 50-60 characters
                                </FormDescription>
                                <FormMessage className='text-xs font-medium' />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name='seo.description'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm font-semibold text-foreground'>
                                    Meta Description{' '}
                                    <span className='text-destructive'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="e.g. Experience Bali's waterfalls and beaches in a 5-day guided luxury tour."
                                        className='resize-none h-24 border-input bg-background focus:ring-2 focus:ring-ring'
                                        {...field}
                                        onChange={e => {
                                            setUserEdited(prev => ({
                                                ...prev,
                                                seoDescription: true }));
                                            field.onChange(e.target.value);
                                        }}
                                        maxLength={160}
                                    />
                                </FormControl>
                                <FormDescription className='text-xs font-medium text-muted-foreground'>
                                    {field.value?.length || 0}/160 characters.
                                    Optimal length: 150-160 characters
                                </FormDescription>
                                <FormMessage className='text-xs font-medium' />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name='seo.focusKeyword'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm font-semibold text-foreground'>
                                    Focus Keyword
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='e.g. Bali luxury tour'
                                        {...field}
                                        className='h-10 border-input bg-background focus:ring-2 focus:ring-ring'
                                    />
                                </FormControl>
                                <FormDescription className='text-xs font-medium text-muted-foreground'>
                                    Primary keyword to target for this blog post
                                </FormDescription>
                                <FormMessage className='text-xs font-medium' />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name='seo.canonical'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm font-semibold text-foreground'>
                                    Canonical URL
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type='url'
                                        placeholder={`e.g. ${baseUrl}/trips/bali-luxury-adventure`}
                                        {...field}
                                        className='h-10 border-input bg-background focus:ring-2 focus:ring-ring'
                                    />
                                </FormControl>
                                <FormDescription className='text-xs font-medium text-muted-foreground'>
                                    The preferred URL for this page (prevents
                                    duplicate content issues)
                                </FormDescription>
                                <FormMessage className='text-xs font-medium' />
                            </FormItem>
                        )}
                    />
                </CollapsibleSection>

                {/* Social Media Section */}
                <CollapsibleSection
                    title='Social Media'
                    isOpen={openSections.social}
                    onToggle={() => toggleSection('social')}>
                    <div className='space-y-6'>
                        <div>
                            <h4 className='text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2'>
                                <HugeiconsIcon
                                    icon={Facebook01Icon}
                                    className='w-4 h-4 text-primary'
                                />
                                Open Graph (Facebook, LinkedIn)
                            </h4>

                            <div className='space-y-6'>
                                <FormField
                                    control={control}
                                    name='seo.ogTitle'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-sm font-semibold text-foreground'>
                                                OG Title
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='e.g. Your Bali Dream Vacation Awaits 🌴'
                                                    {...field}
                                                    onChange={e => {
                                                        setUserEdited(prev => ({
                                                            ...prev,
                                                            ogTitle: true }));
                                                        field.onChange(
                                                            e.target.value
                                                        );
                                                    }}
                                                    className='h-10 border-input bg-background focus:ring-2 focus:ring-ring'
                                                />
                                            </FormControl>
                                            <FormDescription className='text-xs font-medium text-muted-foreground'>
                                                Title shown when shared on
                                                Facebook, LinkedIn, etc.
                                            </FormDescription>
                                            <FormMessage className='text-xs font-medium' />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name='seo.ogDescription'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-sm font-semibold text-foreground'>
                                                OG Description
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder='e.g. Join us for a 5-day Bali tour packed with luxury stays and cultural experiences.'
                                                    className='resize-none h-20 border-input bg-background focus:ring-2 focus:ring-ring'
                                                    {...field}
                                                    onChange={e => {
                                                        setUserEdited(prev => ({
                                                            ...prev,
                                                            ogDescription: true }));
                                                        field.onChange(
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage className='text-xs font-medium' />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name='seo.ogImage'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-sm font-semibold text-foreground'>
                                                OG Image
                                            </FormLabel>
                                            <FormControl>
                                                <div className='rounded-lg border border-input overflow-hidden bg-muted/5 hover:bg-muted/10 transition-colors duration-200'>
                                                    <ImageUploadWithSelector
                                                        fieldName='seo.ogImage'
                                                        onChange={
                                                            field.onChange
                                                        }
                                                        multiple={false}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription className='text-xs font-medium text-muted-foreground'>
                                                Image shown when shared on
                                                social media (recommended:
                                                1200x630px)
                                            </FormDescription>
                                            <FormMessage className='text-xs font-medium' />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='pt-6 border-t border-border/50'>
                            <h4 className='text-sm font-semibold text-muted-foreground mb-4'>
                                Twitter/X
                            </h4>

                            <div className='space-y-6'>
                                <FormField
                                    control={control}
                                    name='seo.twitterTitle'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-sm font-semibold text-foreground'>
                                                Twitter Title
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. Uncover Bali's Hidden Paradise ✈️"
                                                    {...field}
                                                    onChange={e => {
                                                        setUserEdited(prev => ({
                                                            ...prev,
                                                            twitterTitle: true }));
                                                        field.onChange(
                                                            e.target.value
                                                        );
                                                    }}
                                                    className='h-10 border-input bg-background focus:ring-2 focus:ring-ring'
                                                />
                                            </FormControl>
                                            <FormMessage className='text-xs font-medium' />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name='seo.twitterDescription'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-sm font-semibold text-foreground'>
                                                Twitter Description
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder='e.g. Luxury trip package with private villas and local tours.'
                                                    className='resize-none h-20 border-input bg-background focus:ring-2 focus:ring-ring'
                                                    {...field}
                                                    onChange={e => {
                                                        setUserEdited(prev => ({
                                                            ...prev,
                                                            twitterDescription: true }));
                                                        field.onChange(
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage className='text-xs font-medium' />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name='seo.twitterCard'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-sm font-semibold text-foreground'>
                                                Twitter Card Type
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className='h-10 border-input bg-background focus:ring-2 focus:ring-ring'>
                                                        <SelectValue placeholder='Select card type' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value='summary'>
                                                        Summary
                                                    </SelectItem>
                                                    <SelectItem value='summary_large_image'>
                                                        Summary Large Image
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription className='text-xs font-medium text-muted-foreground'>
                                                How the card appears on
                                                Twitter/X
                                            </FormDescription>
                                            <FormMessage className='text-xs font-medium' />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* Advanced Settings Section */}
                <CollapsibleSection
                    title='Advanced Settings'
                    isOpen={openSections.advanced}
                    onToggle={() => toggleSection('advanced')}>
                    <FormField
                        control={control}
                        name='seo.robots'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm font-semibold text-foreground'>
                                    Robots Meta Tag
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className='h-10 border-input bg-background focus:ring-2 focus:ring-ring'>
                                            <SelectValue placeholder='Select robots directive' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value='index, follow'>
                                            Index, Follow (Default)
                                        </SelectItem>
                                        <SelectItem value='noindex, follow'>
                                            No Index, Follow
                                        </SelectItem>
                                        <SelectItem value='index, nofollow'>
                                            Index, No Follow
                                        </SelectItem>
                                        <SelectItem value='noindex, nofollow'>
                                            No Index, No Follow
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription className='text-xs font-medium text-muted-foreground'>
                                    Controls how search engines crawl and index
                                    this page
                                </FormDescription>
                                <FormMessage className='text-xs font-medium' />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name='seo.schemaType'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm font-semibold text-foreground'>
                                    Schema Type
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className='h-10 border-input bg-background focus:ring-2 focus:ring-ring'>
                                            <SelectValue placeholder='Select schema type' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value='Article'>
                                            Article
                                        </SelectItem>
                                        <SelectItem value='TouristTrip'>
                                            Tourist Trip
                                        </SelectItem>
                                        <SelectItem value='Product'>
                                            Product
                                        </SelectItem>
                                        <SelectItem value='Event'>
                                            Event
                                        </SelectItem>
                                        <SelectItem value='Offer'>
                                            Offer
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription className='text-xs font-medium text-muted-foreground'>
                                    Structured data type for rich search results
                                </FormDescription>
                                <FormMessage className='text-xs font-medium' />
                            </FormItem>
                        )}
                    />
                </CollapsibleSection>

                {/* Preview Section */}
                <AnimatePresence>
                    {showPreview && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}>
                            <Card className='shadow-sm border-border bg-card'>
                                <CardHeader className='border-b border-border bg-muted/20 px-6 py-4'>
                                    <CardTitle className='text-base font-semibold text-foreground'>
                                        SEO Preview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className='p-6'>
                                    <Tabs
                                        defaultValue='search'
                                        className='w-full'>
                                        <TabsList className='flex justify-start w-fit items-start bg-muted/30 border border-border'>
                                            <TabsTrigger
                                                className='text-sm font-semibold flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm'
                                                value='search'>
                                                <HugeiconsIcon
                                                    icon={Search01Icon}
                                                    className='w-4 h-4'
                                                />
                                                Search
                                            </TabsTrigger>
                                            <TabsTrigger
                                                className='text-sm font-semibold flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm'
                                                value='facebook'>
                                                <HugeiconsIcon
                                                    icon={Facebook01Icon}
                                                    className='w-4 h-4'
                                                />
                                                Facebook
                                            </TabsTrigger>
                                            <TabsTrigger
                                                className='text-sm font-semibold flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm'
                                                value='twitter'>
                                                𝕏 Twitter
                                            </TabsTrigger>
                                        </TabsList>

                                        <TabsContent
                                            value='search'
                                            className='space-y-4 mt-6'>
                                            <div className='border border-border rounded-lg p-5 bg-card shadow-sm'>
                                                <div className='text-xs text-muted-foreground mb-1.5 font-medium'>
                                                    {`${baseUrl}/trips/converted-slug-of-trip-title`}
                                                </div>
                                                <div className='text-lg text-primary mb-2 hover:underline cursor-pointer font-semibold'>
                                                    {seoTitle}
                                                </div>
                                                <div className='text-sm text-foreground/80 font-medium leading-relaxed'>
                                                    {seoDescription}
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent
                                            value='facebook'
                                            className='space-y-4 mt-6'>
                                            <div className='border border-border/50 rounded-lg overflow-hidden bg-card max-w-xl shadow-md'>
                                                {ogImage && (
                                                    <div className='w-full h-48 relative bg-muted flex items-center justify-center'>
                                                        <Image
                                                            fill
                                                            src={ogImage?.url}
                                                            alt='OG Preview'
                                                            className='object-cover'
                                                        />
                                                    </div>
                                                )}
                                                <div className='p-4 bg-card'>
                                                    <div className='text-xs text-muted-foreground uppercase mb-1 font-semibold tracking-wide'>
                                                        yourdomain.com
                                                    </div>
                                                    <div className='text-base font-bold text-foreground mb-1'>
                                                        {ogTitle ||
                                                            'Your Open Graph Title'}
                                                    </div>
                                                    <div className='text-sm text-foreground/70 font-medium'>
                                                        {ogDescription ||
                                                            'Your Open Graph description will appear here.'}
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent
                                            value='twitter'
                                            className='space-y-4 mt-6'>
                                            <div className='border border-border/50 rounded-lg overflow-hidden bg-card max-w-xl shadow-md'>
                                                {ogImage && (
                                                    <div className='w-full h-64 relative bg-muted flex items-center justify-center'>
                                                        <Image
                                                            fill
                                                            src={ogImage?.url}
                                                            alt='Twitter Preview'
                                                            className='object-cover'
                                                        />
                                                    </div>
                                                )}
                                                <div className='p-4 bg-card'>
                                                    <div className='text-base font-bold text-foreground mb-1'>
                                                        {twitterTitle ||
                                                            'Your Twitter Title'}
                                                    </div>
                                                    <div className='text-sm text-foreground/70 mb-2 font-medium'>
                                                        {twitterDescription ||
                                                            'Your Twitter description will appear here.'}
                                                    </div>
                                                    <div className='text-xs text-muted-foreground font-semibold'>
                                                        yourdomain.com
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </CollapsibleSection>
    );
}

