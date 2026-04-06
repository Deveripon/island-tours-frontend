'use client';
import { updateAffiliateTrip } from '@/app/_actions/trips/affiliateTripsAction';
import { getAllCategories } from '@/app/_actions/trips/category';
import { tripPackageOptions } from '@/data/trip-options';
import { getGroupedDataOfCategories } from '@/lib/utils';
import {
    InformationCircleIcon,
    StarIcon,
    Tag01Icon,
    UserGroupIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useAdmin } from '../../../../../../hooks/useAdmin';
import SectionTitle from '../../section-title';
import { BlockEditWrapper } from '../common/block-edit-wrapper';
import { useBlockEditState } from '../context/block-edit-context';
import { TourInfoForm } from './tour-info-form';

const TourTypeInformation = ({
    trip,
    data: blockData,
    id,
    isBlock = false,
}) => {
    const { isAdmin, mode, MODES } = useAdmin();
    // Use the hook for block edit state
    const { isEditing, setIsEditing, onUpdate } = useBlockEditState(id);
    const isEditMode = mode === MODES.edit;

    const [categories, setCategories] = useState({});

    const [data, setData] = useState(() => {
        if (isBlock && blockData) {
            return {
                title: blockData.title || 'Tour Information',
                shortDescription: blockData.shortDescription || '',
                ...blockData,
            };
        }
        return {
            title:
                trip?.userAddedOptions?.tourInformation?.title ||
                'Tour Information',
            shortDescription:
                trip?.userAddedOptions?.tourInformation?.shortDescription || '',
            ...trip?.tourCategory,
            ...(trip?.userAddedOptions?.tourInformation || {}),
        };
    });

    useEffect(() => {
        if (isBlock && blockData) {
            setData(prev => ({
                ...prev,
                title: blockData.title || 'Tour Information',
                shortDescription: blockData.shortDescription || '',
                ...blockData,
            }));
        } else if (
            trip?.tourCategory ||
            trip?.userAddedOptions?.tourInformation
        ) {
            setData(prev => ({
                ...prev,
                title:
                    trip?.userAddedOptions?.tourInformation?.title ||
                    'Tour Information',
                shortDescription:
                    trip?.userAddedOptions?.tourInformation?.shortDescription ||
                    '',
                ...trip?.tourCategory,
                ...trip?.userAddedOptions?.tourInformation,
            }));
        }
    }, [trip, blockData, isBlock]);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await getAllCategories();
                if (res?.success) {
                    const groupedData = getGroupedDataOfCategories(
                        res?.result?.data
                    );
                    setCategories(groupedData);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }
        fetchCategories();
    }, []);

    const getMergedOptions = (defaultItems, customItems) => {
        const allOptions = [...(defaultItems || []), ...(customItems || [])];
        return allOptions.filter(
            (option, index, self) =>
                index ===
                self.findIndex(
                    opt => opt.id === option.id || opt.name === option.name
                )
        );
    };

    const tourTypeOptions = useMemo(
        () =>
            getMergedOptions(
                tripPackageOptions.tourTypes,
                categories?.TOUR_TYPE
            ),
        [categories]
    );
    const difficultyOptions = useMemo(
        () =>
            getMergedOptions(
                tripPackageOptions.difficultyLevels,
                categories?.DIFFICULTY_LEVEL
            ),
        [categories]
    );
    const suitableForOptions = useMemo(
        () =>
            getMergedOptions(
                tripPackageOptions.suitableFor,
                categories?.SUITABLE_FOR
            ),
        [categories]
    );
    const tourStyleOptions = useMemo(
        () =>
            getMergedOptions(
                tripPackageOptions.tourStyles,
                categories?.TOUR_STYLE
            ),
        [categories]
    );

    const handleSave = async () => {
        if (isBlock) {
            onUpdate(data);
            setIsEditing(false);
            return;
        }

        await updateAffiliateTrip(trip?.id, {
            userAddedOptions: {
                ...trip?.userAddedOptions,
                tourInformation: data,
            },
        });

        setIsEditing(false);
    };

    const handleCancel = () => {
        if (isBlock && blockData) {
            setData({
                title: blockData.title || 'Tour Information',
                shortDescription: blockData.shortDescription || '',
                ...blockData,
            });
        } else {
            setData({
                ...(trip?.userAddedOptions?.tourInformation || {}),
            });
        }
        setIsEditing(false);
    };

    const updateField = (field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const handleCheckboxToggle = (field, optionName) => {
        setData(prev => {
            const currentArray = prev[field] || [];
            const newArray = currentArray.includes(optionName)
                ? currentArray.filter(i => i !== optionName)
                : [...currentArray, optionName];
            return { ...prev, [field]: newArray };
        });
    };

    console.log(`data`, data);
    return (
        <BlockEditWrapper
            isEditMode={isEditMode}
            isAdmin={isAdmin}
            onEdit={() => setIsEditing(true)}>
            <SectionTitle className='text-2xl sm:text-3xl'>
                {data.title}
            </SectionTitle>

            {data.shortDescription && (
                <p className='text-muted-foreground mb-8 text-sm sm:text-base max-w-3xl leading-relaxed'>
                    {data.shortDescription}
                </p>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='space-y-6'>
                    <div>
                        <h3 className='text-xs font-bold text-muted-foreground     mb-3 flex items-center gap-2'>
                            <HugeiconsIcon
                                icon={Tag01Icon}
                                className='w-3 h-3'
                            />
                            Tour Types
                        </h3>
                        <div className='flex flex-wrap gap-2'>
                            {data.tourTypes && data.tourTypes.length > 0 ? (
                                data.tourTypes.map((type, index) => (
                                    <span
                                        key={index}
                                        className='px-3 py-1.5 bg-primary/5 text-primary border border-primary/10 rounded-lg text-sm font-semibold'>
                                        {type}
                                    </span>
                                ))
                            ) : (
                                <span className='text-sm text-muted-foreground italic'>
                                    No types selected
                                </span>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className='text-xs font-bold text-muted-foreground     mb-3 flex items-center gap-2'>
                            <HugeiconsIcon
                                icon={StarIcon}
                                className='w-3 h-3'
                            />
                            Difficulty Level
                        </h3>
                        {data.difficulty ? (
                            <span className='px-3 py-1.5 bg-primary/5 text-primary border border-primary/10 rounded-lg text-sm font-semibold'>
                                {data.difficulty}
                            </span>
                        ) : (
                            <span className='text-sm text-muted-foreground italic'>
                                Not specified
                            </span>
                        )}
                    </div>
                </div>

                <div className='space-y-6'>
                    <div>
                        <h3 className='text-xs font-bold text-muted-foreground     mb-3 flex items-center gap-2'>
                            <HugeiconsIcon
                                icon={UserGroupIcon}
                                className='w-3 h-3'
                            />
                            Suitable For
                        </h3>
                        <div className='flex flex-wrap gap-2'>
                            {data.suitableFor && data.suitableFor.length > 0 ? (
                                data.suitableFor.map((suitable, index) => (
                                    <span
                                        key={index}
                                        className='px-3 py-1.5 bg-primary/5 text-primary border border-primary/10 rounded-lg text-sm font-semibold'>
                                        {suitable}
                                    </span>
                                ))
                            ) : (
                                <span className='text-sm text-muted-foreground italic'>
                                    No audience specified
                                </span>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className='text-xs font-bold text-muted-foreground     mb-3 flex items-center gap-2'>
                            <HugeiconsIcon
                                icon={InformationCircleIcon}
                                className='w-3 h-3'
                            />
                            Tour Style
                        </h3>
                        {data.tourStyle ? (
                            <span className='px-3 py-1.5 bg-primary/5 text-primary border border-primary/10 rounded-lg text-sm font-semibold'>
                                {data.tourStyle}
                            </span>
                        ) : (
                            <span className='text-sm text-muted-foreground italic'>
                                Not specified
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <TourInfoForm
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                data={data}
                setData={setData}
                handleSave={handleSave}
                handleCancel={handleCancel}
                tourTypeOptions={tourTypeOptions}
                difficultyOptions={difficultyOptions}
                suitableForOptions={suitableForOptions}
                tourStyleOptions={tourStyleOptions}
                updateField={updateField}
                handleCheckboxToggle={handleCheckboxToggle}
            />
        </BlockEditWrapper>
    );
};

export default TourTypeInformation;

