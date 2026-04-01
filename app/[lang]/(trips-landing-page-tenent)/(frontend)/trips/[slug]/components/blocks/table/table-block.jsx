'use client';

import { useAdmin } from '@/app/[lang]/(trips-landing-page-tenent)/hooks/useAdmin';
import { updateAffiliateTripById } from '@/app/_actions/trips/affiliateTripsAction';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { useEffect, useState } from 'react';
import { iconMapping } from '../../../config/trip-icons';
import SectionTitle from '../../section-title';
import { BlockEditWrapper } from '../common/block-edit-wrapper';
import { IconPicker } from '../common/icon-picker';
import { useBlockEditState } from '../context/block-edit-context';
import { TableForm } from './table-form';

const TripFallbackData = trip => {
    return {
        title: 'Tour Information',
        description: '',
        headers: [
            { id: 'col1', label: 'Feature' },
            { id: 'col2', label: 'Details' },
        ],
        rows: [
            {
                id: 'f1',
                type: 'row',
                icon: 'MapPin',
                values: {
                    col1: 'Departure Point',
                    col2: 'Mood Beach, Mambo Boulevard',
                },
            },
            {
                id: 'f2',
                type: 'row',
                icon: 'Clock',
                values: { col1: 'Departure Time', col2: '10:30 AM' },
            },
            {
                id: 'f3',
                type: 'row',
                icon: 'CalendarDays',
                values: { col1: 'Departure Days', col2: 'Every Monday' },
            },
            {
                id: 'f4',
                type: 'row',
                icon: 'Timer',
                values: { col1: 'Duration', col2: '~ 8.5 hours' },
            },
            {
                id: 'f5',
                type: 'row',
                icon: 'Watch',
                values: { col1: 'Return', col2: '6:30 PM' },
            },
            {
                id: 'f6',
                type: 'row',
                icon: 'Info',
                values: {
                    col1: 'Details',
                    col2: 'Departs later than other tours and sails back during sunset',
                },
            },
            {
                id: 'f7',
                type: 'row',
                icon: 'Users',
                values: { col1: 'Adults', col2: '€134' },
            },
            {
                id: 'f8',
                type: 'row',
                icon: 'Baby',
                values: { col1: 'Children (4-12 years)', col2: '€67' },
            },
            {
                id: 'f9',
                type: 'header',
                label: 'Optional extras (at an additional fee)',
            },
            {
                id: 'f10',
                type: 'row',
                icon: 'Wine',
                values: { col1: 'Open Bar with Alcohol', col2: 'Included' },
            },
            {
                id: 'f11',
                type: 'row',
                icon: 'Beer',
                values: { col1: 'Cocktail Bar', col2: 'Available' },
            },
            { id: 'f12', type: 'header', label: 'Cancellation policy' },
            {
                id: 'f13',
                type: 'row',
                icon: 'CheckCircle',
                values: {
                    col1: 'Free cancellation',
                    col2: 'Up to 24 hours before the tour',
                },
            },
        ],
    };
};

const migrateData = (rawData, fallback) => {
    if (!rawData) return fallback;

    const data = { ...fallback, ...rawData };

    // Migrate headers
    if (!Array.isArray(data.headers)) {
        data.headers = [
            { id: 'col1', label: rawData.headers?.label || 'Feature' },
            { id: 'col2', label: rawData.headers?.value || 'Details' },
        ];
    }

    // Migrate rows
    data.rows =
        data.rows?.map(row => {
            if (row.type === 'header') return row;
            if (
                !row.values &&
                (row.label !== undefined || row.value !== undefined)
            ) {
                return {
                    ...row,
                    values: {
                        col1: row.label || '',
                        col2: row.value || '',
                    },
                };
            }
            return row;
        }) || [];

    return data;
};

const TableBlock = ({ trip, data: blockData, id, isBlock = false }) => {
    const { isAdmin, mode, MODES } = useAdmin();
    const { isEditing, setIsEditing, onUpdate } = useBlockEditState(id);
    const isEditMode = mode === MODES.edit;

    const [data, setData] = useState(() => {
        const fallback = TripFallbackData(trip);
        const source =
            isBlock && blockData
                ? blockData
                : trip?.userAddedOptions?.tableBlock;
        return migrateData(source, fallback);
    });

    // Sync with props
    useEffect(() => {
        if (isEditing) return;
        const fallback = TripFallbackData(trip);
        const source =
            isBlock && blockData
                ? blockData
                : trip?.userAddedOptions?.tableBlock;
        setData(migrateData(source, fallback));
    }, [trip, blockData, isBlock, isEditing]);

    const handleSave = async newData => {
        if (isBlock) {
            onUpdate(newData);
            setData(newData);
            setIsEditing(false);
            return;
        }

        try {
            await updateAffiliateTripById(trip?.id, {
                userAddedOptions: {
                    ...trip?.userAddedOptions,
                    tableBlock: newData,
                },
            });
            setData(newData);
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving table block:', error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const columnCount = data.headers?.length || 1;
    const gridStyle = {
        gridTemplateColumns:
            columnCount === 1
                ? '1fr'
                : columnCount === 2
                  ? '1.2fr 1.8fr'
                  : `repeat(${columnCount}, 1fr)`,
    };

    const updateRowIcon = (rowIndex, newIcon) => {
        const newRows = [...data.rows];
        newRows[rowIndex] = { ...newRows[rowIndex], icon: newIcon };
        handleSave({ ...data, rows: newRows });
    };

    return (
        <BlockEditWrapper
            isEditMode={isEditMode}
            isAdmin={isAdmin}
            onEdit={() => setIsEditing(true)}>
            <div className='table-block space-y-6 py-4'>
                <div className='space-y-4'>
                    {data.title && (
                        <SectionTitle className='text-2xl sm:text-3xl'>
                            {data.title}
                        </SectionTitle>
                    )}
                    {data.description && (
                        <p className='text-muted-foreground text-center max-w-2xl mx-auto text-lg font-medium'>
                            {data.description}
                        </p>
                    )}
                </div>

                <div className='border border-border rounded-2xl overflow-hidden shadow-sm dark:bg-card transition-all hover:shadow-md'>
                    <div
                        className='grid divide-y divide-border'
                        style={gridStyle}>
                        {/* Table Header */}
                        {data.headers && data.headers.length > 0 && (
                            <div
                                className='grid grid-cols-subgrid col-span-full bg-muted/30 font-black text-[10px]   tracking-wider text-muted-foreground'
                                style={gridStyle}>
                                {data.headers.map((header, idx) => (
                                    <div
                                        key={header.id}
                                        className={cn(
                                            'p-4 px-6',
                                            idx < data.headers.length - 1 &&
                                                'border-r border-border'
                                        )}>
                                        {header.label}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Table Body */}
                        {data.rows &&
                            data.rows.map((row, index) => {
                                if (row.type === 'header') {
                                    return (
                                        <div
                                            key={row.id || index}
                                            className='col-span-full bg-primary/5 p-4 px-6 font-black text-xs border-t first:border-t-0 text-primary   tracking-wide'>
                                            {row.label}
                                        </div>
                                    );
                                }

                                const Icon = row.icon
                                    ? iconMapping[row.icon] ||
                                      LucideIcons[row.icon]
                                    : null;

                                return (
                                    <div
                                        key={row.id || index}
                                        className='grid grid-cols-subgrid col-span-full hover:bg-primary/[0.02] transition-colors group'
                                        style={gridStyle}>
                                        {data.headers.map((header, idx) => {
                                            const cellValue =
                                                row.values?.[header.id] || '';

                                            // First column gets the icon
                                            if (idx === 0) {
                                                return (
                                                    <div
                                                        key={header.id}
                                                        className='p-4 px-6 text-sm font-bold text-muted-foreground border-r border-border flex items-center gap-3 group-hover:text-foreground transition-colors'>
                                                        {isEditMode ? (
                                                            <IconPicker
                                                                value={row.icon}
                                                                onChange={newIcon =>
                                                                    updateRowIcon(
                                                                        index,
                                                                        newIcon
                                                                    )
                                                                }
                                                                className='w-8 h-8 shrink-0'
                                                            />
                                                        ) : (
                                                            <div className='w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center group-hover:border-primary/20 group-hover:bg-primary/5 transition-all shadow-sm shrink-0'>
                                                                {Icon && (
                                                                    <Icon className='w-4 h-4 text-primary shrink-0 transition-transform group-hover:scale-110' />
                                                                )}
                                                            </div>
                                                        )}
                                                        <span className='line-clamp-2'>
                                                            {cellValue}
                                                        </span>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div
                                                    key={header.id}
                                                    className={cn(
                                                        'p-4 px-6 text-sm text-foreground font-semibold flex items-center leading-relaxed',
                                                        idx <
                                                            data.headers
                                                                .length -
                                                                1 &&
                                                            'border-r border-border'
                                                    )}>
                                                    {cellValue}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}

                        {(!data.rows || data.rows.length === 0) && (
                            <div className='col-span-full p-12 text-center text-muted-foreground text-sm italic bg-accent/5'>
                                No information added yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <TableForm
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                data={data}
                setData={setData}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        </BlockEditWrapper>
    );
};

export default TableBlock;

