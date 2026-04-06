'use client';
import { Alert, AlertDescription } from '@/components/ui/alert';

import Instruction from './instruction';
import MailchimpCredentialsSaveForm from './mailchimp-credentials-save-form';

const Mailchimp = ({ instruction, mailchimpConfig }) => {
    return (
        <div className='space-y-8'>
            <Instruction instruction={instruction} type='mailchimp' />

            <MailchimpCredentialsSaveForm mailchimpConfig={mailchimpConfig} />

            <Alert className='mt-8 border-border bg-muted/50'>
                <AlertDescription className='text-sm text-muted-foreground'>
                    Need help? Contact our support team at{' '}
                    <span className='font-medium'>support@tripwheel.com</span>
                </AlertDescription>
            </Alert>
        </div>
    );
};

export default Mailchimp;

