'use client';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import ActivityForm from './activity-form';

const ActivitiesFormSection = ({
    open,
    onOpenChange,
    editactivities,
    setEditactivities,
    destinations }) => {
    return (
        <Sheet
            open={open}
            onOpenChange={() => {
                onOpenChange(false);
                setEditactivities(null);
            }}>
            <SheetContent className='sm:max-w-2xl p-4 overflow-y-auto'>
                <SheetHeader>
                    <SheetTitle className='text-xl font-semibold'>
                        {editactivities ? 'Edit Activity' : 'Add New Activity'}
                    </SheetTitle>
                    <SheetDescription className='text-sm text-muted-foreground'>
                        {editactivities
                            ? 'Update the activity details below'
                            : 'Fill in the details to create a new activity'}
                    </SheetDescription>
                </SheetHeader>

                <div className='p-5'>
                    <ActivityForm
                        editactivities={editactivities}
                        setEditactivities={setEditactivities}
                        onOpenChange={() => onOpenChange(false)}
                        destinations={destinations}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default ActivitiesFormSection;

