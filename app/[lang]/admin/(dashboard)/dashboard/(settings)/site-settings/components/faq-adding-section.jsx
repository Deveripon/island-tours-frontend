import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
    Add01Icon,
    ArrowDown01Icon,
    Delete02Icon,
    HelpCircleIcon,
    WhatsappIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const FAQSection = ({
    control,
    editingField,
    setEditingField,
    handleSaveField,
    isSaving,
    resetField }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [showWhatsApp, setShowWhatsApp] = useState(false);
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [faqs, setFaqs] = useState([
        { id: 1, question: '', answer: '', isOpen: false },
    ]);

    const { watch, setValue, getValues } = useFormContext();
    const initialStateRef = useRef(null);

    // Initialize the ref with initial form values
    useEffect(() => {
        if (initialStateRef.current === null) {
            const initialFaqs = getValues('faqs') || [];
            const initialWhatsappEnabled =
                getValues('enableWhatsappChat') || false;
            const initialWhatsappNum = getValues('whatsappNumber') || '';

            initialStateRef.current = JSON.stringify({
                faqs: initialFaqs,
                whatsappNumber: initialWhatsappNum,
                // Note: enableWhatsappChat is NOT tracked here - it auto-saves
            });

            // Set local state
            if (initialFaqs.length > 0) {
                setFaqs(initialFaqs.map(faq => ({ ...faq, isOpen: false })));
            }
            setShowWhatsApp(initialWhatsappEnabled);
            setWhatsappNumber(initialWhatsappNum);
        }
    }, [getValues]);

    // Sync local state with form values
    useEffect(() => {
        const faqsFromForm = watch('faqs');
        const whatsappEnabled = watch('enableWhatsappChat');
        const whatsappNum = watch('whatsappNumber');

        if (faqsFromForm) {
            setFaqs(
                faqsFromForm.map(faq => ({
                    ...faq,
                    isOpen: faq.isOpen || false }))
            );
        }
        if (whatsappEnabled !== undefined) {
            setShowWhatsApp(whatsappEnabled);
        }
        if (whatsappNum !== undefined) {
            setWhatsappNumber(whatsappNum);
        }
    }, [watch]);

    // Detect changes by comparing current state with initial state
    // Note: enableWhatsappChat is NOT included - it saves immediately on toggle
    useEffect(() => {
        if (initialStateRef.current !== null) {
            const currentState = JSON.stringify({
                faqs: faqs.map(({ isOpen, ...faq }) => faq), // Exclude isOpen from comparison
                whatsappNumber: whatsappNumber });

            const hasChanged = currentState !== initialStateRef.current;
            setHasChanges(hasChanged);
        }
    }, [faqs, whatsappNumber]);

    const addFAQ = () => {
        const newFAQ = {
            id: Date.now(),
            question: '',
            answer: '',
            isOpen: true,
        };
        const updatedFaqs = [...faqs, newFAQ];
        setFaqs(updatedFaqs);
        setValue(
            'faqs',
            updatedFaqs.map(({ isOpen, ...faq }) => faq),
            { shouldDirty: true }
        );
    };

    const removeFAQ = id => {
        const updatedFaqs = faqs.filter(faq => faq.id !== id);
        setFaqs(updatedFaqs);
        setValue(
            'faqs',
            updatedFaqs.map(({ isOpen, ...faq }) => faq),
            { shouldDirty: true }
        );
    };

    const updateFAQ = (id, field, value) => {
        const updatedFaqs = faqs.map(faq =>
            faq.id === id ? { ...faq, [field]: value } : faq
        );
        setFaqs(updatedFaqs);
        setValue(
            'faqs',
            updatedFaqs.map(({ isOpen, ...faq }) => faq),
            { shouldDirty: true }
        );
    };

    const toggleFAQ = id => {
        setFaqs(
            faqs.map(faq =>
                faq.id === id ? { ...faq, isOpen: !faq.isOpen } : faq
            )
        );
    };

    const handleWhatsAppToggle = async checked => {
        // Update local state immediately for responsive UI
        setShowWhatsApp(checked);

        // Update form value
        setValue('enableWhatsappChat', checked, { shouldDirty: true });

        // Save immediately - this handles the backend update
        await handleSaveField('enableWhatsappChat', checked);
    };

    const handleWhatsAppNumberChange = value => {
        setWhatsappNumber(value);
        setValue('whatsappNumber', value, { shouldDirty: true });
    };

    const handleSave = async () => {
        try {
            initialStateRef.current = JSON.stringify({
                faqs: faqs.map(({ isOpen, ...faq }) => faq),
                whatsappNumber: whatsappNumber });

            // Ensure form values are up to date before saving
            const faqsToSave = faqs.map(({ isOpen, ...faq }) => faq);
            setValue('faqs', faqsToSave);
            setValue('whatsappNumber', whatsappNumber);

            // Save FAQ and WhatsApp number fields (NOT enableWhatsappChat - already saved by toggle)
            await handleSaveField('faqs', faqsToSave);
            await handleSaveField('whatsappNumber', whatsappNumber);

            // Update initial state reference after successful save
            initialStateRef.current = JSON.stringify({
                faqs: faqsToSave,
                whatsappNumber: whatsappNumber });

            // Reset changes flag
            setHasChanges(false);
        } catch (error) {
            console.error('Error saving FAQ section:', error);
        }
    };

    const handleCancel = () => {
        // Parse and reset to initial values
        const initialState = JSON.parse(initialStateRef.current);

        setFaqs(
            initialState.faqs.length > 0
                ? initialState.faqs.map(faq => ({ ...faq, isOpen: false }))
                : [{ id: 1, question: '', answer: '', isOpen: false }]
        );
        setWhatsappNumber(initialState.whatsappNumber);

        // Reset form values (Note: enableWhatsappChat is NOT reset - it's already saved)
        setValue('faqs', initialState.faqs);
        setValue('whatsappNumber', initialState.whatsappNumber);

        setHasChanges(false);
    };

    return (
        <Card className='p-0 overflow-hidden'>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CardHeader className='flex justify-between items-center h-[64px]'>
                    <CollapsibleTrigger className='flex items-center justify-between w-full hover:no-underline'>
                        <CardTitle className='flex items-center gap-2'>
                            <HugeiconsIcon icon={HelpCircleIcon} size={20} />
                            FAQ & Contact
                            {hasChanges && (
                                <span className='ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full'>
                                    Unsaved changes
                                </span>
                            )}
                        </CardTitle>
                        <div className='hover:bg-accent p-2 transform transition duration-200 flex items-center gap-2 rounded-full'>
                            <HugeiconsIcon
                                icon={ArrowDown01Icon}
                                size={16}
                                className={cn(
                                    'transition-transform duration-200',
                                    isOpen && 'rotate-180'
                                )}
                            />
                        </div>
                    </CollapsibleTrigger>
                </CardHeader>

                <CollapsibleContent className='py-4'>
                    <CardContent className='space-y-6'>
                        {/* WhatsApp Contact Section */}
                        <div className='space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2'>
                                    <HugeiconsIcon icon={WhatsappIcon} />
                                    <Label
                                        htmlFor='whatsapp-toggle'
                                        className='cursor-pointer'>
                                        Enable WhatsApp Contact
                                    </Label>
                                </div>
                                <Switch
                                    id='whatsapp-toggle'
                                    checked={showWhatsApp}
                                    onCheckedChange={handleWhatsAppToggle}
                                />
                            </div>

                            {showWhatsApp && (
                                <div className='space-y-2 animate-in slide-in-from-top-2'>
                                    <Label htmlFor='whatsapp-number'>
                                        WhatsApp Number
                                    </Label>
                                    <Input
                                        id='whatsapp-number'
                                        type='tel'
                                        placeholder='+1234567890'
                                        value={whatsappNumber}
                                        onChange={e =>
                                            handleWhatsAppNumberChange(
                                                e.target.value
                                            )
                                        }
                                        className='max-w-md'
                                    />
                                    <p className='text-sm text-gray-500'>
                                        Include country code (e.g., +1 for US,
                                        +44 for UK)
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ Section */}
                        <div className='space-y-4'>
                            <div className='flex items-center justify-between'>
                                <h3 className='text-lg font-semibold'>
                                    Frequently Asked Questions
                                </h3>
                                <Button
                                    type='button'
                                    onClick={addFAQ}
                                    size='sm'
                                    variant='outline'
                                    className='gap-2'>
                                    <HugeiconsIcon icon={Add01Icon} size={16} />
                                    Add FAQ
                                </Button>
                            </div>

                            <div className='space-y-3'>
                                {faqs.map((faq, index) => (
                                    <Card
                                        key={faq.id}
                                        className='!p-0 overflow-hidden'>
                                        <Collapsible
                                            open={faq.isOpen}
                                            onOpenChange={() =>
                                                toggleFAQ(faq.id)
                                            }>
                                            <CardHeader className='flex px-4 shadow-none overflow-hidden items-center hover:bg-gray-50 dark:hover:bg-gray-800 justify-between w-full group'>
                                                <CollapsibleTrigger className='flex items-center  justify-between w-full hover:no-underline flex-1 py-3 [&[data-state=open]>svg]:rotate-180 '>
                                                    <span className='text-sm font-medium text-gray-500'>
                                                        FAQ {index + 1}
                                                    </span>
                                                    {faq.question && (
                                                        <span className='text-sm text-gray-700 dark:text-gray-300 truncate'>
                                                            - {faq.question}
                                                        </span>
                                                    )}
                                                    <HugeiconsIcon
                                                        icon={ArrowDown01Icon}
                                                        size={16}
                                                        className='transition-transform duration-200 ml-auto'
                                                    />
                                                </CollapsibleTrigger>
                                                <button
                                                    type='button'
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        removeFAQ(faq.id);
                                                    }}
                                                    className='ml-2 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors'>
                                                    <HugeiconsIcon
                                                        icon={Delete02Icon}
                                                        size={16}
                                                    />
                                                </button>
                                            </CardHeader>

                                            <CollapsibleContent className='py-4'>
                                                <CardContent className='space-y-4'>
                                                    <div className='space-y-2'>
                                                        <Label
                                                            htmlFor={`question-${faq.id}`}>
                                                            Question
                                                        </Label>
                                                        <Input
                                                            id={`question-${faq.id}`}
                                                            placeholder='Enter your question here...'
                                                            value={faq.question}
                                                            onChange={e =>
                                                                updateFAQ(
                                                                    faq.id,
                                                                    'question',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className='space-y-2'>
                                                        <Label
                                                            htmlFor={`answer-${faq.id}`}>
                                                            Answer
                                                        </Label>
                                                        <Textarea
                                                            id={`answer-${faq.id}`}
                                                            placeholder='Enter your answer here...'
                                                            value={faq.answer}
                                                            onChange={e =>
                                                                updateFAQ(
                                                                    faq.id,
                                                                    'answer',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            rows={4}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </Card>
                                ))}
                            </div>

                            {faqs.length === 0 && (
                                <div className='text-center py-8 text-gray-500'>
                                    <HugeiconsIcon
                                        icon={HelpCircleIcon}
                                        size={48}
                                        className='mx-auto mb-2 opacity-50'
                                    />
                                    <p>
                                        No FAQs added yet. Click &apos;Add
                                        FAQ&apos; to get started.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Save/Cancel Buttons */}
                        {hasChanges && (
                            <div className='flex justify-end gap-2 pt-4 border-t'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={handleCancel}
                                    disabled={isSaving}>
                                    Cancel
                                </Button>
                                <Button
                                    type='button'
                                    onClick={handleSave}
                                    disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
};

export default FAQSection;

