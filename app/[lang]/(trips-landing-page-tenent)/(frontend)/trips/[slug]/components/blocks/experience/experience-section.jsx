'use client';
import { updateAffiliateTripById } from '@/app/_actions/trips/affiliateTripsAction';
import {
    AlignBoxMiddleLeftIcon,
    CheckListIcon,
    Clock01FreeIcons,
    File01Icon,
    LeftToRightListNumberIcon,
    Location01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Star } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAdmin } from '../../../../../../hooks/useAdmin';
import {
    getDefaultIconForType,
    iconCategories as sharedIconCategories,
    iconMapping as sharedIconMapping,
} from '../../../config/trip-icons';
import SectionTitle from '../../section-title';
import { BlockEditWrapper } from '../common/block-edit-wrapper';
import { useBlockEditState } from '../context/block-edit-context';
import BookingCTAButton from '../cta/booking-cta-button';
import { ExperienceForm } from './experience-form';

const ExperienceSection = ({ trip, data: blockData, id, isBlock = false }) => {
    const { isAdmin, mode, MODES } = useAdmin();
    // Use the hook for block edit state
    const { isEditing, setIsEditing, onUpdate } = useBlockEditState(id);
    const isEditMode = mode === MODES.edit;
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [experienceData, setExperienceData] = useState({
        title: 'Experience',
        shortDescription: '',
        sections: [],
        showBookingButton: true,
        bookingTitle: 'Secure your booking',
        bookingContent: '',
        bookingButtonText: 'Book this trip now!',
    });
    const DESCRIPTION_CHAR_LIMIT = 400;

    const getTruncatedDescription = (text, limit) => {
        if (!text) return '';
        if (text.length <= limit) return text;
        return text.substring(0, limit).trim() + '...';
    };

    const hasMore = description => {
        if (!description) return false;
        return description.length > DESCRIPTION_CHAR_LIMIT;
    };

    const getDisplayDescription = description => {
        return showFullDescription
            ? description
            : getTruncatedDescription(description, DESCRIPTION_CHAR_LIMIT);
    };

    const handleSeeMore = () => {
        setShowFullDescription(!showFullDescription);
    };

    const stripHtml = html => {
        if (typeof document === 'undefined') return html || '';
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    // Local state for collapsed sections (only used in edit mode)
    const [collapsedSections, setCollapsedSections] = useState({});

    // Default section templates
    const defaultSections = useMemo(
        () => [
            {
                id: 'highlights',
                title: 'Highlights',
                icon: 'bullet-list',
                type: 'bullet-list',
                items: [
                    'Travel to Klein Curacao on a Super Yacht',
                    "Enjoy Curacao's stunning east coast views along the way",
                    'You might spot a school of dolphins during the trip',
                    'Your day, your way: scuba, snorkel, hike, explore, or relax',
                    "Stay cool with some ice-cold drinks at Niko's Bar",
                    'Sit back and relax at the private and stylish beach house',
                ],
            },
            {
                id: 'description',
                title: 'Full description',
                icon: 'description',
                type: 'description',
                content: trip?.fullDescription
                    ? stripHtml(trip.fullDescription)
                    : `Departure: You'll board the boat at 7:15 AM at Santa Barbara Beach (Sandals Hotel, next to Boca 19 Restaurant). Upon arrival at Klein Curacao, relax on the beach or at the Beach House while the crew prepares a delightful breakfast for you. After breakfast, the island is yours to explore.

You can snorkel with sea turtles, go scuba diving, relax in the water, visit the iconic lighthouse and the stranded shipwreck, sunbathe, take a massage, and much more. Klein Curacao is an uninhabited coral island located southeast of Curacao in the Caribbean Sea.`,
            },
            {
                id: 'included',
                title: "What's included",
                icon: 'check-list',
                type: 'check-list',
                items: [
                    'Round-trip to Klein Curacao',
                    'Private Beach house',
                    'Plenty of beds and shade',
                    'Unlimited soft drinks and water',
                    'Breakfast',
                    'BBQ lunch',
                ],
            },
            {
                id: 'additional',
                title: 'Additional',
                icon: 'bullet-list',
                subtitle: 'Available at an extra cost',
                type: 'bullet-list',
                items: [
                    'Scuba Diving',
                    'Massage',
                    'Alcoholic beverages',
                    'Transfer Service',
                ],
            },
            {
                id: 'meeting',
                title: 'Meeting point',
                icon: 'location',
                type: 'meeting-info',
                location:
                    'The pier of Santa Barbara Beach (Sandals Hotel, next to Boca 19 Restaurant) or your reserved pickup location',
                time: 'Boat departure time: 07:30 AM',
                linkText: 'Open in Google Maps',
                linkUrl:
                    'https://www.google.com/maps/place/Santa+Barbara+Beach+%26+Golf+Resort,+Curacao/@12.0836,-68.8989,17z',
            },
        ],
        [trip?.fullDescription]
    );

    // Initialize data on component mount
    useEffect(() => {
        const defaultBookingContent = `you only need to pay ${
            trip?.pricingConfig?.affiliateCommission?.commissionType !==
            'PERCENTAGE'
                ? '$'
                : ''
        }${trip?.pricingConfig?.affiliateCommission?.commissionValue}${
            trip?.pricingConfig?.affiliateCommission?.commissionType ===
            'PERCENTAGE'
                ? '%'
                : ''
        } as a deposit to secure your booking. The remaining of the payment needs to be paid directly to the tour operator.`;

        // Determine source of data: Block Data -> Trip Data -> Default
        let savedData = null;
        if (isBlock && blockData) {
            savedData = blockData;
        } else {
            savedData = trip?.userAddedOptions?.experience;
        }

        if (savedData && savedData.sections && savedData.sections.length > 0) {
            setExperienceData({
                ...savedData,
                title: savedData.title || 'Experience',
                shortDescription: savedData.shortDescription || '',
                showBookingButton: savedData.showBookingButton ?? true,
                bookingTitle: savedData.bookingTitle || 'Secure your booking',
                bookingContent:
                    savedData.bookingContent || defaultBookingContent,
                bookingButtonText:
                    savedData.bookingButtonText || 'Book this trip now!',
            });
            const initialCollapsedState = {};
            savedData.sections.forEach(section => {
                initialCollapsedState[section.id] = true;
            });
            setCollapsedSections(initialCollapsedState);
        } else {
            const initialData = {
                title: 'Experience',
                shortDescription: '',
                sections: defaultSections,
                showBookingButton: true,
                bookingTitle: 'Secure your booking',
                bookingContent: defaultBookingContent,
                bookingButtonText: 'Book this trip now!',
            };
            setExperienceData(initialData);
            const initialCollapsedState = {};
            defaultSections.forEach(section => {
                initialCollapsedState[section.id] = true;
            });
            setCollapsedSections(initialCollapsedState);
        }
    }, [defaultSections, trip, blockData, isBlock]);

    // Section type options for the form
    const sectionTypes = [
        {
            value: 'bullet-list',
            label: 'Bullet List',
            icon: LeftToRightListNumberIcon,
            preview: (
                <div className='space-y-1'>
                    <div className='flex items-center gap-1'>
                        <div className='w-1 h-1 bg-primary/40 rounded-full'></div>
                        <div className='h-2 bg-muted rounded w-16'></div>
                    </div>
                </div>
            ),
        },
        {
            value: 'check-list',
            label: 'Check List',
            icon: CheckListIcon,
            preview: (
                <div className='space-y-1'>
                    <div className='flex items-center gap-1'>
                        <HugeiconsIcon
                            icon={CheckListIcon}
                            size={8}
                            className='text-primary'
                        />
                        {/* <div className='h-2 bg-primary rounded w-16'></div> */}
                    </div>
                </div>
            ),
        },
        {
            value: 'description',
            label: 'Long Text',
            icon: File01Icon,
            preview: (
                <div className='space-y-1'>
                    <div className='h-2 bg-muted rounded w-full'></div>
                    <div className='h-2 bg-muted rounded w-full'></div>
                </div>
            ),
        },
        {
            value: 'single-paragraph',
            label: 'Short Text',
            icon: AlignBoxMiddleLeftIcon,
            preview: (
                <div className='space-y-1'>
                    <div className='h-2 bg-muted rounded w-full'></div>
                </div>
            ),
        },
        {
            value: 'meeting-info',
            label: 'Location',
            icon: Location01Icon,
            preview: (
                <div className='space-y-1'>
                    <div className='flex items-center gap-1'>
                        <HugeiconsIcon
                            icon={Location01Icon}
                            size={8}
                            className='text-primary'
                        />
                        <div className='h-2 bg-muted rounded w-14'></div>
                    </div>
                </div>
            ),
        },
    ];

    // Use shared icon configuration
    const iconMapping = useMemo(() => sharedIconMapping, []);
    const iconCategories = sharedIconCategories;

    const renderIcon = useCallback(
        (iconKey, className = '') => {
            const IconComponent = iconMapping[iconKey] || Star;
            return <IconComponent className={className} />;
        },
        [iconMapping]
    );

    const handleSave = async () => {
        if (isBlock) {
            onUpdate(experienceData);
            setIsEditing(false);
            return;
        }

        try {
            await updateAffiliateTripById(trip?.id, {
                userAddedOptions: {
                    ...trip?.userAddedOptions,
                    experience: experienceData,
                },
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving experience data:', error);
        }
    };

    const handleCancel = useCallback(() => {
        const savedData = trip?.userAddedOptions?.experience;
        const defaultBookingContent = `you only need to pay ${
            trip?.pricingConfig?.affiliateCommission?.commissionType !==
            'PERCENTAGE'
                ? '$'
                : ''
        }${trip?.pricingConfig?.affiliateCommission?.commissionValue}${
            trip?.pricingConfig?.affiliateCommission?.commissionType ===
            'PERCENTAGE'
                ? '%'
                : ''
        } as a deposit to secure your booking. The remaining of the payment needs to be paid directly to the tour operator.`;

        if (savedData) {
            setExperienceData({
                ...savedData,
                title: savedData.title || 'Experience',
                shortDescription: savedData.shortDescription || '',
                showBookingButton: savedData.showBookingButton ?? true,
                bookingTitle: savedData.bookingTitle || 'Secure your booking',
                bookingContent:
                    savedData.bookingContent || defaultBookingContent,
                bookingButtonText:
                    savedData.bookingButtonText || 'Book this trip now!',
            });
            const resetCollapsedState = {};
            savedData.sections.forEach(section => {
                resetCollapsedState[section.id] = true;
            });
            setCollapsedSections(resetCollapsedState);
        } else {
            setExperienceData({
                title: 'Experience',
                shortDescription: '',
                sections: defaultSections,
                showBookingButton: true,
                bookingTitle: 'Secure your booking',
                bookingContent: defaultBookingContent,
                bookingButtonText: 'Book this trip now!',
            });
            const resetCollapsedState = {};
            defaultSections.forEach(section => {
                resetCollapsedState[section.id] = true;
            });
            setCollapsedSections(resetCollapsedState);
        }
        setIsEditing(false);
    }, [trip, defaultSections]);

    const updateSection = useCallback((sectionId, updates) => {
        setExperienceData(prev => ({
            ...prev,
            sections: prev.sections.map(section => {
                if (section.id === sectionId) {
                    if (updates.type && updates.type !== section.type) {
                        return {
                            ...section,
                            ...updates,
                            icon: getDefaultIconForType(updates.type),
                        };
                    }
                    return { ...section, ...updates };
                }
                return section;
            }),
        }));
    }, []);

    const deleteSection = useCallback(sectionId => {
        setExperienceData(prev => ({
            ...prev,
            sections: prev.sections.filter(section => section.id !== sectionId),
        }));
        setCollapsedSections(prev => {
            const newState = { ...prev };
            delete newState[sectionId];
            return newState;
        });
    }, []);

    const addNewSection = useCallback(() => {
        const newSectionId = `section-${Date.now()}`;
        const defaultType = 'bullet-list';
        const newSection = {
            id: newSectionId,
            title: 'New Section',
            icon: getDefaultIconForType(defaultType),
            type: defaultType,
            items: ['New item'],
        };

        setExperienceData(prev => ({
            ...prev,
            sections: [...prev.sections, newSection],
        }));
        setCollapsedSections(prev => ({
            ...prev,
            [newSectionId]: false,
        }));
    }, []);

    const toggleSectionCollapse = useCallback(sectionId => {
        setCollapsedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    }, []);

    const renderSection = section => {
        switch (section.type) {
            case 'bullet-list':
                return (
                    <div className='flex flex-col sm:flex-row sm:gap-12 py-4'>
                        <div className='w-full sm:w-1/3 mb-4 sm:mb-0'>
                            <div className='flex items-center gap-3 mb-2'>
                                <div className='p-2 bg-primary/5 text-primary rounded-lg'>
                                    {renderIcon(section.icon, 'h-5 w-5')}
                                </div>
                                <h4 className='font-bold text-lg sm:text-xl text-foreground'>
                                    {section.title}
                                </h4>
                            </div>
                            {section.subtitle && (
                                <p className='text-muted-foreground text-xs sm:text-sm font-medium'>
                                    {section.subtitle}
                                </p>
                            )}
                        </div>
                        <div className='w-full sm:w-2/3'>
                            <ul className='grid grid-cols-1 gap-y-3 gap-x-6'>
                                {section.items?.map((item, idx) => (
                                    <li
                                        key={idx}
                                        className='flex items-start gap-3 group'>
                                        <div className='mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors duration-300 flex-shrink-0' />
                                        <span className='text-sm sm:text-[15px] text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300'>
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );

            case 'check-list':
                return (
                    <div className='flex flex-col sm:flex-row sm:gap-12 py-4'>
                        <div className='w-full sm:w-1/3 mb-4 sm:mb-0'>
                            <div className='flex items-center gap-3 mb-2'>
                                <div className='p-2 bg-primary/5 text-primary rounded-lg'>
                                    {renderIcon(section.icon, 'h-5 w-5')}
                                </div>
                                <h4 className='font-bold text-lg sm:text-xl text-foreground'>
                                    {section.title}
                                </h4>
                            </div>
                        </div>
                        <div className='w-full sm:w-2/3'>
                            <ul className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-8'>
                                {section.items?.map((item, idx) => (
                                    <li
                                        key={idx}
                                        className='flex items-start gap-3 group'>
                                        {/*          <div className='mt-1 p-0.5 bg-primary/10 text-primary rounded-full  transition-all duration-300 flex-shrink-0'>
                                            <HugeiconsIcon
                                                icon={CheckListIcon}
                                                size={12}
                                            />
                                        </div> */}
                                        <div className='mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors duration-300 flex-shrink-0' />
                                        <span className='text-sm sm:text-[15px] text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300'>
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );

            case 'description':
                return (
                    <div className='flex flex-col py-4'>
                        <div className='flex items-center gap-3 mb-6'>
                            <div className='p-2 bg-primary/5 text-primary rounded-lg'>
                                {renderIcon(section.icon, 'h-5 w-5')}
                            </div>
                            <h4 className='font-bold text-lg sm:text-xl text-foreground'>
                                {section.title}
                            </h4>
                        </div>
                        <div className='space-y-4'>
                            <p className='text-sm sm:text-base text-muted-foreground leading-loose whitespace-pre-wrap max-w-4xl'>
                                {getDisplayDescription(section.content)}
                            </p>
                            {hasMore(section.content || '') && (
                                <button
                                    onClick={handleSeeMore}
                                    className='text-primary font-bold text-sm hover:underline transition-all'>
                                    {showFullDescription
                                        ? 'See less'
                                        : 'See more'}
                                </button>
                            )}
                        </div>
                    </div>
                );

            case 'single-paragraph':
                return (
                    <div className='flex flex-col py-4'>
                        <div className='flex items-center gap-3 mb-6'>
                            <div className='p-2 bg-primary/5 text-primary rounded-lg'>
                                {renderIcon(section.icon, 'h-5 w-5')}
                            </div>
                            <h4 className='font-bold text-lg sm:text-xl text-foreground'>
                                {section.title}
                            </h4>
                        </div>
                        <p className='text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap max-w-4xl'>
                            {section.content}
                        </p>
                    </div>
                );

            case 'meeting-info':
                return (
                    <div className='flex flex-col py-4'>
                        <div className='flex items-center gap-3 mb-6'>
                            <div className='p-2 bg-primary/5 text-primary rounded-lg'>
                                {renderIcon(section.icon, 'h-5 w-5')}
                            </div>
                            <h4 className='font-bold text-lg sm:text-xl text-foreground'>
                                {section.title}
                            </h4>
                        </div>

                        <div className='bg-accent/5  rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-12 border border-border/50'>
                            <div className='flex-1 space-y-4'>
                                <div className='flex items-start gap-4'>
                                    <div className='p-2.5 bg-background rounded-2xl border border-border flex-shrink-0'>
                                        <HugeiconsIcon
                                            icon={Location01Icon}
                                            size={20}
                                            className='text-primary'
                                        />
                                    </div>
                                    <div className='space-y-1'>
                                        <p className='text-xs font-bold text-muted-foreground    '>
                                            Location
                                        </p>
                                        <p className='text-sm font-medium text-foreground leading-relaxed'>
                                            {section.location}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-start gap-4'>
                                    <div className='p-2.5 bg-background rounded-2xl border border-border flex-shrink-0'>
                                        <HugeiconsIcon
                                            icon={Clock01FreeIcons}
                                            size={20}
                                            className='text-primary'
                                        />
                                    </div>
                                    <div className='space-y-1'>
                                        <p className='text-xs font-bold text-muted-foreground    '>
                                            Timing
                                        </p>
                                        <p className='text-sm font-medium text-foreground leading-relaxed'>
                                            {section.time}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <a
                                href={section.linkUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='w-full sm:w-auto h-14 px-8 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95 text-sm'>
                                {section.linkText}
                                <HugeiconsIcon
                                    icon={Location01Icon}
                                    size={18}
                                />
                            </a>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <BlockEditWrapper
            isAdmin={isAdmin}
            isEditMode={isEditMode}
            onEdit={() => setIsEditing(true)}>
            <div className='md:space-y-8'>
                <div className='space-y-4'>
                    <SectionTitle className=''>
                        {experienceData.title}
                    </SectionTitle>
                    {experienceData.shortDescription && (
                        <p className='text-muted-foreground max-w-3xl text-base sm:text-lg leading-relaxed font-medium'>
                            {experienceData.shortDescription}
                        </p>
                    )}
                </div>

                <div className='divide-y divide-border/40'>
                    {experienceData.sections.map((section, idx) => (
                        <div key={idx}>{renderSection(section)}</div>
                    ))}
                </div>

                {experienceData.showBookingButton && (
                    <div className=''>
                        <BookingCTAButton
                            title={experienceData.bookingTitle}
                            description={experienceData.bookingContent}
                            buttonText={experienceData.bookingButtonText}
                            link='#sidebar'
                        />
                    </div>
                )}
            </div>

            <ExperienceForm
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                experienceData={experienceData}
                setExperienceData={setExperienceData}
                handleSave={handleSave}
                handleCancel={handleCancel}
                updateSection={updateSection}
                deleteSection={deleteSection}
                addNewSection={addNewSection}
                toggleSectionCollapse={toggleSectionCollapse}
                collapsedSections={collapsedSections}
                renderIcon={renderIcon}
                sectionTypes={sectionTypes}
                iconCategories={iconCategories}
            />
        </BlockEditWrapper>
    );
};

export default ExperienceSection;

