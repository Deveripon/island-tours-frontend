import { updateTenantPreferedPaymentMethod } from '@/app/_actions/settingsActions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    InformationCircleIcon,
    Tick02Icon,
    Time02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';
import { toast } from 'sonner';

const PaymentSwitcher = ({
    enabled,
    setEnabled,
    paymentMethod = 'square',
    comingSoon = false,
    tenant,
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const isEnabled = enabled === paymentMethod;

    const paymentMethodLabels = {
        square: 'Square',
        stripe: 'Stripe',
        paypal: 'PayPal',
        mollie: 'Mollie',
    };

    async function handleChange() {
        const newValue = isEnabled ? '' : paymentMethod;
        setEnabled(newValue);

        await updateTenantPreferedPaymentMethod(
            {
                preferedPaymentMethod: newValue,
            },
            tenant
        );

        // Show appropriate toast based on action
        if (isEnabled) {
            // Deactivating the current payment method
            toast.success(
                `${paymentMethodLabels[paymentMethod]} has been deactivated`
            );
        } else {
            // Activating a payment method
            toast.success(
                `${paymentMethodLabels[paymentMethod]} has been activated as your preferred payment method`
            );
        }
    }
    if (comingSoon) {
        return (
            <div className='flex items-center gap-3 px-4 py-2 rounded-lg border bg-muted border-border opacity-75'>
                <HugeiconsIcon
                    icon={Time02Icon}
                    size={16}
                    className='text-warning'
                />
                <span className='text-sm font-medium text-muted-foreground'>
                    Coming Soon
                </span>
                <Badge
                    variant='outline'
                    className='text-xs bg-amber-50 text-amber-700 border-amber-200'>
                    In Development
                </Badge>
            </div>
        );
    }
    return (
        <div className='relative'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-3'>
                    {/* Status Indicator */}
                    <div className='flex items-center gap-2'>
                        <div
                            className={`w-2 h-2 rounded-full ${
                                isEnabled
                                    ? 'bg-success'
                                    : 'bg-muted-foreground/30'
                            }`}
                        />
                        <span
                            className={`text-xs font-medium ${
                                isEnabled
                                    ? 'text-success'
                                    : 'text-muted-foreground'
                            }`}>
                            {isEnabled ? 'Active' : 'Inactive'}
                        </span>
                    </div>

                    {/* Main Switcher Card */}
                    <div
                        className={`
            flex items-center gap-3 px-4 py-2 rounded-lg border transition-all duration-200
            ${
                isEnabled
                    ? 'bg-success/10 border-success/20 shadow-sm'
                    : 'bg-muted border-border'
            }
          `}>
                        <div className='flex items-center gap-2'>
                            {isEnabled && (
                                <HugeiconsIcon
                                    icon={Tick02Icon}
                                    size={16}
                                    className='text-success'
                                />
                            )}
                            <span
                                className={`text-sm font-medium ${
                                    isEnabled
                                        ? 'text-success'
                                        : 'text-foreground'
                                }`}>
                                {isEnabled
                                    ? 'Activated'
                                    : `Activate ${paymentMethodLabels[paymentMethod]} `}
                            </span>
                        </div>

                        {/* Info Button */}
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <button
                                    type='button'
                                    className='p-1 text-muted-foreground hover:text-foreground transition-colors'
                                    aria-label='Payment method information'>
                                    <HugeiconsIcon
                                        icon={InformationCircleIcon}
                                        size={16}
                                    />
                                </button>
                            </DialogTrigger>
                            <DialogContent className='sm:max-w-md'>
                                <DialogHeader>
                                    <DialogTitle className='flex items-center gap-2'>
                                        <HugeiconsIcon
                                            icon={InformationCircleIcon}
                                            size={20}
                                            className='text-primary'
                                        />
                                        Payment Method Selection
                                    </DialogTitle>
                                    <DialogDescription>
                                        Learn how payment method selection works
                                        and manage your active processor.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className='space-y-4 text-sm text-muted-foreground'>
                                    <div className='bg-primary/5 p-4 rounded-lg border border-primary/10'>
                                        <h4 className='font-medium text-primary mb-2'>
                                            How it works:
                                        </h4>
                                        <ul className='space-y-2 text-primary/80'>
                                            <li className='flex items-start gap-2'>
                                                <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0' />
                                                <span>
                                                    Only{' '}
                                                    <strong>
                                                        one payment method
                                                    </strong>{' '}
                                                    can be active at a time
                                                </span>
                                            </li>
                                            <li className='flex items-start gap-2'>
                                                <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0' />
                                                <span>
                                                    The active method becomes
                                                    your{' '}
                                                    <strong>
                                                        primary payment
                                                        processor
                                                    </strong>
                                                </span>
                                            </li>
                                            <li className='flex items-start gap-2'>
                                                <div className='w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0' />
                                                <span>
                                                    Switching will{' '}
                                                    <strong>
                                                        disable other payment
                                                        methods
                                                    </strong>{' '}
                                                    automatically
                                                </span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className='text-xs text-muted-foreground bg-muted/50 p-3 rounded border'>
                                        <strong>Note:</strong> Make sure to
                                        configure all required credentials
                                        before enabling a payment method.
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button
                                        onClick={() => setDialogOpen(false)}
                                        className='w-full'>
                                        Got it
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Toggle Switch */}
                        <label className='relative inline-flex items-center cursor-pointer'>
                            <input
                                type='checkbox'
                                className='sr-only'
                                checked={isEnabled}
                                onChange={handleChange}
                            />
                            <div
                                className={`
                relative w-11 h-6 rounded-full transition-colors duration-200
                ${isEnabled ? 'bg-success' : 'bg-muted-foreground/30'}
              `}>
                                <div
                                    className={`
                  absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm
                  transition-transform duration-200
                  ${isEnabled ? 'translate-x-5' : 'translate-x-0'}
                `}
                                />
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Dialog is now handled within the trigger button above */}
        </div>
    );
};

export default PaymentSwitcher;

