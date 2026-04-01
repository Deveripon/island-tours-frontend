import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';

export function FormNavButtons({
    isLastStep,
    isFirstStep,
    onPrevious,
    onNext,
    onSubmit,
    isSubmitting,
    mode }) {
    return (
        <div className='flex justify-between mt-8'>
            <Button
                type='button'
                variant='outline'
                className='hover:bg-primary hover:text-primary-foreground transition-colors duration-300'
                onClick={onPrevious}
                disabled={isFirstStep}>
                Previous
            </Button>

            <div className='flex gap-2'>
                {!isLastStep && (
                    <Button
                        type='button'
                        variant='default'
                        onClick={onNext}
                        className='flex items-center gap-2 bg-primary hover:bg-primary/90 hover:text-primary-foreground transition-colors duration-300'>
                        Next
                    </Button>
                )}

                {isLastStep && (
                    <Button
                        className='flex items-center gap-2 bg-primary hover:bg-primary/90 hover:text-primary-foreground transition-colors duration-300'
                        disabled={isSubmitting}
                        type='button'
                        onClick={onSubmit}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                {mode === 'update'
                                    ? 'Updating....'
                                    : 'Saving...'}
                            </>
                        ) : (
                            <>
                                <Save className='mr-2 h-4 w-4' />
                                {mode === 'update' && isLastStep
                                    ? 'Update & Continue'
                                    : ' Save Package'}
                            </>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}

