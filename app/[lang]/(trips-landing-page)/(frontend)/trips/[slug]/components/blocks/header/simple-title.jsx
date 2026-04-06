import { useAdmin } from '@/app/[lang]/(trips-landing-page)/hooks/useAdmin';
import { useState } from 'react';
import SectionTitle from '../../section-title';
import { BlockEditWrapper } from '../common/block-edit-wrapper';
import { useBlockEditState } from '../context/block-edit-context';
import { HeaderForm } from './header-form';
const SimpleTitle = ({ trip, data: blockData, id, isBlock = false }) => {
    const { mode, MODES, isAdmin } = useAdmin();
    const { isEditing, setIsEditing, onUpdate } = useBlockEditState(id);
    const isEditMode = mode === MODES.edit;
    const [editedTitle, setEditedTitle] = useState(
        blockData?.title || 'A Simple Title, Edit to change'
    );
    const handleSave = async () => {
        if (isBlock) {
            onUpdate({ ...blockData, title: editedTitle });
            setIsEditing(false);
            return;
        }
    };

    const handleCancel = () => {
        if (isBlock && blockData) {
            setEditedTitle(blockData.title || 'A Simple Title, Edit to change');
        } else {
            setEditedTitle('A Simple Title, Edit to change');
        }
        setIsEditing(false);
    };
    return (
        <BlockEditWrapper
            isEditMode={isEditMode}
            isAdmin={isAdmin}
            onEdit={() => setIsEditing(true)}>
            <div className='space-y-3'>
                <SectionTitle>{editedTitle}</SectionTitle>
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

export default SimpleTitle;

