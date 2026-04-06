import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    InformationCircleIcon,
    PencilEdit01Icon,
    StarIcon,
    Tag01Icon,
    UserGroupIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { EditingSheetRight } from '../../editing-forms/editing-sheet-right';

export const TourInfoForm = ({
    isEditing,
    setIsEditing,
    data,
    setData,
    handleSave,
    handleCancel,
    tourTypeOptions,
    difficultyOptions,
    suitableForOptions,
    tourStyleOptions,
    updateField,
    handleCheckboxToggle,
}) => {
    return (
        <EditingSheetRight
            side='right'
            className='lg:min-w-[550px] w-full sm:w-[550px] rounded-l-3xl border-l border-border hide-scrollbar'
            open={isEditing}
            onOpenChange={setIsEditing}>
            <div className='h-full flex flex-col bg-background'>
                {/* Premium Header */}
                <div className='sticky top-0 z-20 px-6 py-5 flex justify-between items-center bg-card border-b border-border shadow-sm'>
                    <div className='flex items-center gap-3'>
                        <div className='p-2 bg-primary/10 text-primary rounded-xl'>
                            <HugeiconsIcon icon={Tag01Icon} size={20} />
                        </div>
                        <h3 className='font-black text-xl tracking-tight'>
                            Edit Tour Info
                        </h3>
                    </div>
                    <div className='flex gap-3'>
                        <Button
                            variant='outline'
                            onClick={handleCancel}
                            className='h-10 px-5 font-bold rounded-xl'>
                            Cancel
                        </Button>
                        <Button
                            variant='default'
                            onClick={handleSave}
                            className='h-10 px-5 font-bold rounded-xl shadow-lg shadow-primary/20'>
                            Save
                        </Button>
                    </div>
                </div>

                <div
                    className='flex-1 overflow-y-auto px-6 py-8 space-y-10 hide-scrollbar'
                    data-lenis-prevent>
                    {/* Title & Description */}
                    <div className='space-y-6'>
                        <div className='space-y-2'>
                            <label className='text-xs font-bold text-muted-foreground   tracking-wider flex items-center gap-2'>
                                <HugeiconsIcon
                                    icon={PencilEdit01Icon}
                                    className='w-4 h-4 text-primary'
                                />
                                Section Title
                            </label>
                            <input
                                type='text'
                                value={data.title}
                                onChange={e =>
                                    setData(prev => ({
                                        ...prev,
                                        title: e.target.value,
                                    }))
                                }
                                className='w-full h-12 rounded-2xl border border-border bg-background px-4 py-2 text-base font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
                                placeholder='e.g., Tour Information'
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-xs font-bold text-muted-foreground   tracking-wider flex items-center gap-2'>
                                <HugeiconsIcon
                                    icon={InformationCircleIcon}
                                    className='w-4 h-4 text-primary'
                                />
                                Short Description
                            </label>
                            <textarea
                                value={data.shortDescription}
                                onChange={e =>
                                    setData(prev => ({
                                        ...prev,
                                        shortDescription: e.target.value,
                                    }))
                                }
                                className='w-full min-h-[100px] rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none'
                                placeholder='Provide a brief overview...'
                            />
                        </div>
                    </div>
                    {/* Tour Types */}
                    <div className='space-y-4'>
                        <label className='text-sm font-bold text-foreground flex items-center gap-2'>
                            <HugeiconsIcon
                                icon={Tag01Icon}
                                className='w-4 h-4 text-primary'
                            />
                            Tour Types
                        </label>
                        <div className='grid grid-cols-2 gap-3'>
                            {tourTypeOptions.map(option => (
                                <div
                                    key={option.id || option.name}
                                    className='flex items-center space-x-2'>
                                    <Checkbox
                                        id={`tour-type-${option.id || option.name}`}
                                        checked={data.tourTypes?.includes(
                                            option.name
                                        )}
                                        onCheckedChange={() =>
                                            handleCheckboxToggle(
                                                'tourTypes',
                                                option.name
                                            )
                                        }
                                    />
                                    <label
                                        htmlFor={`tour-type-${option.id || option.name}`}
                                        className='text-sm font-medium leading-none cursor-pointer'>
                                        {option.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Difficulty */}
                    <div className='space-y-4'>
                        <label className='text-sm font-bold text-foreground flex items-center gap-2'>
                            <HugeiconsIcon
                                icon={StarIcon}
                                className='w-4 h-4 text-primary'
                            />
                            Difficulty Level
                        </label>
                        <Select
                            value={data.difficulty}
                            onValueChange={val =>
                                updateField('difficulty', val)
                            }>
                            <SelectTrigger className='w-full h-11 bg-background border-input'>
                                <SelectValue placeholder='Select Difficulty Level' />
                            </SelectTrigger>
                            <SelectContent
                                className='z-[1001]'
                                position='popper'
                                sideOffset={4}>
                                {difficultyOptions.map(option => (
                                    <SelectItem
                                        key={option.id || option.name}
                                        value={option.name}>
                                        {option.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Suitable For */}
                    <div className='space-y-4'>
                        <label className='text-sm font-bold text-foreground flex items-center gap-2'>
                            <HugeiconsIcon
                                icon={UserGroupIcon}
                                className='w-4 h-4 text-primary'
                            />
                            Suitable For
                        </label>
                        <div className='grid grid-cols-2 gap-3'>
                            {suitableForOptions.map(option => (
                                <div
                                    key={option.id || option.name}
                                    className='flex items-center space-x-2'>
                                    <Checkbox
                                        id={`suitable-${option.id || option.name}`}
                                        checked={data.suitableFor?.includes(
                                            option.name
                                        )}
                                        onCheckedChange={() =>
                                            handleCheckboxToggle(
                                                'suitableFor',
                                                option.name
                                            )
                                        }
                                    />
                                    <label
                                        htmlFor={`suitable-${option.id || option.name}`}
                                        className='text-sm font-medium leading-none cursor-pointer'>
                                        {option.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tour Style */}
                    <div className='space-y-4'>
                        <label className='text-sm font-bold text-foreground flex items-center gap-2'>
                            <HugeiconsIcon
                                icon={InformationCircleIcon}
                                className='w-4 h-4 text-primary'
                            />
                            Tour Style
                        </label>
                        <Select
                            value={data.tourStyle}
                            onValueChange={val =>
                                updateField('tourStyle', val)
                            }>
                            <SelectTrigger className='w-full h-11 bg-background border-input'>
                                <SelectValue placeholder='Select Tour Style' />
                            </SelectTrigger>
                            <SelectContent
                                className='z-[1001]'
                                position='popper'
                                sideOffset={4}>
                                {tourStyleOptions.map(option => (
                                    <SelectItem
                                        key={option.id || option.name}
                                        value={option.name}>
                                        {option.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </EditingSheetRight>
    );
};

