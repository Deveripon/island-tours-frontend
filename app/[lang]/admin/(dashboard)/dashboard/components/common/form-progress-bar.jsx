import { Button } from '@/components/ui/button';
import { FloppyDiskIcon, Loading03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export function FormProgressBar({
    currentTabIndex,
    totalSections,
    onSaveDraft,
    mode,
    isSubmitting,
    onSubmit,
    isLastStep }) {
    const progress = ((currentTabIndex + 1) / totalSections) * 100;

    return (
        <div className='flex gap-5 items-center mb-3'>
            <div className='w-full bg-gray-200 rounded-full h-2.5 mr-6'>
                <div
                    className='bg-primary h-2.5 rounded-full transition-all duration-300'
                    style={{ width: `${progress}%` }}></div>
            </div>
            <span className='text-sm font-medium text-gray-500 whitespace-nowrap'>
                {currentTabIndex + 1} of {totalSections}
            </span>

            {!mode && !isSubmitting && (
                <Button
                    className='cursor-pointer flex focus:ring-2 ring-primary bg-primary hover:bg-primary/90 hover:text-primary-foreground transition-colors duration-300 ring-offset-2 justify-self-end'
                    type='button'
                    variant='default'
                    onClick={onSaveDraft}>
                    Save as Draft
                </Button>
            )}

            {mode === 'update' && !isLastStep && (
                <Button
                    className='cursor-pointer flex focus:ring-2 ring-primary bg-primary hover:bg-primary/90 hover:text-primary-foreground transition-colors duration-300 ring-offset-2 justify-self-end'
                    disabled={isSubmitting}
                    type='button'
                    onClick={onSubmit}>
                    {isSubmitting ? (
                        <>
                            <HugeiconsIcon
                                icon={Loading03Icon}
                                className='mr-2 h-4 w-4 animate-spin'
                            />
                            {mode === 'update' ? 'Updating....' : 'Saving...'}
                        </>
                    ) : (
                        <>
                            <HugeiconsIcon
                                icon={FloppyDiskIcon}
                                className='mr-2 h-4 w-4'
                            />
                            {mode === 'update'
                                ? 'Update Package'
                                : ' Save Package'}
                        </>
                    )}
                </Button>
            )}
        </div>
    );
}

