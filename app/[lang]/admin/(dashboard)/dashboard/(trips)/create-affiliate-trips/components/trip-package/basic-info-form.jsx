import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Textarea } from '@/components/ui/textarea';
import { tripPackageOptions } from '@/data/trip-options';
import { ArrowDown01Icon, ArrowUp01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import useCategoryTypesData from '../../../../../../../../../hooks/use-category-types-data';
import GenerateImage from '../../../../components/common/generate-image';
import { ImageUploadWithSelector } from '../../../../components/common/image-upload-selector';
import { CATEGORY_TYPES } from '../../../categories/constants/category-types';
import { TourOperatorSelectField } from './affiliate-select-field';
import { DestinationSelectField } from './destination-select-field';
import { TourTypeForm } from './tour-type-form';
import { TripActivities } from './trip-activities';

// Destination Field Component
const DestinationField = ({
    control,
    fieldName = 'destinationId',
    label = 'Destination',
    required = true,
    destinations = [],
    loading = false,
}) => {
    return (
        <FormField
            control={control}
            name={fieldName}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        {label}
                        {required && (
                            <span className='text-destructive'>*</span>
                        )}
                    </FormLabel>
                    <FormControl>
                        <DestinationSelectField
                            onValueChange={field.onChange}
                            value={field.value}
                            destinations={destinations}
                            loading={loading}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

const TourOperatorField = ({
    control,
    tourOperators = [],
    loading = false,
}) => {
    return (
        <FormField
            control={control}
            name='affiliateId'
            render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        Tour Partner{' '}
                        <span className='text-destructive'>*</span>{' '}
                    </FormLabel>
                    <FormControl>
                        <TourOperatorSelectField
                            onValueChange={field.onChange}
                            value={field.value}
                            tourOperators={tourOperators}
                            loading={loading}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export { DestinationField };

export function BasicInfoForm({
    destinations,
    tourOperators,
    isFetchingOptions,
    tenant,
}) {
    const { control } = useFormContext();
    const [isOpen, setIsOpen] = useState(true);
    // Get Currency Data
    const defaultCurrencies = tripPackageOptions.currencies;
    const { isLoading, data, error } = useCategoryTypesData(
        CATEGORY_TYPES.CURRENCY
    );

    return (
        <div className='space-y-2'>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <Card className='p-0 '>
                    <CollapsibleTrigger
                        className=' px-5 py-8 w-full cursor-pointer hover:bg-muted/50 transition-colors'
                        asChild>
                        <div className='flex justify-between items-center'>
                            <CardTitle>Basic Package Information</CardTitle>
                            {isOpen ? (
                                <HugeiconsIcon
                                    icon={ArrowUp01Icon}
                                    className='h-4 w-4 text-muted-foreground'
                                />
                            ) : (
                                <HugeiconsIcon
                                    icon={ArrowDown01Icon}
                                    className='h-4 w-4 text-muted-foreground'
                                />
                            )}
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <CardContent className='space-y-6 pb-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <FormField
                                    control={control}
                                    name='title'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Package Title{' '}
                                                <span className='text-destructive'>
                                                    *
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='e.g. Amazing Thailand Adventure'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <DestinationField
                                    control={control}
                                    destinations={destinations}
                                    loading={isFetchingOptions}
                                />
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <FormField
                                    control={control}
                                    name='duration'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Duration</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='text'
                                                    placeholder='e.g. 9.5 Hours'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <TourOperatorField
                                    control={control}
                                    tourOperators={tourOperators}
                                    loading={isFetchingOptions}
                                />
                            </div>

                            <FormField
                                control={control}
                                name='shortDescription'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Short Description{' '}
                                            <span className='text-destructive'>
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder='Brief, catchy description (max 150 chars)'
                                                className='resize-none h-24'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            A brief description used in search
                                            results and lists.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name='fullDescription'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Full Description{' '}
                                            <span className='text-destructive'>
                                                *
                                            </span>
                                        </FormLabel>
                                        <FormControl>
                                            <RichTextEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder='Write a comprehansive details of your package'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name='mainImage'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center justify-between w-full'>
                                            <span>
                                                Main Image{' '}
                                                <span className='text-destructive'>
                                                    *
                                                </span>
                                            </span>
                                            <GenerateImage
                                                onImageSelected={field.onChange}
                                            />
                                        </FormLabel>
                                        <FormControl>
                                            <ImageUploadWithSelector
                                                fieldName='mainImage'
                                                onChange={field.onChange}
                                                multiple={false}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Upload the main featured image for
                                            the trip package.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name='galleryImages'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center justify-between w-full'>
                                            <span>Gallery Images</span>
                                            <GenerateImage
                                                onImageSelected={field.onChange}
                                                multiple={true}
                                                currentImages={field.value}
                                            />
                                        </FormLabel>
                                        <FormControl>
                                            <ImageUploadWithSelector
                                                fieldName='galleryImages'
                                                onChange={field.onChange}
                                                multiple={true}
                                                maxFiles={10}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Upload up to 10 additional images
                                            for the gallery (optional).
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </CollapsibleContent>
                </Card>
            </Collapsible>

            <TourTypeForm />
            <TripActivities />
        </div>
    );
}

