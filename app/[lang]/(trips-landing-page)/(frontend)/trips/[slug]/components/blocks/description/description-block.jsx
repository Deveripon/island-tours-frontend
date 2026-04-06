'use client';
import { useAdmin } from '@/app/[lang]/(trips-landing-page)/hooks/useAdmin';
import { updateTrip } from '@/app/_actions/trips/affiliateTripsAction';
import MarkdownContent from '@/components/ui/markdown-content';
import { useEffect, useRef, useState } from 'react';
import SectionTitle from '../../section-title';
import { BlockEditWrapper } from '../common/block-edit-wrapper';
import { useBlockEditState } from '../context/block-edit-context';
import { DescriptionForm } from './description-form';

const DescriptionBlock = ({ trip, data: blockData, id, isBlock = false }) => {
    const { isAdmin, mode, MODES } = useAdmin();
    const { isEditing, setIsEditing, onUpdate } = useBlockEditState(id);
    const isEditMode = mode === MODES.edit;
    const [description, setDescription] = useState(
        blockData.description ?? trip?.fullDescription ?? ''
    );
    const [title, setTitle] = useState(
        blockData.title ??
            trip?.userAddedOptions?.descriptionBlock?.title ??
            'Full Description'
    );
    const isEditingRef = useRef(isEditing);
    isEditingRef.current = isEditing;

    useEffect(() => {
        // Only update local state if we are NOT editing
        if (isEditingRef.current) return;

        if (isBlock && blockData) {
            setDescription(
                blockData.description ?? trip?.fullDescription ?? ''
            );
            setTitle(
                blockData.title ??
                    trip?.userAddedOptions?.descriptionBlock?.title ??
                    'Full Description'
            );
        } else {
            setDescription(trip?.fullDescription || '');
            setTitle(
                trip?.userAddedOptions?.descriptionBlock?.title ||
                    'Full Description'
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blockData, isBlock]);

    const handleSave = async (newDescription, newTitle) => {
        if (isBlock) {
            onUpdate({ description: newDescription, title: newTitle });
            setIsEditing(false);
            setDescription(newDescription);
            setTitle(newTitle);
            return;
        }

        try {
            await updateTrip(trip?.id, {
                fullDescription: newDescription,
                userAddedOptions: {
                    ...trip?.userAddedOptions,
                    descriptionBlock: {
                        title: newTitle,
                    },
                },
            });
            setDescription(newDescription);
            setTitle(newTitle);
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving trip description:', error);
        }
    };

    const handleCancel = () => {
        if (isBlock && blockData) {
            setDescription(
                blockData.description ?? trip?.fullDescription ?? ''
            );
            setTitle(
                blockData.title ??
                    trip?.userAddedOptions?.descriptionBlock?.title ??
                    'Full Description'
            );
        } else {
            setDescription(trip?.fullDescription || '');
            setTitle(
                trip?.userAddedOptions?.descriptionBlock?.title ||
                    'Full Description'
            );
        }
        setIsEditing(false);
    };

    return (
        <BlockEditWrapper
            isEditMode={isEditMode}
            isAdmin={isAdmin}
            onEdit={() => setIsEditing(true)}>
            <div className='description-block space-y-4'>
                <SectionTitle className='text-2xl sm:text-3xl'>
                    {title}
                </SectionTitle>

                <MarkdownContent content={description || ''} />
            </div>
            <DescriptionForm
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                description={description}
                title={title}
                setDescription={setDescription}
                setTitle={setTitle}
                handleSave={handleSave}
                handleCancel={handleCancel}
            />
        </BlockEditWrapper>
    );
};

export default DescriptionBlock;

