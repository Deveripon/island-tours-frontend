import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDown01Icon, Ticket01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useFormContext } from 'react-hook-form';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState } from 'react';
import BookingFormPreview from '../../../(trips)/create-affiliate-trips/components/trip-package/pricing/form-preview/booking-form-preview';
import { EditableSelectField } from '../../../(user)/profile/components/editable-select-field';

const BookingFormSelection = ({
    control,
    editingField,
    setEditingField,
    handleSaveField,
    isSaving,
    resetField }) => {
    const { watch } = useFormContext();
    const bookingForm = watch('bookingForm');
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Card className='!p-0 overflow-hidden'>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CardHeader className='flex justify-between items-center h-[64px]'>
                    <CollapsibleTrigger className='flex items-center  justify-between w-full hover:no-underline'>
                        <CardTitle className='flex items-center  gap-2'>
                            <HugeiconsIcon icon={Ticket01Icon} size={20} />
                            Booking Form Style
                        </CardTitle>
                        <div className='hover:bg-accent transform transition duration-200 flex items-center gap-2 rounded-full'>
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
                    <CardContent className=''>
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-x-8'>
                            <div className='col-span-1'>
                                <EditableSelectField
                                    id='bookingForm'
                                    label='Booking Form'
                                    control={control}
                                    options={[
                                        {
                                            label: 'Booking Form v1',
                                            value: 'v1',
                                        },
                                        {
                                            label: 'Booking Form v2',
                                            value: 'v2',
                                        },
                                        {
                                            label: 'Booking Form v3',
                                            value: 'v3',
                                        },
                                        {
                                            label: 'Booking Form v4',
                                            value: 'v4',
                                        },
                                    ]}
                                    defaultValue='v2'
                                    editingField={editingField}
                                    setEditingField={setEditingField}
                                    onSaveField={handleSaveField}
                                    isSaving={isSaving}
                                    resetField={resetField}
                                />
                            </div>
                            <BookingFormPreview bookingForm={bookingForm} />
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
};

export default BookingFormSelection;
