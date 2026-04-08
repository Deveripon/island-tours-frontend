import { getMailchimpConfig, getWebhooks } from '@/app/_actions/settingsActions';
import AutomationSetup from './components/automation-setup';

export default async function AutomationPage() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_APP_URL;
    const endpoints = {
        leads: {
            mailchimp: {
                id: 'mailchimp',
                title: 'Connect Mailchimp API',
                description: 'Integrate Mailchimp directly to automate your lead nurturing.',
                endpoint: null,
                method: null,
                instructions: [
                    'Log in to Mailchimp and go to Account & Billing > Extras > API Keys.',
                    'Create a new API Key and copy it.',
                    'Go to Audience > Settings to find your "Unique Audience ID".',
                    'Enter the API Key and Audience ID in the fields below.',
                    'Ensure your Server Prefix (e.g., us19) is correct.',
                    'Click "Save Configuration" to save.',
                ],
                payload: null,
            },
            zapier: {
                id: 'leads-by-zapier',
                title: 'Lead Collection via Zapier',
                description: 'Collect and store leads from your forms via Zapier',
                endpoint: `${backendUrl}/webhook/leads`,
                method: 'POST',
                instructions: [
                    'Create a new Zap in Zapier and select your form trigger (Google Forms, Typeform, etc.)',
                    'Choose "Webhooks by Zapier" as the action app',
                    'Select "POST" as the action event',
                    'Copy the webhook URL above and paste it into the URL field',
                    'Map your form fields to the webhook payload',
                    'Test your webhook and turn on your Zap',
                ],
                payload: {
                    email: "Lead's Email             => eg. john@example.com (required)",
                    name: "Lead's Name              => eg. John Doe  (optional)",
                    image: "Lead's Image url         => eg. https://example.com/image.jpg  (optional)",
                    phone: "Lead's Phone             => eg. +1234567890  (optional)",
                    company: "Lead's Company          => eg. Island Tours  (optional)",
                    source: 'Collecting Source      => eg. Google Form  (optional)',
                    message: 'Any Message           => eg. Interested in your services (optional)',
                },
            },
            n8n: {
                id: 'leads-by-n8n',
                title: 'Lead Collection via n8n',
                description: 'Collect and store leads from your forms via n8n',
                endpoint: `${backendUrl}/webhook/leads`,
                method: 'POST',
                instructions: [
                    'Create a new workflow in n8n and select your form trigger (Google Forms, Typeform, etc.)',
                    'Add an HTTP Request node to your workflow',
                    'Set the HTTP Method to "POST"',
                    'Copy the webhook URL above and paste it into the URL field',
                    'Map your form fields to the webhook payload',
                    'Execute the workflow to test the webhook',
                ],
                payload: {
                    email: "Lead's Email             => eg. john@example.com (required)",
                    name: "Lead's Name              => eg. John Doe  (optional)",
                    image: "Lead's Image url         => eg. https://example.com/image.jpg  (optional)",
                    phone: "Lead's Phone             => eg. +1234567890  (optional)",
                    company: "Lead's Company          => eg. Island Tours  (optional)",
                    source: 'Collecting Source      => eg. Google Form  (optional)',
                    message: 'Any Message           => eg. Interested in your services (optional)',
                },
            },
        },
    };

    const [mailchimpRes, webhooksRes] = await Promise.all([
        getMailchimpConfig(),
        getWebhooks(),
    ]);

    const mailchimpConfigData = mailchimpRes?.data;
    const webhookUrls = webhooksRes?.data?.webhookUrls || [];
    console.log(`webhookUrls`, webhookUrls);

    const existingZapierCatchUrl = webhookUrls?.find(
        config => config.type === 'zapier_leads_catch_url'
    )?.url;

    const existingN8nCatchUrl = webhookUrls?.find(
        config => config.type === 'n8n_leads_catch_url'
    )?.url;

    return (
        <div className='container'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-semibold tracking-tight'>
                        Integrations & Automation
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Connect your automation tools with Tripwheel
                    </p>
                </div>
            </div>
            <AutomationSetup
                instructions={endpoints?.leads}
                existingZapierCatchUrl={existingZapierCatchUrl}
                existingN8nCatchUrl={existingN8nCatchUrl}
                mailchimpConfig={mailchimpConfigData}
            />
        </div>
    );
}
