import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BasicPricingConfig } from './pricing/basic-pricing-config';
import BookingFormSelection from './pricing/booking-form-selection';

// Main PricingForm component
export function PricingForm() {
    return (
        <Card>
            <CardHeader className='pb-2'>
                <CardTitle>Pricing Structure</CardTitle>
                <p className='text-sm text-muted-foreground'>
                    Configure your pricing model, tiers, and special offers.
                </p>
            </CardHeader>
            <CardContent className='pt-0'>
                <div value='basic' className='space-y-6'>
                    <BasicPricingConfig />
                    <BookingFormSelection />
                </div>
            </CardContent>
        </Card>
    );
}

