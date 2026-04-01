'use client';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils/form-helpers';
import { Calendar03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Apikey from './api-key';
import DeleteApiKey from './delete-api-key';

export const columns = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={value =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label='Select all'
                className='translate-y-[2px]'
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={value => row.toggleSelected(!!value)}
                aria-label='Select row'
                className='translate-y-[2px]'
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },

    {
        accessorKey: 'label',
        header: 'Label',
        cell: ({ row }) => {
            const label = row.getValue('label');
            return (
                <div className='flex items-center gap-2'>
                    <div className='flex flex-col'>
                        <div className='font-semibold text-foreground'>
                            {label || 'Unlabeled'}
                        </div>
                    </div>
                    {!label && (
                        <Badge variant='secondary' className='text-xs'>
                            No Label
                        </Badge>
                    )}
                </div>
            );
        },
    },

    {
        accessorKey: 'key',
        header: 'API Key',
        cell: ({ row }) => {
            return <Apikey row={row} />;
        },
    },

    {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => {
            const createdAt = row.getValue('createdAt');
            const formattedDate = formatDate(createdAt);

            return (
                <div className='flex items-center gap-2'>
                    <HugeiconsIcon icon={Calendar03Icon} size={16} className='text-muted-foreground' />
                    <div className='flex flex-col'>
                        <div className='text-sm font-medium text-foreground'>
                            {formattedDate || 'Unknown'}
                        </div>
                    </div>
                </div>
            );
        },
    },

    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            // You can add logic here to determine status based on your API data
            const isActive = true; // This would come from your API data

            return (
                <Badge
                    variant={isActive ? 'default' : 'secondary'}
                    className={cn(
                        'font-medium',
                        isActive
                            ? 'bg-success/10 text-success hover:bg-success/10 border-success/20'
                            : 'bg-muted text-muted-foreground border-border'
                    )}>
                    {isActive ? 'Active' : 'Inactive'}
                </Badge>
            );
        },
    },

    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            return <DeleteApiKey row={row} />;
        },
    },
];

