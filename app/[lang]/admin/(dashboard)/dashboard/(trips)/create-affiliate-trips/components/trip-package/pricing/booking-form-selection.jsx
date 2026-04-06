import { getSiteInfo } from '@/app/_actions/settingsActions';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowDown01Icon, Ticket01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import BookingFormPreview from './form-preview/booking-form-preview';

const BookingFormSelection = () => {
    const { control, watch, setValue } = useFormContext();
    const params = useParams();
    const [isOpen, setIsOpen] = useState(false);

    const bookingForm = watch('bookingForm');
    useEffect(() => {
        const getSiteInfoData = async () => {
            try {
                const siteInfo = await getSiteInfo();
                setValue(
                    'bookingForm',
                    bookingForm || siteInfo?.result?.data?.bookingForm || 'v2'
                );
            } catch (error) {
                console.error('Error fetching site info:', error);
                setValue('bookingForm', 'v2');
            }
        };

        getSiteInfoData();
    }, [setValue]);

    return (
        <Card className='p-0'>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger className='flex p-5 items-center hover:bg-muted/50 justify-between w-full hover:no-underline [&[data-state=open]>svg]:rotate-180'>
                    <CardTitle className='flex items-center gap-2'>
                        <HugeiconsIcon
                            icon={Ticket01Icon}
                            className='w-5 h-5'
                        />
                        Booking Form Style
                    </CardTitle>
                    <div
                        className='
                        hover:bg-muted p-2 transform transition duration-200 flex items-center gap-2 rounded-full
                        '>
                        <HugeiconsIcon
                            icon={ArrowDown01Icon}
                            className='h-4 w-4  transition-transform duration-200'
                        />
                    </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <CardContent>
                        <div className='grid py-4 grid-cols-1 lg:grid-cols-3 gap-x-8'>
                            <div className='col-span-1'>
                                <FormField
                                    control={control}
                                    name='bookingForm'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Booking Form Version
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select Booking Form Style' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value='v1'>
                                                        Booking Form v1
                                                    </SelectItem>
                                                    <SelectItem value='v2'>
                                                        Booking Form v2
                                                    </SelectItem>
                                                    <SelectItem value='v3'>
                                                        Booking Form v3
                                                    </SelectItem>
                                                    <SelectItem value='v4'>
                                                        Booking Form v4
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                How your booking form will look
                                                like
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
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

