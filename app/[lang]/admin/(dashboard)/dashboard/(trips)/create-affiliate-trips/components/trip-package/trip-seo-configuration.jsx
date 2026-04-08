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
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowDown01Icon,
    ArrowUp01Icon,
    Facebook02Icon,
    NewTwitterIcon,
    Search01Icon,
    ViewIcon,
    ViewOffIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ImageUploadWithSelector } from '../../../../components/common/image-upload-selector';

const CollapsibleSection = ({ title, isOpen, onToggle, children }) => {
    return (
        <div className='border border-border rounded-lg overflow-hidden'>
            <button
                type='button'
                onClick={onToggle}
                className='w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted transition-colors'>
                <h3 className='text-sm font-semibold'>{title}</h3>
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
                        <div className='p-6 space-y-6 bg-background'>
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export function TripSeoForm() {
    const { control, watch, setValue } = useFormContext();
    const [showPreview, setShowPreview] = useState(true);
    const [openSections, setOpenSections] = useState({
        basic: true,
        social: false,
        advanced: false });
    const [userEdited, setUserEdited] = useState({
        seoTitle: false,
        seoDescription: false,
        ogTitle: false,
        ogDescription: false,
        twitterTitle: false,
        twitterDescription: false,
        twitterCard: false,
        ogImage: false,
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';

    // Watch form values
    const title = watch('title');
    const shortDescription = watch('shortDescription');
    const mainImage = watch('mainImage');
    const seoTitleValue = watch('seo.title');
    const seoDescriptionValue = watch('seo.description');
    const ogTitleValue = watch('seo.ogTitle');
    const ogDescriptionValue = watch('seo.ogDescription');
    const ogImageValue = watch('seo.ogImage');
    const twitterTitleValue = watch('seo.twitterTitle');
    const twitterDescriptionValue = watch('seo.twitterDescription');
    const twitterCard = watch('seo.twitterCard');

    // Preview values (with fallbacks)
    const seoTitle = seoTitleValue || title || '';
    const seoDescription = seoDescriptionValue || shortDescription || '';
    const ogTitle = ogTitleValue || title || '';
    const ogDescription = ogDescriptionValue || shortDescription || '';
    const ogImage = ogImageValue || mainImage || '';
    const twitterTitle = twitterTitleValue || title || '';
    const twitterDescription =
        twitterDescriptionValue || shortDescription || '';

    const seoTwitterCard = twitterCard || 'summary_large_image';

    // Auto-populate SEO fields with fallback values when empty
    useEffect(() => {
        // Only auto-populate if user hasn't manually edited the field
        // AND the field is currently empty or undefined
        if (title && !userEdited.seoTitle && !seoTitleValue) {
            setValue('seo.title', title, { shouldValidate: false });
        }

        if (
            shortDescription &&
            !userEdited.seoDescription &&
            !seoDescriptionValue
        ) {
            setValue('seo.description', shortDescription, {
                shouldValidate: false });
        }

        if (title && !userEdited.ogTitle && !ogTitleValue) {
            setValue('seo.ogTitle', title, { shouldValidate: false });
        }

        if (
            shortDescription &&
            !userEdited.ogDescription &&
            !ogDescriptionValue
        ) {
            setValue('seo.ogDescription', shortDescription, {
                shouldValidate: false });
        }

        if (title && !userEdited.twitterTitle && !twitterTitleValue) {
            setValue('seo.twitterTitle', title, { shouldValidate: false });
        }
        if (twitterCard && !userEdited.twitterCard && !seoTwitterCard) {
            setValue('seo.twitterCard', twitterCard, { shouldValidate: false });
        }

        if (
            shortDescription &&
            !userEdited.twitterDescription &&
            !twitterDescriptionValue
        ) {
            setValue('seo.twitterDescription', shortDescription, {
                shouldValidate: false });
        }

        // Handle OG image auto-population only if user hasn't manually edited it
        if (mainImage && !userEdited.ogImage && !ogImageValue) {
            setValue('seo.ogImage', mainImage, { shouldValidate: false });
        }
    }, [
        mainImage,
        ogDescriptionValue,
        ogImageValue,
        ogTitleValue,
        seoDescriptionValue,
        seoTitleValue,
        seoTwitterCard,
        setValue,
        shortDescription,
        title,
        twitterCard,
        twitterDescriptionValue,
        twitterTitleValue,
        userEdited.ogDescription,
        userEdited.ogImage,
        userEdited.ogTitle,
        userEdited.seoDescription,
        userEdited.seoTitle,
        userEdited.twitterCard,
        userEdited.twitterDescription,
        userEdited.twitterTitle,
    ]);

    const toggleSection = section => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section] }));
    };

    return (
        <div className='space-y-6'>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between'>
                    <CardTitle>SEO Configuration</CardTitle>
                    <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => setShowPreview(!showPreview)}>
                        {showPreview ? (
                            <>
                                <HugeiconsIcon
                                    icon={ViewOffIcon}
                                    className='w-4 h-4 mr-2'
                                />
                                Hide Preview
                            </>
                        ) : (
                            <>
                                <HugeiconsIcon
                                    icon={ViewIcon}
                                    className='w-4 h-4 mr-2'
                                />
                                Show Preview
                            </>
                        )}
                    </Button>
                </CardHeader>
                <CardContent className='space-y-4'>
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
                                    <FormLabel>
                                        SEO Title{' '}
                                        <span className='text-destructive'>
                                            *
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='e.g. Explore Bali – 5 Day Luxury Adventure Tour'
                                            {...field}
                                            value={
                                                field.value ||
                                                (!userEdited.seoTitle
                                                    ? title
                                                    : '') ||
                                                ''
                                            }
                                            onChange={e => {
                                                setUserEdited(prev => ({
                                                    ...prev,
                                                    seoTitle: true }));
                                                field.onChange(e.target.value);
                                            }}
                                            maxLength={60}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {field.value?.length || 0}/60
                                        characters. Optimal length: 50-60
                                        characters
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name='seo.description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Meta Description{' '}
                                        <span className='text-destructive'>
                                            *
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="e.g. Experience Bali's waterfalls and beaches in a 5-day guided luxury tour."
                                            className='resize-none h-24'
                                            {...field}
                                            value={
                                                field.value ||
                                                (!userEdited.seoDescription
                                                    ? shortDescription
                                                    : '') ||
                                                ''
                                            }
                                            onChange={e => {
                                                setUserEdited(prev => ({
                                                    ...prev,
                                                    seoDescription: true }));
                                                field.onChange(e.target.value);
                                            }}
                                            maxLength={160}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {field.value?.length || 0}/160
                                        characters. Optimal length: 150-160
                                        characters
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name='seo.focusKeyword'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Focus Keyword</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='e.g. Bali luxury tour'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Primary keyword to target for this trip
                                        package
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name='seo.canonical'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Canonical URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='url'
                                            placeholder={`e.g. ${appUrl}/trips/bali-luxury-adventure`}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The preferred URL for this page
                                        (prevents duplicate content issues)
                                    </FormDescription>
                                    <FormMessage />
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
                                <h4 className='text-sm font-medium text-muted-foreground mb-4'>
                                    Open Graph (Facebook, LinkedIn)
                                </h4>

                                <div className='space-y-6'>
                                    <FormField
                                        control={control}
                                        name='seo.ogTitle'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>OG Title</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder='e.g. Your Bali Dream Vacation Awaits 🌴'
                                                        {...field}
                                                        value={
                                                            field.value ||
                                                            (!userEdited.ogTitle
                                                                ? title
                                                                : '') ||
                                                            ''
                                                        }
                                                        onChange={e => {
                                                            setUserEdited(
                                                                prev => ({
                                                                    ...prev,
                                                                    ogTitle: true })
                                                            );
                                                            field.onChange(
                                                                e.target.value
                                                            );
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Title shown when shared on
                                                    Facebook, LinkedIn, etc.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name='seo.ogDescription'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    OG Description
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder='e.g. Join us for a 5-day Bali tour packed with luxury stays and cultural experiences.'
                                                        className='resize-none h-20'
                                                        {...field}
                                                        value={
                                                            field.value ||
                                                            (!userEdited.ogDescription
                                                                ? shortDescription
                                                                : '') ||
                                                            ''
                                                        }
                                                        onChange={e => {
                                                            setUserEdited(
                                                                prev => ({
                                                                    ...prev,
                                                                    ogDescription: true })
                                                            );
                                                            field.onChange(
                                                                e.target.value
                                                            );
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name='seo.ogImage'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>OG Image</FormLabel>
                                                <FormControl>
                                                    <ImageUploadWithSelector
                                                        fieldName='seo.ogImage'
                                                        onChange={val => {
                                                            setUserEdited(
                                                                prev => ({
                                                                    ...prev,
                                                                    ogImage: true })
                                                            );
                                                            field.onChange(val);
                                                        }}
                                                        multiple={false}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Image shown when shared on
                                                    social media (recommended:
                                                    1200x630px)
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className='pt-6 border-t'>
                                <h4 className='text-sm font-medium text-muted-foreground mb-4'>
                                    Twitter/X
                                </h4>

                                <div className='space-y-6'>
                                    <FormField
                                        control={control}
                                        name='seo.twitterTitle'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Twitter Title
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. Uncover Bali's Hidden Paradise ✈️"
                                                        {...field}
                                                        value={
                                                            field.value ||
                                                            (!userEdited.twitterTitle
                                                                ? title
                                                                : '') ||
                                                            ''
                                                        }
                                                        onChange={e => {
                                                            setUserEdited(
                                                                prev => ({
                                                                    ...prev,
                                                                    twitterTitle: true })
                                                            );
                                                            field.onChange(
                                                                e.target.value
                                                            );
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name='seo.twitterDescription'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Twitter Description
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder='e.g. Luxury trip package with private villas and local tours.'
                                                        className='resize-none h-20'
                                                        {...field}
                                                        value={
                                                            field.value ||
                                                            (!userEdited.twitterDescription
                                                                ? shortDescription
                                                                : '') ||
                                                            ''
                                                        }
                                                        onChange={e => {
                                                            setUserEdited(
                                                                prev => ({
                                                                    ...prev,
                                                                    twitterDescription: true })
                                                            );
                                                            field.onChange(
                                                                e.target.value
                                                            );
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name='seo.twitterCard'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Twitter Card Type
                                                </FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
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
                                                <FormDescription>
                                                    How the card appears on
                                                    Twitter/X
                                                </FormDescription>
                                                <FormMessage />
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
                                    <FormLabel>Robots Meta Tag</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
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
                                    <FormDescription>
                                        Controls how search engines crawl and
                                        index this page
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name='seo.schemaType'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Schema Type</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select schema type' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
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
                                    <FormDescription>
                                        Structured data type for rich search
                                        results
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <FormField
                                control={control}
                                name='seo.sitemapPriority'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sitemap Priority</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ''} // ensure string
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select priority' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='1.0'>
                                                    1.0 (Highest)
                                                </SelectItem>
                                                <SelectItem value='0.9'>
                                                    0.9
                                                </SelectItem>
                                                <SelectItem value='0.8'>
                                                    0.8
                                                </SelectItem>
                                                <SelectItem value='0.7'>
                                                    0.7
                                                </SelectItem>
                                                <SelectItem value='0.6'>
                                                    0.6
                                                </SelectItem>
                                                <SelectItem value='0.5'>
                                                    0.5 (Medium)
                                                </SelectItem>
                                                <SelectItem value='0.4'>
                                                    0.4
                                                </SelectItem>
                                                <SelectItem value='0.3'>
                                                    0.3
                                                </SelectItem>
                                                <SelectItem value='0.2'>
                                                    0.2
                                                </SelectItem>
                                                <SelectItem value='0.1'>
                                                    0.1 (Lowest)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <FormDescription>
                                            Relative importance in sitemap
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name='seo.changeFrequency'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Change Frequency</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select frequency' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='always'>
                                                    Always
                                                </SelectItem>
                                                <SelectItem value='hourly'>
                                                    Hourly
                                                </SelectItem>
                                                <SelectItem value='daily'>
                                                    Daily
                                                </SelectItem>
                                                <SelectItem value='weekly'>
                                                    Weekly
                                                </SelectItem>
                                                <SelectItem value='monthly'>
                                                    Monthly
                                                </SelectItem>
                                                <SelectItem value='yearly'>
                                                    Yearly
                                                </SelectItem>
                                                <SelectItem value='never'>
                                                    Never
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            How often content changes
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CollapsibleSection>
                </CardContent>
            </Card>

            {/* Preview Section */}
            <AnimatePresence>
                {showPreview && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}>
                        <Card>
                            <CardHeader>
                                <CardTitle className='text-sm'>
                                    SEO Preview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue='search' className='w-full'>
                                    <TabsList className='flex justify-start w-fit items-start'>
                                        <TabsTrigger
                                            className='text-sm flex justify-center items-center'
                                            value='search'>
                                            <HugeiconsIcon
                                                icon={Search01Icon}
                                                className='w-4 h-4 mr-2'
                                            />
                                            Search
                                        </TabsTrigger>
                                        <TabsTrigger
                                            className='text-sm flex justify-center items-center'
                                            value='facebook'>
                                            <HugeiconsIcon
                                                icon={Facebook02Icon}
                                                className='w-4 h-4 mr-2'
                                            />
                                            Facebook
                                        </TabsTrigger>
                                        <TabsTrigger
                                            className='text-sm flex justify-center items-center'
                                            value='twitter'>
                                            <HugeiconsIcon
                                                icon={NewTwitterIcon}
                                                className='w-4 h-4 mr-2'
                                            />
                                            Twitter
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent
                                        value='search'
                                        className='space-y-4'>
                                        <div className='border border-border rounded-lg p-4 bg-card'>
                                            <div className='text-xs text-muted-foreground mb-1'>
                                                {` ${appUrl}/trips/converted-slug-of-trip-title`}
                                            </div>
                                            <div className='text-md text-primary mb-1 hover:underline cursor-pointer'>
                                                {seoTitle ||
                                                    'Your SEO Title Will Appear Here'}
                                            </div>
                                            <div className='text-sm text-muted-foreground'>
                                                {seoDescription ||
                                                    'Your meta description will appear here. Make it compelling to increase click-through rates from search results.'}
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent
                                        value='facebook'
                                        className='space-y-4'>
                                        <div className='border border-border rounded-lg overflow-hidden bg-card max-w-xl'>
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
                                            <div className='p-4'>
                                                <div className='text-xs text-muted-foreground uppercase mb-1'>
                                                    yourdomain.com
                                                </div>
                                                <div className='text-sm font-semibold text-foreground mb-1'>
                                                    {ogTitle ||
                                                        seoTitle ||
                                                        'Your Open Graph Title'}
                                                </div>
                                                <div className='text-sm text-muted-foreground'>
                                                    {ogDescription ||
                                                        seoDescription ||
                                                        'Your Open Graph description will appear here.'}
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent
                                        value='twitter'
                                        className='space-y-4'>
                                        <div className='border border-border rounded-lg overflow-hidden bg-card max-w-xl'>
                                            {ogImage && (
                                                <div className='w-full h-64 relative bg-muted flex items-center justify-center'>
                                                    <Image
                                                        fill
                                                        src={ogImage?.url}
                                                        alt='Twitter Preview'
                                                        className=' object-cover'
                                                    />
                                                </div>
                                            )}
                                            <div className='p-4'>
                                                <div className='text-base font-semibold text-foreground mb-1'>
                                                    {twitterTitle ||
                                                        ogTitle ||
                                                        seoTitle ||
                                                        'Your Twitter Title'}
                                                </div>
                                                <div className='text-sm text-muted-foreground mb-2'>
                                                    {twitterDescription ||
                                                        ogDescription ||
                                                        seoDescription ||
                                                        'Your Twitter description will appear here.'}
                                                </div>
                                                <div className='text-xs text-muted-foreground'>
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
    );
}

