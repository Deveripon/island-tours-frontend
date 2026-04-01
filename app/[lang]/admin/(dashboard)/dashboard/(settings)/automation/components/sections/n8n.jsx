import { Alert, AlertDescription } from '@/components/ui/alert';

import Instruction from './instruction';
import N8nWebhookSetup from './n8n-endpoint-save-form';

const LeadsByn8n = ({ instruction, tenant, existingN8nCatchUrl }) => {
    return (
        <div className='space-y-8'>
            <Instruction instruction={instruction} type='n8n' />
            <N8nWebhookSetup tenant={tenant} existingN8nCatchUrl={existingN8nCatchUrl} />
            <Alert className='mt-8 border-border bg-muted/50'>
                <AlertDescription className='text-sm text-muted-foreground'>
                    Need help? Contact our support team at{' '}
                    <span className='font-medium'>support@tripwheel.com</span>
                </AlertDescription>
            </Alert>
        </div>
    );
};

export default LeadsByn8n;
