'use client';
import { tripPackageFormSchema } from '@/utils/validations/affiliate-trip-package';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { defaultFormValues } from './constants/default-values';

// Import constants
import { fieldToTabMapping } from './constants/field-mappings';
import { formSections } from './constants/form-sections';

// Import hooks
import { getAllPartners } from '@/app/_actions/partnerActions';
import {
    createTrip,
    getTripById,
    updateTrip,
} from '@/app/_actions/trips/affiliateTripsAction';
import { getAllDestinations } from '@/app/_actions/trips/destinations';
import { Button } from '@/components/ui/button';
import { formatDateForInput } from '@/utils/form-helpers';
import {
    FloppyDiskIcon,
    Loading03Icon,
    Tick01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useFormPersistence } from '../../../../../../../../../hooks/use-form-persistance';
import { useFormValidation } from '../../../../../../../../../hooks/use-form-validations';
import { FormNavigation } from '../../../../components/common/form-navigations';
import GenerateWithAiButton from '../../../../components/generate-with-ai-button';
import { FormContent } from './form-content';

export function CreateTripPackageForm({ userId }) {
    // Component state - ALWAYS start with 'basic' tab
    const [activeTab, setActiveTab] = useState('basic');
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [dataToEdit, setDataToEdit] = useState(null);
    const [destinations, setDestinations] = useState([]);
    const [tourOperators, setTourOperators] = useState([]);
    const [isFetchingOptions, setIsFetchingOptions] = useState(false);
    const router = useRouter();
    const params = useSearchParams();
    const tripId = params.get('id');
    const mode = params.get('mode');
    const formSectionsWithOutSEO = formSections.filter(
        section => section.id !== 'seo'
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps

    // Fetch destinations and tour operators
    useEffect(() => {
        const fetchOptions = async () => {
            setIsFetchingOptions(true);
            try {
                const [destRes, affiliateRes] = await Promise.all([
                    getAllDestinations(),
                    getAllPartners(),
                ]);

                if (destRes?.success) {
                    console.log('destRes', destRes);
                    setDestinations(destRes.result?.data || []);
                }

                if (affiliateRes?.success) {
                    setTourOperators(affiliateRes.result?.data || []);
                }
            } catch (error) {
                console.error('Error fetching options:', error);
                toast.error('Failed to load form options');
            } finally {
                setIsFetchingOptions(false);
            }
        };

        fetchOptions();
    }, []);

    // Initialize form with react-hook-form
    const methods = useForm({
        resolver: zodResolver(tripPackageFormSchema),
        defaultValues: defaultFormValues,
        mode: 'onChange',
        reValidateMode: 'onChange',
        criteriaMode: 'all', // Show all validation criteria
        shouldFocusError: true,
    });

    // Load active tab - MODIFIED to ensure basic tab is always initial
    useEffect(() => {
        // Only load saved tab if not in update mode AND we're not on the first load
        if (mode !== 'update') {
            const savedTab = localStorage.getItem('activeTab');
            // Only restore saved tab if it exists and it's not the first time loading
            if (savedTab && activeTab !== 'basic') {
                setActiveTab(savedTab);
            }
        }
        // Always start with 'basic' tab for new forms or updates
        if (mode === 'update' || !localStorage.getItem('activeTab')) {
            setActiveTab('basic');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]); // Removed activeTab dependency to prevent infinite loops

    // Load editable data if in edit mode
    useEffect(() => {
        if (mode === 'update' && tripId) {
            async function getTripData() {
                try {
                    setLoading(true);
                    const data = await getTripById(tripId);
                    console.log(`editing trip data`,data);
                    setLoading(false);
                    if (data?.success) {
                        setDataToEdit(data?.result?.data);
                        setActiveTab('basic'); // Ensure we start with basic tab in edit mode
                        // Reset form with the loaded data
                        methods.reset({
                            ...data?.result?.data,
                        });

                        setTimeout(() => {
                            methods.setValue(
                                `datesAvailability.dateRangeStart`,
                                formatDateForInput(
                                    data?.result?.data?.datesAvailability
                                        ?.dateRangeStart
                                )
                            );
                            methods.setValue(
                                `datesAvailability.dateRangeEnd`,
                                formatDateForInput(
                                    data?.result?.data?.datesAvailability
                                        ?.dateRangeEnd || ''
                                )
                            );
                            methods.setValue(
                                `additionals`,
                                data?.result?.data?.additionals || []
                            );
                            methods.setValue(
                                `activities`,
                                data?.result?.data?.activities?.map(activity => {
                                    return activity.id;
                                }) || []
                            );
                        }, 0);
                    } else {
                        toast.error('Failed to load trip data for editing');
                    }
                } catch (error) {
                    toast.error(
                        'There was an error while fetching data to edit'
                    );
                }
            }
            getTripData();
        }
    }, [tripId, mode, methods]);

    // Use form validation hooks
    const {
        validateEntireForm,
        showTabErrors,
        validateFields,
        validateCurrentSection,
        getTabsWithErrors,
        hasTabErrors,
    } = useFormValidation({
        methods,
        formSchema: tripPackageFormSchema,
        fieldToTabMapping,
    });

    // Form persistence
    const { handleSaveDraft, clearDraft, getDraftInfo } = useFormPersistence({
        methods,
        localStorageKey: `tripPackageDraft`,
        userId,
    });

    const populateSEODefaults = data => {
        // Create a deep copy to avoid mutating the original data
        const processedData = { ...data };

        // Initialize seo object if it doesn't exist
        if (!processedData.seo) {
            processedData.seo = {};
        }

        // Basic SEO fields
        if (!processedData.seo.title || processedData.seo.title.trim() === '') {
            processedData.seo.title = data.title || '';
        }

        if (
            !processedData.seo.description ||
            processedData.seo.description.trim() === ''
        ) {
            processedData.seo.description = data.shortDescription || '';
        }

        // Open Graph fields
        if (
            !processedData.seo.ogTitle ||
            processedData.seo.ogTitle.trim() === ''
        ) {
            processedData.seo.ogTitle = data.title || '';
        }

        if (
            !processedData.seo.ogDescription ||
            processedData.seo.ogDescription.trim() === ''
        ) {
            processedData.seo.ogDescription = data.shortDescription || '';
        }

        if (!processedData.seo.ogImage) {
            processedData.seo.ogImage = data.mainImage || null;
        }

        // Twitter fields
        if (
            !processedData.seo.twitterTitle ||
            processedData.seo.twitterTitle.trim() === ''
        ) {
            processedData.seo.twitterTitle = data.title || '';
        }

        if (
            !processedData.seo.twitterDescription ||
            processedData.seo.twitterDescription.trim() === ''
        ) {
            processedData.seo.twitterDescription = data.shortDescription || '';
        }

        // Set default twitter card type if not set
        if (!processedData.seo.twitterCard) {
            processedData.seo.twitterCard = 'summary_large_image';
        }

        // Set default robots directive if not set
        if (!processedData.seo.robots) {
            processedData.seo.robots = 'index, follow';
        }

        // Set default schema type if not set
        if (!processedData.seo.schemaType) {
            processedData.seo.schemaType = 'TouristTrip';
        }

        if (!processedData.seo.changeFrequency) {
            processedData.seo.changeFrequency = 'Hourly';
        }
        if (!processedData.seo.sitemapPriority) {
            processedData.seo.sitemapPriority = 0.5;
        }

        return processedData;
    };

    // Data pass to backend through api call
    const createTripPackage = async data => {
        try {
            // Populate SEO defaults before submitting
            const processedData = populateSEODefaults(data);

            // Clean up image payloads to strict matches so they don't get rejected silently
            if (processedData.mainImage) {
                processedData.mainImage = {
                    imageId: processedData.mainImage.imageId || processedData.mainImage.id || processedData.mainImage
                };
            }

            if (processedData.galleryImages && Array.isArray(processedData.galleryImages)) {
                processedData.galleryImages = processedData.galleryImages.map((img, idx) => ({
                    imageId: img.imageId || img.id || img,
                    order: idx,
                }));
            }

            if (mode !== 'update') {
                console.log(`trip create data`, processedData);
                const res = await createTrip(processedData);
                console.log(`trip create response`, res);

                if (res?.success === false) {
                    throw new Error(
                        res?.error?.message || 'Failed to create trip package'
                    );
                }

                toast.success('Trip package created successfully');
                /*  clearDraft();
                localStorage.removeItem('tripPackageDraft'); */
            } else {
                console.log(`trip update data`, processedData);
                const res = await updateTrip(tripId, processedData);

                console.log(`trip update response`, res);

                if (res?.success === false) {
                    throw new Error(
                        res?.error?.message || 'Failed to update trip package'
                    );
                }

                toast.success('Trip Updated successfully');
                /*    clearDraft();
                localStorage.removeItem('tripPackageDraft'); */
            }

            // Clear draft data after successful operation
            /*    clearDraft(); */

            // Also clear the activeTab from localStorage
            localStorage.removeItem('activeTab');

            /*       setTimeout(() => {
                localStorage.removeItem('tripPackageDraft');
            }, 1000); */

            // Navigate to the next tab
            const isLastStep =
                currentTabIndex === formSectionsWithOutSEO.length - 1;
            isLastStep && router.push(`/admin/dashboard/all-affiliate-trips`);
        } catch (error) {
            // Don't clear draft if there's an error
            throw error; // Re-throw to be handled by the calling function
        }
    };

    // Navigate to the next tab
    const handleNext = async () => {
        // Save form data when navigating
        handleSaveDraft();

        // Validate the current section BEFORE checking for errors
        const isCurrentSectionValid = await validateCurrentSection(activeTab);

        if (!isCurrentSectionValid) {
            // Show errors for the current tab
            showTabErrors(activeTab);
            return;
        }

        // Navigate to next tab only if current section is valid
        const currentIndex = formSectionsWithOutSEO.findIndex(
            section => section.id === activeTab
        );
        if (currentIndex < formSectionsWithOutSEO.length - 1) {
            const nextTabId = formSectionsWithOutSEO[currentIndex + 1].id;
            setActiveTab(nextTabId);
            // Store in localStorage to maintain state across page refreshes
            localStorage.setItem('activeTab', nextTabId);
        }
    };

    // Navigate to the previous tab
    const handlePrevious = () => {
        const currentIndex = formSectionsWithOutSEO.findIndex(
            section => section.id === activeTab
        );
        if (currentIndex > 0) {
            const prevTabId = formSectionsWithOutSEO[currentIndex - 1].id;
            setActiveTab(prevTabId);
            // Update localStorage when going back
            localStorage.setItem('activeTab', prevTabId);
        }
    };

    //  handleSubmitForm function
    const handleSubmitForm = async () => {
        setIsSubmitting(true);

        try {
            // Validate the entire form first
            const isValid = await validateEntireForm();

            if (!isValid) {
                // Get tabs with errors after validation
                const currentTabsWithErrors = getTabsWithErrors();

                // Show errors for the current tab first
                showTabErrors(activeTab);

                // If current tab doesn't have errors but other tabs do, navigate to first tab with errors
                if (
                    !currentTabsWithErrors.includes(activeTab) &&
                    currentTabsWithErrors.length > 0
                ) {
                    const firstTabWithErrors = currentTabsWithErrors[0];
                    setActiveTab(firstTabWithErrors);
                    localStorage.setItem('activeTab', firstTabWithErrors);

                    // Show errors for the new tab
                    setTimeout(() => showTabErrors(firstTabWithErrors), 100);

                    toast.info(
                        `Navigated to the ${
                            formSections.find(s => s.id === firstTabWithErrors)
                                ?.label
                        } section with errors`,
                        {
                            style: {
                                backgroundColor: 'var(--color-blue-100)',
                                color: 'var(--color-blue-800)',
                                border: '1px solid var(--color-primary/20)',
                            },
                        }
                    );
                }

                setIsSubmitting(false);
                return;
            }

            const data = methods.getValues();

            // Promote draft images to permanent storage
            toast.info('Moving images to permanent storage...', {
                duration: 2000,
            });

            await createTripPackage(data);
        } catch (error) {
            toast.error(
                `Failed to ${
                    mode === 'update' ? 'update' : 'create'
                } trip package: ${error.message}`,
                {
                    duration: 8000,
                }
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentTabIndex = formSectionsWithOutSEO.findIndex(
        section => section.id === activeTab
    );

    const isLastStep = currentTabIndex === formSectionsWithOutSEO.length - 1;

    // Get current tabs with errors for navigation display
    const tabsWithErrors = getTabsWithErrors();
    const step = currentTabIndex + 1;

    // Handle AI Generated Data
    const handleAiTripData = data => {
        if (!data) return;

        // Iterate through keys and set values
        Object.keys(data).forEach(key => {
            if (key === 'datesAvailability') {
                const datesData = data[key];
                // Handle nested datesAvailability object
                Object.keys(datesData).forEach(dateKey => {
                    // Ensure departureTimes is an array
                    if (
                        dateKey === 'departureTimes' &&
                        Array.isArray(datesData[dateKey])
                    ) {
                        methods.setValue(
                            `datesAvailability.${dateKey}`,
                            datesData[dateKey],
                            {
                                shouldDirty: true,
                                shouldValidate: true,
                            }
                        );
                    } else {
                        methods.setValue(
                            `datesAvailability.${dateKey}`,
                            datesData[dateKey],
                            {
                                shouldDirty: true,
                                shouldValidate: true,
                            }
                        );
                    }
                });
            } else {
                methods.setValue(key, data[key], {
                    shouldDirty: true,
                    shouldValidate: true,
                });
            }
        });

        toast.success('Form filled with AI generated data!');
    };

    return (
        <FormProvider {...methods}>
            <div className='flex justify-end max-w-7xl '>
                <GenerateWithAiButton onTripGenerated={handleAiTripData} />
            </div>
            <form className='space-y-6'>
                {/* Progress bar */}
                <div className='w-full max-w-7xl  mt-4 py-8 rounded flex items-center justify-between'>
                    <div className='flex gap-2 sm:gap-0 max-w-[calc(100%-12rem)] pl-12 items-start flex-1 w-full'>
                        {formSectionsWithOutSEO.map((s, index) => {
                            const isActive = step === s.number;
                            const isCompleted =
                                step > s.number &&
                                !tabsWithErrors.includes(s.id);

                            return (
                                <Fragment key={s.number}>
                                    <div className='relative flex flex-col items-center justify-start z-10'>
                                        <div
                                            className={`
                                                    w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                                                    ${
                                                        isCompleted
                                                            ? 'bg-primary text-gray-100 shadow-md'
                                                            : isActive
                                                              ? 'bg-primary text-gray-100 shadow-lg scale-110'
                                                              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-2 border-gray-200 dark:border-gray-700'
                                                    }
                                                `}>
                                            {isCompleted ? (
                                                <HugeiconsIcon
                                                    icon={Tick01Icon}
                                                />
                                            ) : (
                                                <HugeiconsIcon icon={s.icon} />
                                            )}
                                        </div>
                                        <span
                                            className={`
                                                    absolute max-md:hidden top-10 w-32 text-center text-xs font-light transition-colors
                                                    ${
                                                        isActive || isCompleted
                                                            ? 'text-gray-900 dark:text-white'
                                                            : 'text-gray-400 dark:text-gray-500'
                                                    }
                                                `}>
                                            {s.label}
                                        </span>
                                    </div>

                                    {index <
                                        formSectionsWithOutSEO.length - 1 && (
                                        <div
                                            className={`
                                                    h-0.5 flex-1 mt-4 transition-all duration-300
                                                    ${
                                                        step > s.number
                                                            ? 'bg-gray-900 dark:bg-gray-100'
                                                            : 'bg-gray-200 dark:bg-gray-700'
                                                    }
                                                `}
                                        />
                                    )}
                                </Fragment>
                            );
                        })}
                    </div>

                    {!mode && !isSubmitting && (
                        <Button
                            className='cursor-pointer flex focus:ring-2 ring-primary bg-primary hover:bg-primary/90 hover:text-primary-foreground transition-colors duration-300 ring-offset-2 justify-self-end'
                            type='button'
                            variant='default'
                            onClick={() => {
                                localStorage.setItem('activeTab', activeTab);
                                handleSaveDraft();

                                toast.success('Draft saved successfully!');
                            }}>
                            Save as Draft
                        </Button>
                    )}

                    {mode === 'update' && !isLastStep && (
                        <Button
                            className='cursor-pointer flex focus:ring-2 ring-primary bg-primary hover:bg-primary/90 hover:text-primary-foreground transition-colors duration-300 ring-offset-2 justify-self-end'
                            disabled={isSubmitting}
                            type='button'
                            onClick={handleSubmitForm}>
                            {isSubmitting ? (
                                <>
                                    <HugeiconsIcon
                                        icon={Loading03Icon}
                                        className='mr-2 h-4 w-4 animate-spin'
                                    />
                                    {mode === 'update'
                                        ? 'Updating....'
                                        : 'Saving...'}
                                </>
                            ) : (
                                <>
                                    <HugeiconsIcon
                                        icon={FloppyDiskIcon}
                                        className='mr-2 h-4 w-4'
                                    />
                                    {mode === 'update'
                                        ? 'Update Package'
                                        : ' Save Package'}
                                </>
                            )}
                        </Button>
                    )}
                </div>

                <div className='w-full  grid grid-cols-12 mb-12'>
                    {/* Sidebar navigation */}
                    <FormNavigation
                        title='Trip Package Sections'
                        formSections={formSections}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        tabsWithErrors={tabsWithErrors}
                        currentTabIndex={currentTabIndex}
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                        className='col-span-12 lg:col-span-3 xl:col-span-2 rounded-tr-none border-r-0'
                    />

                    {/* Main form content */}
                    <FormContent
                        formSections={formSections}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        onSubmit={handleSubmitForm}
                        isSubmitting={isSubmitting}
                        currentTabIndex={currentTabIndex}
                        mode={mode}
                        className={
                            'col-span-12 lg:col-span-9 xl:col-span-9 rounded-lg lg:rounded-tl-none lg:rounded-bl-none p-6 border bg-card border-l-0 text-card-foreground shadow-sm'
                        }
                        destinations={destinations}
                        tourOperators={tourOperators}
                        isFetchingOptions={isFetchingOptions}
                    />
                </div>
            </form>
        </FormProvider>
    );
}

