import { formatKey } from '@/lib/utils';
import { Clock, Inbox, Mail, MailCheck, Trash2 } from 'lucide-react';

export const InquresSummery = ({
    groupedInquries,
    typeFilter,
    setTypeFilter,
    allInquries }) => {
    const getStatusConfig = status => {
        const configs = {
            PENDING: {
                icon: Clock,
                bgColor: 'bg-orange-50',
                borderColor: 'border-orange-200',
                textColor: 'text-orange-600',
                iconColor: 'text-orange-500',
            },
            REPLIED: {
                icon: MailCheck,
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                textColor: 'text-green-600',
                iconColor: 'text-green-500',
            },
            READ: {
                icon: Mail,
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200',
                textColor: 'text-blue-600',
                iconColor: 'text-blue-500',
            },
            TRASHED: {
                icon: Trash2,
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                textColor: 'text-red-600',
                iconColor: 'text-red-500',
            },
            UNREAD: {
                icon: Inbox,
                bgColor: 'bg-purple-50',
                borderColor: 'border-purple-200',
                textColor: 'text-purple-600',
                iconColor: 'text-purple-500',
            },
        };

        return (
            configs[status] || {
                icon: Mail,
                bgColor: 'bg-gray-50',
                borderColor: 'border-gray-200',
                textColor: 'text-gray-600',
                iconColor: 'text-gray-500' });
    };

    const handleTypeCardClick = status => {
        setTypeFilter(typeFilter === status ? '' : status);
    };
    return (
        <div className='space-y-4'>
            {/* Status Cards Grid */}
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3'>
                {Object.entries(groupedInquries).map(([status, values]) => {
                    const isActive = typeFilter === status;
                    const config = getStatusConfig(status);
                    const Icon = config.icon;

                    return (
                        <div
                            key={status}
                            className={`
                                ${config.bgColor} ${config.borderColor} 
                                rounded-lg p-4 border shadow-sm 
                                cursor-pointer transition-all duration-200
                                hover:shadow-md hover:scale-105
                                ${
                                    isActive
                                        ? 'ring-2 ring-primary ring-offset-2'
                                        : ''
                                }
                            `}
                            onClick={() => handleTypeCardClick(status)}>
                            <div className='flex items-center justify-between mb-2'>
                                <Icon
                                    className={`h-4 w-4 ${config.iconColor}`}
                                />
                                <span
                                    className={`text-2xl font-bold ${config.textColor}`}>
                                    {values.length}
                                </span>
                            </div>
                            <div
                                className={`text-xs font-medium ${config.textColor}`}>
                                {status === 'REPLIED'
                                    ? 'Replied'
                                    : formatKey(status)}
                            </div>
                        </div>
                    );
                })}

                {/* Total Card */}
                <div
                    className={`
                        bg-primary/10 border-primary/20 
                        rounded-lg p-4 border-2 shadow-sm 
                        cursor-pointer transition-all duration-200
                        hover:shadow-md hover:scale-105
                        ${
                            typeFilter === ''
                                ? 'ring-2 ring-primary ring-offset-2'
                                : ''
                        }
                    `}
                    onClick={() => handleTypeCardClick('')}>
                    <div className='flex items-center justify-between mb-2'>
                        <Inbox className='h-4 w-4 text-primary' />
                        <span className='text-2xl font-bold text-primary'>
                            {allInquries.length}
                        </span>
                    </div>
                    <div className='text-xs font-medium text-primary'>
                        Total
                    </div>
                </div>
            </div>
        </div>
    );
};

