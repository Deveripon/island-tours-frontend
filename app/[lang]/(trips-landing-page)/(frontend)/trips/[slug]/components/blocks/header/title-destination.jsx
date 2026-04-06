'use client';
import { useAdmin } from '@/app/[lang]/(trips-landing-page)/hooks/useAdmin';
import { updateTrip } from '@/app/_actions/trips/affiliateTripsAction';
import { Location01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useState } from 'react';
import ReviewWithStar from '../../../../components/review-with-star';
import { BlockEditWrapper } from '../common/block-edit-wrapper';
import { useBlockEditState } from '../context/block-edit-context';
import { HeaderForm } from './header-form';

const TitleDestination = ({ trip, data: blockData, id, isBlock = false }) => {
    const { mode, MODES, isAdmin } = useAdmin();
    // Use the hook for block edit state
    const { isEditing, setIsEditing, onUpdate } = useBlockEditState(id);
    const isEditMode = mode === MODES.edit;

    // For block mode, we might want to store more than just the title if we expand this block
    // but for now, TitleDestination mainly edits the title.
    // The previous code only had `editedTitle`.
    // Let's stick to that for now, but be aware blockData might contain more.

    const [editedTitle, setEditedTitle] = useState(() => {
        if (isBlock && blockData) {
            return blockData.title || trip?.title || '';
        }
        return trip?.title || '';
    });

    useEffect(() => {
        if (isBlock && blockData) {
            setEditedTitle(blockData.title || trip?.title || '');
        } else {
            setEditedTitle(trip?.title || '');
        }
    }, [trip, blockData, isBlock]);

    const handleSave = async () => {
        if (isBlock) {
            onUpdate({ ...blockData, title: editedTitle });
            setIsEditing(false);
            return;
        }

        const result = await updateTrip(trip?.id, {
            title: editedTitle,
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        if (isBlock && blockData) {
            setEditedTitle(blockData.title || trip?.title || '');
        } else {
            setEditedTitle(trip?.title || '');
        }
        setIsEditing(false);
    };

    return (
        <BlockEditWrapper
            isEditMode={isEditMode}
            isAdmin={isAdmin}
            onEdit={() => setIsEditing(true)}>
            {/* Content - consistent layout */}
            <div className='space-y-3 '>
                <h1 className='text-lg md:text-2xl max-w-full text-wrap font-bold tracking-tight text-foreground'>
                    {isBlock ? editedTitle : trip?.title}
                </h1>

                <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                    <ReviewWithStar trip={trip} />
                    <div className='flex items-center gap-1.5'>
                        <HugeiconsIcon
                            icon={Location01Icon}
                            size={16}
                            className='text-muted-foreground'
                        />
                        <span className='text-foreground'>
                            {trip?.destination?.name}
                        </span>
                    </div>
                </div>
            </div>

            <HeaderForm
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                editedTitle={editedTitle}
                setEditedTitle={setEditedTitle}
                handleSave={handleSave}
                handleCancel={handleCancel}
            />
        </BlockEditWrapper>
    );
};

export default TitleDestination;


