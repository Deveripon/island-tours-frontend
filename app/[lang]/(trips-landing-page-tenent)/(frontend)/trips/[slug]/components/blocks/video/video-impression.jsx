'use client';
import { updateAffiliateTripById } from '@/app/_actions/trips/affiliateTripsAction';
import { useEffect, useState } from 'react';
import { useAdmin } from '../../../../../../hooks/useAdmin';
import { extractSrcFromIframe } from '../../../../../../utils';
import SectionTitle from '../../section-title';
import { BlockEditWrapper } from '../common/block-edit-wrapper';
import { useBlockEditState } from '../context/block-edit-context';
import { VideoForm } from './video-form';

const VideoImpression = ({ trip, data: blockData, id, isBlock = false }) => {
    const { mode, MODES, isAdmin } = useAdmin();
    // Use the hook for block edit state
    const { isEditing, setIsEditing, onUpdate } = useBlockEditState(id);
    const isEditMode = mode === MODES.edit;

    const getInitialData = () => {
        if (isBlock && blockData) {
            return {
                title: blockData.title || 'Video Impression',
                shortDescription: blockData.shortDescription || '',
                videoIframe:
                    blockData.videoIframe ||
                    'https://www.youtube.com/embed/3OYHXscc8Xs',
            };
        }
        return {
            title:
                trip?.userAddedOptions?.videoSection?.title ||
                'Video Impression',
            shortDescription:
                trip?.userAddedOptions?.videoSection?.shortDescription || '',
            videoIframe:
                trip?.userAddedOptions?.videoSection?.videoIframe ||
                trip?.embededVideoUrl ||
                'https://www.youtube.com/embed/3OYHXscc8Xs',
        };
    };

    const [data, setData] = useState(getInitialData);

    useEffect(() => {
        setData(getInitialData());
    }, [trip, blockData, isBlock]);

    const handleSave = async () => {
        if (isBlock) {
            onUpdate(data);
            setIsEditing(false);
            return;
        }

        await updateAffiliateTripById(trip?.id, {
            userAddedOptions: {
                ...trip?.userAddedOptions,
                videoSection: {
                    title: data.title,
                    shortDescription: data.shortDescription,
                    videoIframe: data.videoIframe,
                },
            },
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setData(getInitialData());
        setIsEditing(false);
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
                <p className='text-muted-foreground mb-8 text-sm sm:text-base max-w-3xl leading-relaxed'>
                    {data.shortDescription}
                </p>
            )}

            <div className='relative w-full h-0 pb-[56.25%] overflow-hidden rounded-lg shadow-lg bg-black'>
                <iframe
                    className='absolute top-0 left-0 w-full h-full'
                    src={
                        extractSrcFromIframe(data.videoIframe) ||
                        'https://www.youtube.com/embed/3OYHXscc8Xs'
                    }
                    title={data.title || 'Video Impression'}
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    referrerPolicy='strict-origin-when-cross-origin'
                    allowFullScreen
                />
            </div>

            <VideoForm
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

export default VideoImpression;

