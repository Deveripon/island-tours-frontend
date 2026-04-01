import { useAdmin } from '@/app/[lang]/(trips-landing-page-tenent)/hooks/useAdmin';
import { useState } from 'react';
import { BlockEditWrapper } from '../common/block-edit-wrapper';
import { useBlockEditState } from '../context/block-edit-context';
import CTAButtonForm from './CTAButton-form';
import BookingCTAButton from './booking-cta-button';

const CTAButton = ({
    trip,
    tenantId,
    data: blockData,
    id,
    isBlock = false,
}) => {
    const { mode, MODES, isAdmin } = useAdmin();
    const isEditMode = mode === MODES.edit;
    const { isEditing, setIsEditing, onUpdate } = useBlockEditState(id);
    const defaultData = {
        title: 'Book Your Adventure',
        description: 'Ready to experience the thrill? Book your trip now!',
        buttonText: 'Book Now',
        link: '#sidebar',
    };

    const initialData = {
        title: blockData?.title || defaultData.title,
        description: blockData?.description || defaultData.description,
        buttonText: blockData?.buttonText || defaultData.buttonText,
        link: blockData?.link || defaultData.link,
    };

    const [editedData, setEditedData] = useState(initialData);

    const handleSave = () => {
        if (isBlock) {
            onUpdate({ ...blockData, ...editedData });
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditedData(initialData);
        setIsEditing(false);
    };

    return (
        <BlockEditWrapper
            isEditMode={isEditMode}
            isAdmin={isAdmin}
            onEdit={() => setIsEditing(true)}>
            <BookingCTAButton
                title={editedData.title}
                description={editedData.description}
                buttonText={editedData.buttonText}
                link={editedData.link}
            />
            <CTAButtonForm
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                editedData={editedData}
                setEditedData={setEditedData}
                handleSave={handleSave}
                handleCancel={handleCancel}
            />
        </BlockEditWrapper>
    );
};

export default CTAButton;

