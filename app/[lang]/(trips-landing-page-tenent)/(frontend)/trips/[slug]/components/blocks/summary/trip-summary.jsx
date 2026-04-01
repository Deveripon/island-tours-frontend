'use client';
import { updateAffiliateTripById } from '@/app/_actions/trips/affiliateTripsAction';
import { Star } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAdmin } from '../../../../../../hooks/useAdmin';
import { formatDaysOfWeek } from '../../../../../../utils';
import {
    iconCategories as sharedIconCategories,
    iconMapping as sharedIconMapping,
} from '../../../config/trip-icons';
import SectionTitle from '../../section-title';
import { BlockEditWrapper } from '../common/block-edit-wrapper';
import { useBlockEditState } from '../context/block-edit-context';
import BookingCTAButton from '../cta/booking-cta-button';
import { SummaryForm } from './summary-form';

const TripSummary = ({ trip, data: blockData, id, isBlock = false }) => {
    const { isAdmin, mode, MODES } = useAdmin();
    // Use the hook for block edit state
    const { isEditing, setIsEditing, onUpdate } = useBlockEditState(id);
    const isEditMode = mode === MODES.edit;
    const [tripSummaryData, setTripSummaryData] = useState({
        title: 'About this trip',
        shortDescription: '',
        sections: [],
        showBookingSection: true,
        bookingTitle: 'Secure your booking',
        bookingContent: '',
        bookingButtonText: 'Book this trip now!',
    });

    // Local state for collapsed sections (only used in edit mode)
    const [collapsedSections, setCollapsedSections] = useState({});

    // Use shared icon configuration
    const iconMapping = useMemo(() => sharedIconMapping, []);
    const iconCategories = sharedIconCategories;

    // Default sections based on your original structure
    const defaultSections = useMemo(
        () => [
            {
                id: 'departure',
                title: 'Departure',
                icon: 'calendar',
                type: 'info-card',
                content: [
                    formatDaysOfWeek(trip?.datesAvailability?.daysOfTheWeek) ||
                        'Daily',
                    trip?.departureTime || '7:30 AM',
                ].filter(Boolean),
                column: 'left',
            },
            {
                id: 'location',
                title: 'Location',
                icon: 'location',
                type: 'info-card',
                content: [trip?.destination?.name || 'Santa Barbara Beach'],
                column: 'left',
            },
            {
                id: 'duration',
                title: 'Duration',
                icon: 'clock',
                type: 'info-card',
                content: ['Approx ' + (trip?.duration || '9.5 hours')],
                column: 'left',
            },
            {
                id: 'cruise-time',
                title: 'Cruise Time',
                icon: 'waves',
                type: 'info-card',
                content: [trip?.cruiseTime || '1 hour and 15 minutes'],
                column: 'left',
            },
            {
                id: 'included',
                title: 'Included',
                icon: 'included',
                type: 'info-card',
                content: [
                    trip?.included ||
                        "Beach House, Beach Beds, Palapa's, Breakfast, BBQ Lunch, Soft Drinks, Snorkel Gear, Guided Snorkel Safari",
                ],
                column: 'right',
            },
            {
                id: 'additional-fee',
                title: 'For an additional fee',
                icon: 'money',
                type: 'info-card',
                content: [
                    trip?.additionalFee ||
                        'Transfer Service, Alcoholic Beverages, Massage, Scuba Dive 💰',
                ],
                column: 'right',
            },
            {
                id: 'cancellation',
                title: 'Free cancellation',
                icon: 'cancellation',
                type: 'info-card',
                content: [
                    trip?.cancellationPolicy ||
                        'Cancel up to 48 hours in advance for a full refund',
                ],
                column: 'right',
            },
            {
                id: 'price',
                title: 'Price',
                icon: 'price',
                type: 'info-card',
                content: [
                    trip?.pricing ||
                        'Adults: USD 140 | Kids: USD 70 | Infants: Free',
                ],
                column: 'right',
            },
        ],
        [trip]
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

        // Prioritize Block Data
        if (isBlock && blockData) {
            setTripSummaryData({
                title: blockData.title || 'About this trip',
                shortDescription: blockData.shortDescription || '',
                sections: blockData.sections || defaultSections,
                showBookingSection: blockData.showBookingSection ?? true,
                bookingTitle: blockData.bookingTitle || 'Secure your booking',
                bookingContent:
                    blockData.bookingContent || defaultBookingContent,
                bookingButtonText:
                    blockData.bookingButtonText || 'Book this trip now!',
            });
            const initialCollapsedState = {};
            (blockData.sections || defaultSections).forEach(section => {
                initialCollapsedState[section.id] = true;
            });
            setCollapsedSections(initialCollapsedState);
            return;
        }

        // Legacy Fallback
        const savedData = trip?.userAddedOptions?.tripSummary;

        if (savedData && savedData.sections && savedData.sections.length > 0) {
            setTripSummaryData({
                ...savedData,
                showBookingSection: savedData.showBookingSection ?? true,
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
                title: 'About this trip',
                shortDescription: trip?.shortDescription || '',
                sections: defaultSections,
                showBookingSection: true,
                bookingTitle: 'Secure your booking',
                bookingContent: defaultBookingContent,
                bookingButtonText: 'Book this trip now!',
            };
            setTripSummaryData(initialData);
            const initialCollapsedState = {};
            defaultSections.forEach(section => {
                initialCollapsedState[section.id] = true;
            });
            setCollapsedSections(initialCollapsedState);
        }
    }, [defaultSections, trip, blockData, isBlock]);

    const handleSave = async () => {
        if (isBlock) {
            onUpdate(tripSummaryData);
            setIsEditing(false);
            return;
        }

        try {
            await updateAffiliateTripById(trip?.id, {
                userAddedOptions: {
                    ...trip?.userAddedOptions,
                    tripSummary: tripSummaryData,
                },
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving trip summary data:', error);
        }
    };

    const handleCancel = useCallback(() => {
        const savedData = trip?.userAddedOptions?.tripSummary;
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
            setTripSummaryData({
                ...savedData,
                showBookingSection: savedData.showBookingSection ?? true,
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
            setTripSummaryData({
                title: 'About this trip',
                shortDescription: trip?.shortDescription || '',
                sections: defaultSections,
                showBookingSection: true,
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
        setTripSummaryData(prev => ({
            ...prev,
            sections: prev.sections.map(section =>
                section.id === sectionId ? { ...section, ...updates } : section
            ),
        }));
    }, []);

    const deleteSection = useCallback((e, sectionId) => {
        e.stopPropagation();
        setTripSummaryData(prev => ({
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
        const newSection = {
            id: newSectionId,
            title: 'New Feature',
            icon: 'star',
            type: 'info-card',
            content: ['Feature description'],
            column: 'left',
        };

        setTripSummaryData(prev => ({
            ...prev,
            sections: [...prev.sections, newSection],
        }));
        setCollapsedSections(prev => ({ ...prev, [newSectionId]: false }));
    }, []);

    const toggleSectionCollapse = useCallback(sectionId => {
        setCollapsedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    }, []);

    const renderIcon = useCallback(
        (iconKey, className = '') => {
            const IconComponent = iconMapping[iconKey] || Star;
            return <IconComponent className={className} />;
        },
        [iconMapping]
    );

    const renderItem = (item, index) => (
        <div
            key={index}
            className='flex md:min-h-[80px] p-3 sm:p-5 rounded-2xl items-start space-x-4 hover:bg-accent/5 transition-colors group'>
            <div className='bg-primary/5 p-3 sm:p-4 rounded-2xl text-primary group-hover:scale-110 transition-transform duration-300'>
                {renderIcon(item.icon, 'h-6 w-6 sm:h-8 sm:w-8')}
            </div>
            <div className='flex-1 min-w-0'>
                <h3 className='font-bold text-foreground mb-1 text-sm sm:text-lg tracking-tight'>
                    {item.title}
                </h3>
                {item.content.map((text, textIndex) => (
                    <p
                        key={textIndex}
                        className='text-muted-foreground md:text-gray-500 font-medium text-xs sm:text-[15px] break-words leading-snug'>
                        {text}
                    </p>
                ))}
            </div>
        </div>
    );

    const leftColumnSections = tripSummaryData.sections.filter(
        s => s.column === 'left'
    );
    const rightColumnSections = tripSummaryData.sections.filter(
        s => s.column === 'right'
    );

    return (
        <BlockEditWrapper
            isEditMode={isEditMode}
            isAdmin={isAdmin}
            onEdit={() => setIsEditing(true)}>
            <div className='flex items-center justify-between'>
                <SectionTitle className='text-2xl sm:text-3xl'>
                    {tripSummaryData.title}
                </SectionTitle>
            </div>

            {tripSummaryData.shortDescription && (
                <p className='text-muted-foreground mb-8 text-sm sm:text-base max-w-3xl leading-relaxed'>
                    {tripSummaryData.shortDescription}
                </p>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12'>
                <div className='space-y-4 lg:space-y-6'>
                    {leftColumnSections.map((item, index) =>
                        renderItem(item, `left-${index}`)
                    )}
                </div>
                <div className='space-y-4 lg:space-y-6'>
                    {rightColumnSections.map((item, index) =>
                        renderItem(item, `right-${index}`)
                    )}
                </div>
            </div>

            {tripSummaryData.showBookingSection && (
                <div className='mt-12'>
                    <BookingCTAButton
                        title={tripSummaryData.bookingTitle}
                        description={tripSummaryData.bookingContent}
                        buttonText={tripSummaryData.bookingButtonText}
                        link='#sidebar'
                    />
                </div>
            )}

            <SummaryForm
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                tripSummaryData={tripSummaryData}
                setTripSummaryData={setTripSummaryData}
                handleSave={handleSave}
                handleCancel={handleCancel}
                updateSection={updateSection}
                deleteSection={deleteSection}
                addNewSection={addNewSection}
                toggleSectionCollapse={toggleSectionCollapse}
                collapsedSections={collapsedSections}
                renderIcon={renderIcon}
                iconCategories={iconCategories}
            />
        </BlockEditWrapper>
    );
};

export default TripSummary;

