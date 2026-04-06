import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export function EditingSheetRight({
    open,
    onOpenChange,
    className,
    children,
    side = 'right',
    ...props
}) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side={side}
                data-lenis-prevent
                className={cn(
                    'z-[200] p-0 min-w-[320px] sm:min-w-[500px] lg:min-w-[550px] rounded-lg! bg-card border-l border-border shadow-2xl overflow-hidden',
                    className
                )}
                {...props}>
                <SheetTitle className='sr-only'>Edit Section</SheetTitle>
                <div className='flex flex-col h-full w-full overflow-hidden bg-background'>
                    {children}
                </div>
            </SheetContent>
        </Sheet>
    );
}

