'use client';

import { useCallback, useMemo, useState } from 'react';
import { FaMailchimp } from 'react-icons/fa6';
import { SiN8N } from 'react-icons/si';
import { TbBrandZapier } from 'react-icons/tb';
import Mailchimp from './sections/mailchimp';
import LeadsByn8n from './sections/n8n';
import LeadsByZapier from './sections/zapier';
import SectionTabs from './tabs';

const AutomationSetup = ({
    tenant,
    instructions,
    existingZapierCatchUrl,
    existingN8nCatchUrl,
    mailchimpConfig,
}) => {
    const [activeTab, setActiveTab] = useState('zapier');
    const sections = [
        {
            id: 'mailchimp',
            label: 'Mailchimp',
            icon: FaMailchimp,
            iconType: 'react-icon',
            description: 'Automation With Mailchimp',
        },
        {
            id: 'zapier',
            label: 'Zapier',
            icon: TbBrandZapier,
            iconType: 'react-icon',
            description: 'Automation With Zapier',
        },
        {
            id: 'n8n',
            label: 'n8n',
            icon: SiN8N,
            iconType: 'react-icon',
            description: 'Automation With n8n',
        },
    ];
    const SECTION_COMPONENTS = useMemo(
        () => ({
            mailchimp: (
                <Mailchimp
                    tenant={tenant}
                    instruction={instructions.mailchimp}
                    mailchimpConfig={mailchimpConfig}
                />
            ),
            zapier: (
                <LeadsByZapier
                    tenant={tenant}
                    instruction={instructions.zapier}
                    existingZapierCatchUrl={existingZapierCatchUrl}
                />
            ),
            n8n: (
                <LeadsByn8n
                    tenant={tenant}
                    instruction={instructions.n8n}
                    existingN8nCatchUrl={existingN8nCatchUrl}
                />
            ),
        }),
        [
            existingN8nCatchUrl,
            existingZapierCatchUrl,
            instructions.n8n,
            instructions.zapier,
            tenant,
        ]
    );

    const renderFormSection = useCallback(() => {
        return SECTION_COMPONENTS[activeTab] || SECTION_COMPONENTS.zapier;
    }, [SECTION_COMPONENTS, activeTab]);

    const handleTabChange = useCallback(tabId => {
        setActiveTab(tabId);
    }, []);

    return (
        <div className='flex flex-auto'>
            <div className='w-full'>
                <div className='grid grid-cols-12 my-8'>
                    <SectionTabs
                        formSections={sections}
                        activeTab={activeTab}
                        setActiveTab={handleTabChange}
                        className='col-span-12 lg:col-span-3 xl:col-span-2 rounded-tr-none border-r-0'
                    />

                    <div className='col-span-12 lg:col-span-9 xl:col-span-9 rounded-lg lg:rounded-tl-none lg:rounded-bl-none p-6 border bg-card border-l-0 text-card-foreground shadow-sm'>
                        {renderFormSection()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutomationSetup;

