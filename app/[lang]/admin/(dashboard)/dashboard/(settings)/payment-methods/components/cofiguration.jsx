'use client';

import { useCallback, useMemo, useState } from 'react';

import MollieIcon from '@/components/svg/mollie';
import PaypalIcon from '@/components/svg/paypal';
import { BiCheckboxSquare } from 'react-icons/bi';
import { FaStripe } from 'react-icons/fa6';
import ComingSoonWrapper from './coming-soon-wrapper';
import Mollie from './sections/Mollie';
import Paypal from './sections/paypal';
import Square from './sections/Square';
import Stripe from './sections/Stripe';
import SectionTabs from './tabs';

const Configuration = ({ configuration, enabledMethod, tenant }) => {
    const [enabled, setEnabled] = useState(enabledMethod || '');
    const [activeTab, setActiveTab] = useState(enabledMethod || 'stripe');

    const handleNotifyMe = () => {
        // You can replace this with your actual notification logic
        alert("We'll notify you when this integration is ready!");
    };
    const formSections = [
        {
            id: 'stripe',
            label: 'Stripe',
            icon: FaStripe,
            description: 'Stripe configuration',
        },
        {
            id: 'mollie',
            label: 'Mollie',
            icon: MollieIcon,
            description: 'Mollie configuration',
        },
        {
            id: 'paypal',
            label: 'Paypal',
            icon: PaypalIcon,
            description: 'Paypal configuration',
        },
        {
            id: 'square',
            label: 'Square',
            icon: BiCheckboxSquare,
            description: 'Square configuration',
        },
    ];
    const SECTION_COMPONENTS = useMemo(
        () => ({
            stripe: (
                <Stripe
                    tenant={tenant}
                    enabled={enabled}
                    setEnabled={setEnabled}
                    stripeConfiguration={configuration?.stripe}
                />
            ),
            mollie: (
                <Mollie
                    tenant={tenant}
                    enabled={enabled}
                    setEnabled={setEnabled}
                    mollieConfiguration={configuration?.mollie}
                />
            ),
            paypal: (
                <ComingSoonWrapper
                    isComingSoon={true}
                    title='PayPal Integration'
                    description="We're working hard to bring you seamless PayPal integration. This feature will be available in our next update."
                    features={[
                        'Full PayPal checkout integration',
                        'Webhook support',
                        'Multiple payment methods',
                        'Sandbox & production modes',
                        'Advanced fraud protection',
                    ]}>
                    <Paypal
                        tenant={tenant}
                        enabled={enabled}
                        setEnabled={setEnabled}
                        paypalConfiguration={configuration?.paypal}
                    />
                </ComingSoonWrapper>
            ),
            square: (
                <ComingSoonWrapper
                    isComingSoon={true}
                    title='Square Integration'
                    description="We're working hard to bring you seamless Square integration. This feature will be available in our next update."
                    features={[
                        'Full Square checkout integration',
                        'Webhook support',
                        'Multiple payment methods',
                        'Sandbox & production modes',
                        'Advanced fraud protection',
                    ]}>
                    <Square
                        tenant={tenant}
                        enabled={enabled}
                        setEnabled={setEnabled}
                        squareConfiguration={configuration?.square}
                    />
                </ComingSoonWrapper>
            ) }),
        [
            configuration?.mollie,
            configuration?.paypal,
            configuration?.square,
            configuration?.stripe,
            enabled,
            tenant,
        ]
    );
    // Render current form section
    const renderFormSection = useCallback(() => {
        return SECTION_COMPONENTS[activeTab] || SECTION_COMPONENTS.stripe;
    }, [SECTION_COMPONENTS, activeTab]);

    // Handle tab navigation from sidebar
    const handleTabChange = useCallback(tabId => {
        setActiveTab(tabId);
    }, []);
    return (
        <div className='grid grid-cols-12 my-8'>
            <SectionTabs
                formSections={formSections}
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                className='col-span-12 lg:col-span-3 xl:col-span-2 rounded-tr-none  border-r-0'
            />

            <div className='col-span-12 lg:col-span-9 xl:col-span-9 rounded-lg lg:rounded-tl-none  lg:rounded-bl-none p-6 border bg-card border-l-0 text-card-foreground shadow-sm'>
                {renderFormSection()}
            </div>
        </div>
    );
};

export default Configuration;

