import { AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';

export function TrialPeriodAlert({
    expirationDate,
    state = 'active', // 'active', 'warning', 'expired', 'grace'
    onUpgradeClick,
    upgradeUrl = '#' }) {
    const getAlertConfig = () => {
        const formattedDate = new Date(expirationDate).toLocaleDateString(
            'en-US',
            {
                month: 'long',
                day: 'numeric',
                year: 'numeric' });

        switch (state) {
            case 'warning':
                return {
                    icon: <AlertCircle className='h-5 w-5 text-amber-600' />,
                    className: 'border-amber-200 bg-amber-50',
                    titleColor: 'text-amber-800',
                    textColor: 'text-amber-700',
                    linkColor: 'text-amber-800 hover:text-amber-900',
                    title: 'Trial Expiring Soon',
                    message: `Your 30 days of free trial will expire on ${formattedDate}.`,
                    linkText: 'Upgrade Now',
                    urgent: true,
                };

            case 'expired':
                return {
                    icon: <XCircle className='h-5 w-5 text-red-600' />,
                    className: 'border-red-200 bg-red-50',
                    titleColor: 'text-red-800',
                    textColor: 'text-red-700',
                    linkColor: 'text-red-800 hover:text-red-900',
                    title: 'Trial Expired',
                    message: `Your free trial expired on ${formattedDate}.`,
                    linkText: 'Restore Access',
                    urgent: true,
                };

            case 'grace':
                return {
                    icon: <Clock className='h-5 w-5 text-orange-600' />,
                    className: 'border-orange-200 bg-orange-50',
                    titleColor: 'text-orange-800',
                    textColor: 'text-orange-700',
                    linkColor: 'text-orange-800 hover:text-orange-900',
                    title: 'Grace Period Active',
                    message: `Limited access available. Trial expired on ${formattedDate}.`,
                    linkText: 'Upgrade Plan',
                    urgent: true,
                };

            case 'active':
            default:
                return {
                    icon: <CheckCircle2 className='h-5 w-5 text-blue-600' />,
                    className: 'border-blue-200 bg-blue-50',
                    titleColor: 'text-blue-800',
                    textColor: 'text-blue-700',
                    linkColor: 'text-blue-800 hover:text-blue-900',
                    title: 'Trial Active',
                    message: `Your free trial is active until ${formattedDate}.`,
                    linkText: 'View Plans',
                    urgent: false,
                };
        }
    };

    const {
        icon,
        className,
        titleColor,
        textColor,
        linkColor,
        title,
        message,
        linkText,
        urgent,
    } = getAlertConfig();

    return (
        <div className='w-full'>
            <div className={`rounded-lg border p-4 ${className}`}>
                <div className='flex items-start gap-3'>
                    <div className='flex-shrink-0 mt-0.5'>{icon}</div>
                    <div className='flex-1 min-w-0'>
                        <div className='flex items-start  gap-4'>
                            <div className=''>
                                <p className={`text-sm mt-1 ${textColor}`}>
                                    {message}
                                </p>
                            </div>
                            <div className=''>
                                <Link
                                    href={upgradeUrl}
                                    className={`inline-flex items-center gap-1 text-sm font-medium underline decoration-2 underline-offset-2 transition-colors ${linkColor}`}>
                                    {linkText}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Usage examples component
/* export function TrialAlertExamples() {
    const exampleDate = new Date();
    exampleDate.setDate(exampleDate.getDate() + 7); // 7 days from now

    const handleUpgrade = state => {
        alert(`Upgrade clicked for state: ${state}`);
    };

    return (
        <div className='space-y-6 p-6 max-w-2xl mx-auto'>
            <h2 className='text-lg font-bold text-gray-900'>
                Trial Alert States
            </h2>

            <div className='space-y-6'>
                <div>
                    <h3 className='text-sm font-medium mb-3 text-gray-600 uppercase tracking-wide'>
                        Active State
                    </h3>
                    <TrialPeriodAlert
                        expirationDate={exampleDate}
                        state='active'
                        onUpgradeClick={handleUpgrade}
                        upgradeUrl='/pricing'
                    />
                </div>

                <div>
                    <h3 className='text-sm font-medium mb-3 text-gray-600 uppercase tracking-wide'>
                        Warning State
                    </h3>
                    <TrialPeriodAlert
                        expirationDate={exampleDate}
                        state='warning'
                        onUpgradeClick={handleUpgrade}
                        upgradeUrl='/pricing'
                    />
                </div>

                <div>
                    <h3 className='text-sm font-medium mb-3 text-gray-600 uppercase tracking-wide'>
                        Grace Period State
                    </h3>
                    <TrialPeriodAlert
                        expirationDate={new Date()}
                        state='grace'
                        onUpgradeClick={handleUpgrade}
                        upgradeUrl='/pricing'
                    />
                </div>

                <div>
                    <h3 className='text-sm font-medium mb-3 text-gray-600 uppercase tracking-wide'>
                        Expired State
                    </h3>
                    <TrialPeriodAlert
                        expirationDate={new Date()}
                        state='expired'
                        onUpgradeClick={handleUpgrade}
                        upgradeUrl='/pricing'
                    />
                </div>
            </div>

            <div className='mt-8 p-4 bg-gray-50 rounded-lg'>
                <h4 className='font-medium text-gray-900 mb-2'>Usage:</h4>
                <pre className='text-sm text-gray-600 overflow-x-auto'>
                    {`<TrialPeriodAlert 
  expirationDate={new Date('2024-08-15')} 
  state="warning"
  onUpgradeClick={(state) => handleUpgrade(state)}
  upgradeUrl="/pricing"
/>`}
                </pre>
            </div>
        </div>
    );
} */

