import { Alert, AlertDescription } from '@/components/ui/alert';

import Instruction from './instruction';
import ZapierWebhookSetup from './zapier-endpoint-save-form';

const LeadsByZapier = ({ instruction, tenant, existingZapierCatchUrl }) => {
    return (
        <div className='space-y-8'>
            <Instruction instruction={instruction} type='zapier' />
            <ZapierWebhookSetup
                tenant={tenant}
                existingZapierCatchUrl={existingZapierCatchUrl}
            />
            <Alert className='mt-8 border-border bg-muted/50'>
                <AlertDescription className='text-sm text-muted-foreground'>
                    Need help? Contact our support team at{' '}
                    <span className='font-medium'>support@tripwheel.com</span>
                </AlertDescription>
            </Alert>
        </div>
    );
};

export default LeadsByZapier;
