'use client';

import { updateAffiliateTripById } from '@/app/_actions/trips/affiliateTripsAction';
import { UserIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useAdmin } from '../../../../../../hooks/useAdmin';
import { BLOCK_METADATA } from '../block-registry';
import { BlockEditWrapper } from '../common/block-edit-wrapper';
import { useBlockEditState } from '../context/block-edit-context';
import { TeamForm } from './team-form';

// ---------------------------------------------------------------------------
// Static fallback team members (module-level — never changes)
// ---------------------------------------------------------------------------
const DEFAULT_TEAM = [
    {
        name: 'Alex Younes',
        role: 'Founder & CEO',
        image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    },
    {
        name: 'Sarah Jenkins',
        role: 'Lead Guide',
        image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    },
    {
        name: 'Michael Chen',
        role: 'Logistics Manager',
        image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    },
    {
        name: 'Emily Rose',
        role: 'Experience Designer',
        image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    },
];

const DEFAULT_TITLE = 'An Excellent Team Of Specialists';
const DEFAULT_SUBTITLE =
    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.";

// ---------------------------------------------------------------------------
// Helper — resolve member image to an object shape for the form
// ---------------------------------------------------------------------------
const formatMemberForForm = member => ({
    ...member,
    image:
        typeof member.image === 'string'
            ? { url: member.image, id: member.image }
            : member.image,
});

// ---------------------------------------------------------------------------
// Helper — serialise form member back to plain data for persistence
// ---------------------------------------------------------------------------
const serializeMember = member => ({
    name: member.name,
    role: member.role,
    image: member.image?.url || member.image || '',
});

// ===========================================================================
// TeamBlockWrapper
//
// Owns ALL shared logic. Renders:
//   • BlockEditWrapper shell
//   • children({ watchedMembers, watchedTitle, watchedSubtitle }) — unique UI
//   • TeamForm edit sheet
//
// Props:
//   children(ctx)  — render-prop that receives the watched form values + member util
//   defaultVariant — 'grid' | 'slider'
// ===========================================================================
export const TeamBlockWrapper = ({
    trip,
    data: blockData,
    id,
    isBlock = false,
    preview = false,
    defaultVariant = 'grid',
    children,
}) => {
    const { isAdmin, mode, MODES } = useAdmin();
    const isEditMode = !preview && mode === MODES.edit;

    const { isEditing, setIsEditing, onUpdate } = useBlockEditState(id);
    const [openEditItem, setOpenEditItem] = useState(null);
    const [isLayoutModalOpen, setIsLayoutModalOpen] = useState(false);

    // ── Form ─────────────────────────────────────────────────────────────────
    const methods = useForm({
        defaultValues: {
            title: DEFAULT_TITLE,
            subtitle: DEFAULT_SUBTITLE,
            members: [],
            variant: defaultVariant,
        },
    });

    const { control, reset, watch, setValue } = methods;
    const watchedTitle = watch('title');
    const watchedSubtitle = watch('subtitle');
    const watchedMembers = watch('members');
    const watchedVariant = watch('variant');
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'members',
    });

    // ── Initialise form from source data ─────────────────────────────────────
    useEffect(() => {
        const source =
            isBlock && blockData
                ? blockData
                : trip?.userAddedOptions?.teamSection;

        const members = source?.members ?? trip?.teamMembers ?? DEFAULT_TEAM;

        reset({
            title: source?.title || DEFAULT_TITLE,
            subtitle: source?.subtitle || DEFAULT_SUBTITLE,
            variant: source?.variant || defaultVariant,
            members: members.map(formatMemberForForm),
        });
    }, [trip, blockData, isBlock, reset]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Save ─────────────────────────────────────────────────────────────────
    const handleSave = async formData => {
        const cleanData = {
            ...formData,
            members: formData.members.map(serializeMember),
        };

        if (isBlock) {
            onUpdate(cleanData);
        } else {
            try {
                await updateAffiliateTripById(trip?.id, {
                    userAddedOptions: {
                        ...trip?.userAddedOptions,
                        teamSection: cleanData,
                    },
                });
            } catch (err) {
                console.error('Failed to save team section:', err);
            }
        }
        setIsEditing(false);
    };

    // ── Cancel ───────────────────────────────────────────────────────────────
    const handleCancel = () => {
        reset();
        setIsEditing(false);
    };

    // ── Add member ────────────────────────────────────────────────────────────
    const addMember = () => {
        append({ name: 'New Member', role: 'Role', image: null });
        setTimeout(() => setOpenEditItem(fields.length), 0);
    };

    if (!watchedMembers?.length && !isEditMode) return null;

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <BlockEditWrapper
            isEditMode={isEditMode}
            isAdmin={isAdmin}
            onEdit={() => setIsEditing(true)}>
            {/* Unique UI injected by each variant */}
            {children({ watchedTitle, watchedSubtitle, watchedMembers })}

            {/* Shared edit form sheet */}
            <TeamForm
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                methods={methods}
                handleSave={handleSave}
                handleCancel={handleCancel}
                addMember={addMember}
                fields={fields}
                remove={remove}
                openEditItem={openEditItem}
                setOpenEditItem={setOpenEditItem}
                watchedMembers={watchedMembers}
                watchedVariant={watchedVariant}
                isLayoutModalOpen={isLayoutModalOpen}
                setIsLayoutModalOpen={setIsLayoutModalOpen}
                currentLayoutOptions={BLOCK_METADATA.TEAM.variants}
                setValue={setValue}
                trip={trip}
                onUpdate={onUpdate}
            />
        </BlockEditWrapper>
    );
};

// ===========================================================================
// Shared member image resolution utility (used by both grid & slider)
// ===========================================================================
export const getMemberImageUrl = member =>
    member.image?.url ||
    (typeof member.image === 'string' ? member.image : null);

// ===========================================================================
// Shared MemberAvatar placeholder (used by both grid & slider)
// ===========================================================================
export const MemberAvatarPlaceholder = ({ size = 48, className = '' }) => (
    <div
        className={`w-full h-full flex items-center justify-center ${className}`}>
        <HugeiconsIcon icon={UserIcon} size={size} />
    </div>
);

