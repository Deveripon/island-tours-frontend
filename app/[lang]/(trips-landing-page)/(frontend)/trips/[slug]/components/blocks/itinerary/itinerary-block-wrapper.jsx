'use client';

import { updateTrip } from '@/app/_actions/trips/affiliateTripsAction';
import { useCallback, useEffect, useState } from 'react';
import { useAdmin } from '../../../../../../hooks/useAdmin';
import { BLOCK_METADATA } from '../block-registry';
import { BlockEditWrapper } from '../common/block-edit-wrapper';
import { useBlockEditState } from '../context/block-edit-context';
import { ItineraryForm } from './itinerary-form';

// ---------------------------------------------------------------------------
// Default itinerary data (module-level)
// ---------------------------------------------------------------------------
const DEFAULT_DATA = {
    title: 'Itinerary',
    shortDescription:
        'This is the schedule for the day trip with All Boat Charters:',
    days: [
        {
            id: 'day-1',
            title: 'Day 1',
            items: [
                {
                    id: '1',
                    time: '10:15',
                    description: 'Check-in at Mood Beach',
                    side: 'left',
                },
                {
                    id: '2',
                    time: '10:30 – 12:15',
                    description: 'Sailing on the catamaran to Klein Curacao',
                    side: 'right',
                },
                {
                    id: '3',
                    time: '12:30 – 17:00',
                    description: 'Relax or explore the island',
                    side: 'left',
                },
                {
                    id: '4',
                    time: '12:30',
                    description: 'BBQ lunch buffet on board',
                    side: 'right',
                },
                {
                    id: '5',
                    time: '13:00 – 18:30',
                    description: 'Premium open bar available',
                    side: 'left',
                },
                {
                    id: '6',
                    time: '17:00 – 18:30',
                    description: 'Sunset Cruise back to Curaçao',
                    side: 'right',
                },
                {
                    id: '7',
                    time: '18:30',
                    description: 'Arrival at Mood Beach',
                    side: 'left',
                },
            ],
        },
    ],
};

// ---------------------------------------------------------------------------
// Helper — resolve source data
// ---------------------------------------------------------------------------
const getSourceData = ({ isBlock, blockData, trip }) =>
    isBlock && blockData
        ? blockData
        : (trip?.userAddedOptions?.itinerary ?? null);

// ---------------------------------------------------------------------------
// Helper — migrate old structure (items at root → days array)
// ---------------------------------------------------------------------------
const migrateToDays = savedData => {
    let days = savedData.days || [];
    if (!days.length && savedData.items?.length) {
        days = [
            { id: 'migrated-day-1', title: 'Day 1', items: savedData.items },
        ];
    }
    return days.length ? days : DEFAULT_DATA.days;
};

// ===========================================================================
// ItineraryBlockWrapper
//
// Owns ALL shared logic for both itinerary variants:
//   • itineraryData state + backup states for single/multi-day switching
//   • Scroll-based active item tracking (only used by classic view — passed via children)
//   • handleSave, handleCancel, addDay, removeDay, updateDay, addItem, removeItem, updateItem
//   • switchToSingleDay, switchToMultiDay
//   • BlockEditWrapper shell + ItineraryForm sheet
//
// Props:
//   children(ctx)   — render-prop; receives { itineraryData, activeId, itemRefs }
//   defaultVariant  — 'classic' | 'timeline'
// ===========================================================================
export const ItineraryBlockWrapper = ({
    trip,
    data: blockData,
    id,
    isBlock = false,
    defaultVariant = 'classic',
    children,
}) => {
    const { isAdmin, mode, MODES } = useAdmin();
    const isEditMode = mode === MODES.edit;

    const { isEditing, setIsEditing, onUpdate } = useBlockEditState(id);
    const [isLayoutModalOpen, setIsLayoutModalOpen] = useState(false);

    const [itineraryData, setItineraryData] = useState(DEFAULT_DATA);
    const [singleDayBackup, setSingleDayBackup] = useState(null);
    const [multiDayBackup, setMultiDayBackup] = useState(null);

    // ── Initialise from source data ───────────────────────────────────────────
    useEffect(() => {
        const saved = getSourceData({ isBlock, blockData, trip });

        if (saved) {
            const days = migrateToDays(saved);
            const initialData = {
                ...saved,
                title: saved.title || DEFAULT_DATA.title,
                shortDescription:
                    saved.shortDescription !== undefined
                        ? saved.shortDescription
                        : DEFAULT_DATA.shortDescription,
                days,
                variant: saved.variant || blockData?.variant || defaultVariant,
            };
            setItineraryData(initialData);

            if (days.length > 1) {
                setMultiDayBackup(initialData);
                setSingleDayBackup({ ...initialData, days: [days[0]] });
            } else {
                setSingleDayBackup(initialData);
                setMultiDayBackup(initialData);
            }
        } else {
            const fallback = {
                ...DEFAULT_DATA,
                variant: blockData?.variant || defaultVariant,
            };
            setItineraryData(fallback);
            setSingleDayBackup(fallback);
            setMultiDayBackup(fallback);
        }
    }, [trip, blockData, isBlock]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Save ─────────────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (isBlock) {
            onUpdate(itineraryData);
            setIsEditing(false);
            return;
        }
        try {
            await updateTrip(trip?.id, {
                userAddedOptions: {
                    ...trip?.userAddedOptions,
                    itinerary: itineraryData,
                },
            });
            setIsEditing(false);
        } catch (err) {
            console.error('Error saving itinerary data:', err);
        }
    };

    const handleCancel = useCallback(() => setIsEditing(false), []);

    // ── Day CRUD ──────────────────────────────────────────────────────────────
    const addDay = () => {
        const newDay = {
            id: `day-${Date.now()}`,
            title: `Day ${itineraryData.days.length + 1}`,
            date: '',
            items: [],
        };
        setItineraryData(prev => ({ ...prev, days: [...prev.days, newDay] }));
    };

    const removeDay = dayId =>
        setItineraryData(prev => ({
            ...prev,
            days: prev.days.filter(d => d.id !== dayId),
        }));

    const updateDay = (dayId, updates) =>
        setItineraryData(prev => ({
            ...prev,
            days: prev.days.map(d =>
                d.id === dayId ? { ...d, ...updates } : d
            ),
        }));

    // ── Item CRUD ─────────────────────────────────────────────────────────────
    const addItem = dayId =>
        setItineraryData(prev => ({
            ...prev,
            days: prev.days.map(day =>
                day.id === dayId
                    ? {
                          ...day,
                          items: [
                              ...day.items,
                              {
                                  id: Date.now().toString(),
                                  time: '00:00',
                                  description: 'New Activity',
                              },
                          ],
                      }
                    : day
            ),
        }));

    const removeItem = (dayId, itemId) =>
        setItineraryData(prev => ({
            ...prev,
            days: prev.days.map(day =>
                day.id === dayId
                    ? {
                          ...day,
                          items: day.items.filter(item => item.id !== itemId),
                      }
                    : day
            ),
        }));

    const updateItem = (dayId, itemId, updates) =>
        setItineraryData(prev => ({
            ...prev,
            days: prev.days.map(day =>
                day.id === dayId
                    ? {
                          ...day,
                          items: day.items.map(item =>
                              item.id === itemId
                                  ? { ...item, ...updates }
                                  : item
                          ),
                      }
                    : day
            ),
        }));

    // ── Mode switching ────────────────────────────────────────────────────────
    const switchToSingleDay = () => {
        setMultiDayBackup(itineraryData);
        if (singleDayBackup) {
            setItineraryData({
                ...singleDayBackup,
                variant: itineraryData.variant,
            });
        } else {
            const firstDay = itineraryData.days[0] || {
                id: `day-${Date.now()}`,
                title: 'Day 1',
                items: [],
            };
            setItineraryData({
                ...itineraryData,
                days: [{ ...firstDay, title: 'Day 1', date: '' }],
            });
        }
    };

    const switchToMultiDay = () => {
        setSingleDayBackup(itineraryData);
        if (multiDayBackup?.days.length > 1) {
            const restoredDays = [...multiDayBackup.days];
            const currentSingle = itineraryData.days[0];
            if (restoredDays.length && currentSingle) {
                restoredDays[0] = {
                    ...restoredDays[0],
                    items: currentSingle.items,
                };
            }
            setItineraryData({
                ...multiDayBackup,
                days: restoredDays,
                variant: itineraryData.variant,
            });
        } else if (itineraryData.days.length === 0) {
            addDay();
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <BlockEditWrapper
            isAdmin={isAdmin}
            isEditMode={isEditMode}
            onEdit={() => setIsEditing(true)}>
            {/* Unique rendering injected by each variant */}
            {children({ itineraryData })}

            {/* Shared edit form sheet */}
            <ItineraryForm
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                itineraryData={itineraryData}
                setItineraryData={setItineraryData}
                handleSave={handleSave}
                handleCancel={handleCancel}
                addDay={addDay}
                removeDay={removeDay}
                updateDay={updateDay}
                addItem={addItem}
                removeItem={removeItem}
                updateItem={updateItem}
                switchToSingleDay={switchToSingleDay}
                switchToMultiDay={switchToMultiDay}
                watchedVariant={
                    itineraryData.variant ||
                    blockData?.variant ||
                    defaultVariant
                }
                isLayoutModalOpen={isLayoutModalOpen}
                setIsLayoutModalOpen={setIsLayoutModalOpen}
                currentLayoutOptions={BLOCK_METADATA.ITINERARY.variants}
                trip={trip}
                onUpdate={onUpdate}
            />
        </BlockEditWrapper>
    );
};

