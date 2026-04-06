'use client';
import { updateTrip } from '@/app/_actions/trips/affiliateTripsAction';
import { useEffect, useState } from 'react';
import { useAdmin } from '../../../../../../hooks/useAdmin';
import { extractSrcFromIframe } from '../../../../../../utils';
import SectionTitle from '../../section-title';
import { BlockEditWrapper } from '../common/block-edit-wrapper';
import { useBlockEditState } from '../context/block-edit-context';
import { MapForm } from './map-form';

const IntegratedMapView = ({
    trip,
    data: blockData,
    id,
    isBlock = false,
    preview = false,
}) => {
    const { isAdmin, mode, MODES } = useAdmin();
    // Force view mode if preview is true
    const isEditMode = !preview && mode === MODES.edit;
    // Use the hook for block edit state
    const { isEditing, setIsEditing, onUpdate } = useBlockEditState(id);

    // Initial data loading
    const [data, setData] = useState(() => {
        if (isBlock && blockData) {
            return {
                title: blockData.title || 'View Details in Map',
                shortDescription: blockData.shortDescription || '',
                iframe: blockData.iframe || '',
            };
        }
        return {
            title:
                trip?.userAddedOptions?.mapView?.title || 'View Details in Map',
            shortDescription:
                trip?.userAddedOptions?.mapView?.shortDescription ||
                trip?.destination?.name ||
                '',
            iframe:
                trip?.userAddedOptions?.mapView?.iframe ||
                trip?.destination?.embededMap ||
                '',
        };
    });

    useEffect(() => {
        if (isBlock && blockData) {
            setData({
                title: blockData.title || 'View Details in Map',
                shortDescription: blockData.shortDescription || '',
                iframe: blockData.iframe || '',
            });
        } else if (trip) {
            setData({
                title:
                    trip?.userAddedOptions?.mapView?.title ||
                    'View Details in Map',
                shortDescription:
                    trip?.userAddedOptions?.mapView?.shortDescription ||
                    trip?.destination?.name ||
                    '',
                iframe:
                    trip?.userAddedOptions?.mapView?.iframe ||
                    trip?.destination?.embededMap ||
                    '',
            });
        }
    }, [trip, blockData, isBlock]);

    const handleSave = async () => {
        if (isBlock) {
            onUpdate(data);
            setIsEditing(false);
            return;
        }

        await updateTrip(trip?.id, {
            userAddedOptions: {
                ...trip?.userAddedOptions,
                mapView: {
                    title: data.title,
                    shortDescription: data.shortDescription,
                    iframe: data.iframe,
                },
            },
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        if (isBlock && blockData) {
            setData({
                title: blockData.title || 'View Details in Map',
                shortDescription: blockData.shortDescription || '',
                iframe: blockData.iframe || '',
            });
        } else {
            setData({
                title:
                    trip?.userAddedOptions?.mapView?.title ||
                    'View Details in Map',
                shortDescription:
                    trip?.userAddedOptions?.mapView?.shortDescription ||
                    trip?.destination?.name ||
                    '',
                iframe:
                    trip?.userAddedOptions?.mapView?.iframe ||
                    trip?.destination?.embededMap ||
                    '',
            });
        }
        setIsEditing(false);
    };

    const getIframeSrc = () => {
        return (
            extractSrcFromIframe(data.iframe) ||
            extractSrcFromIframe(trip?.destination?.embededMap) ||
            ''
        );
    };

    return (
        <BlockEditWrapper
            isEditMode={isEditMode}
            isAdmin={isAdmin}
            onEdit={() => setIsEditing(true)}>
            <SectionTitle className='text-2xl sm:text-3xl'>
                {data.title}
            </SectionTitle>

            {data.shortDescription && (
                <p className='text-muted-foreground mb-6 text-sm sm:text-base max-w-3xl'>
                    {data.shortDescription}
                </p>
            )}

            <div className='relative w-full h-0 pb-[56.25%] overflow-hidden rounded-xl shadow-lg bg-muted'>
                {getIframeSrc() ? (
                    <iframe
                        className='absolute top-0 left-0 w-full h-full'
                        src={getIframeSrc()}
                        title={data.title}
                        frameBorder='0'
                        allowFullScreen
                        referrerPolicy='strict-origin-when-cross-origin'
                    />
                ) : (
                    <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center text-muted-foreground'>
                        No map available
                    </div>
                )}
            </div>

            <MapForm
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                data={data}
                setData={setData}
                handleSave={handleSave}
                handleCancel={handleCancel}
            />
        </BlockEditWrapper>
    );
};

export default IntegratedMapView;

