'use client';
import { updateAffiliateTripById } from '@/app/_actions/trips/affiliateTripsAction';
import { cn } from '@/lib/utils';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAdmin } from '../../../../../../hooks/useAdmin';
import SectionTitle from '../../section-title';
import { BlockEditWrapper } from '../common/block-edit-wrapper';
import { useBlockEditState } from '../context/block-edit-context';
import { FAQForm } from './faq-form';

const TripFAQ = ({ trip, data: blockData, id, isBlock = false }) => {
    const { isAdmin, mode, MODES } = useAdmin();
    // Use the hook for block edit state
    const { isEditing, setIsEditing, onUpdate } = useBlockEditState(id);
    const isEditMode = mode === MODES.edit;
    const [openItem, setOpenItem] = useState(null); // For UI accordion
    const [openEditItem, setOpenEditItem] = useState(null); // For Sheet accordion

    const defaultFaqs = [
        {
            question: 'What should I bring?',
            answer: 'Sunscreen, comfortable walking shoes, and a camera are highly recommended.',
        },
        {
            question: 'Is lunch included?',
            answer: 'Yes, a traditional local lunch is included in the tour package.',
        },
    ];

    const [data, setData] = useState(() => {
        if (isBlock && blockData) {
            return {
                title: blockData.title || 'Frequently Asked Questions',
                shortDescription: blockData.shortDescription || '',
                faqs: blockData.faqs || defaultFaqs,
            };
        }
        return {
            title:
                trip?.userAddedOptions?.faqsSection?.title ||
                'Frequently Asked Questions',
            shortDescription:
                trip?.userAddedOptions?.faqsSection?.shortDescription || '',
            faqs:
                trip?.userAddedOptions?.faqsSection?.faqs ||
                trip?.faqs ||
                defaultFaqs,
        };
    });

    useEffect(() => {
        if (isBlock && blockData) {
            setData({
                title: blockData.title || 'Frequently Asked Questions',
                shortDescription: blockData.shortDescription || '',
                faqs: blockData.faqs || defaultFaqs,
            });
        } else if (trip) {
            setData({
                title:
                    trip?.userAddedOptions?.faqsSection?.title ||
                    'Frequently Asked Questions',
                shortDescription:
                    trip?.userAddedOptions?.faqsSection?.shortDescription || '',
                faqs:
                    trip?.userAddedOptions?.faqsSection?.faqs ||
                    trip?.faqs ||
                    defaultFaqs,
            });
        }
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
                faqsSection: data,
            },
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        if (isBlock && blockData) {
            setData({
                title: blockData.title || 'Frequently Asked Questions',
                shortDescription: blockData.shortDescription || '',
                faqs: blockData.faqs || defaultFaqs,
            });
        } else {
            setData({
                title:
                    trip?.userAddedOptions?.faqsSection?.title ||
                    'Frequently Asked Questions',
                shortDescription:
                    trip?.userAddedOptions?.faqsSection?.shortDescription || '',
                faqs:
                    trip?.userAddedOptions?.faqsSection?.faqs ||
                    trip?.faqs ||
                    defaultFaqs,
            });
        }
        setIsEditing(false);
    };

    const addFaq = () => {
        const newFaqs = [
            ...data.faqs,
            { question: 'New Question', answer: 'New Answer' },
        ];
        setData({
            ...data,
            faqs: newFaqs,
        });
        setOpenEditItem(newFaqs.length - 1);
    };

    const removeFaq = (e, index) => {
        e.stopPropagation();
        const newFaqs = [...data.faqs];
        newFaqs.splice(index, 1);
        setData({ ...data, faqs: newFaqs });
        if (openEditItem === index) setOpenEditItem(null);
        else if (openEditItem > index) setOpenEditItem(openEditItem - 1);
    };

    const updateFaq = (index, field, value) => {
        const newFaqs = [...data.faqs];
        newFaqs[index] = { ...newFaqs[index], [field]: value };
        setData({ ...data, faqs: newFaqs });
    };

    if (!data.faqs || data.faqs.length === 0) {
        if (!isEditMode) return null;
    }

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

            <div className='w-full space-y-2'>
                {data.faqs?.map((item, index) => {
                    const isOpen = openItem === index;
                    return (
                        <div
                            key={index}
                            className='border-b border-border last:border-0'>
                            <button
                                onClick={() =>
                                    setOpenItem(isOpen ? null : index)
                                }
                                className='w-full flex items-center justify-between py-5 text-left group/trigger transition-all'>
                                <span
                                    className={cn(
                                        'text-base md:text-lg font-medium transition-colors',
                                        isOpen
                                            ? 'text-primary'
                                            : 'text-foreground group-hover/trigger:text-primary'
                                    )}>
                                    {item.question}
                                </span>
                                <motion.div
                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                    transition={{
                                        duration: 0.3,
                                        ease: 'easeInOut',
                                    }}
                                    className='text-muted-foreground group-hover/trigger:text-primary'>
                                    <HugeiconsIcon
                                        icon={ArrowDown01Icon}
                                        size={20}
                                    />
                                </motion.div>
                            </button>
                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{
                                            duration: 0.4,
                                            ease: [0.04, 0.62, 0.23, 0.98],
                                        }}
                                        className='overflow-hidden'>
                                        <div className='pb-6 text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap md:max-w-[90%]'>
                                            {item.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            <FAQForm
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                data={data}
                setData={setData}
                handleSave={handleSave}
                handleCancel={handleCancel}
                addFaq={addFaq}
                removeFaq={removeFaq}
                updateFaq={updateFaq}
                openEditItem={openEditItem}
                setOpenEditItem={setOpenEditItem}
            />
        </BlockEditWrapper>
    );
};

export default TripFAQ;

