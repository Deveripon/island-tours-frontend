'use client';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { format, parseISO } from 'date-fns';
import { Clock, Delete, GlobeLock, UploadCloud, Users } from 'lucide-react';
import { ActionDropdown } from './action-dropdown';

export function defineActionBasedOnStatus(status) {
    switch (status) {
        case 'DRAFT':
            return {
                label: 'Publish Package',
                action: 'ACTIVE',
                icon: <UploadCloud className='h-4 w-4' />,
                className: 'text-success',
            };
        case 'ACTIVE':
            return {
                label: 'Mark Inactive',
                action: 'INACTIVE',
                icon: <GlobeLock className='h-4 w-4' />,
                className: 'text-warning',
            };
        case 'INACTIVE':
            return {
                label: 'Mark Active',
                action: 'ACTIVE',
                icon: <UploadCloud className='h-4 w-4' />,
                className: 'text-success',
            };
        case 'ARCHIVED':
            return {
                label: 'Restore Package',
                action: 'ACTIVE',
                icon: <Delete className='h-4 w-4' />,
                className: 'text-info',
            };
        default:
            return {
                label: 'Archive Package',
                action: 'ARCHIVED',
                icon: <Delete className='h-4 w-4' />,
                className: 'text-destructive',
            };
    }
}

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
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={value => row.toggleSelected(!!value)}
                aria-label='Select row'
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
            <div className='font-mono text-xs text-muted-foreground'>
                #{row.original.id.split('-')[0]}
            </div>
        ),
    },
    {
        accessorKey: 'mainImage',
        header: 'Image',
        cell: ({ row }) => {
            const image = row.original.mainImage?.image?.url;

            return (
                <Avatar className='h-16 w-16 rounded-md'>
                    <AvatarImage
                        src={image || '/placeholder.svg'}
                        alt={row.original.title}
                        className='object-cover'
                    />
                </Avatar>
            );
        },
    },
    {
        accessorKey: 'title',
        header: 'Title & Description',
        cell: ({ row }) => {
            const description = row.original.shortDescription || '';

            return (
                <div className='max-w-[300px] space-y-1'>
                    <div className='font-medium text-sm truncate'>
                        {row.original.title}
                    </div>
                    {description && (
                        <p className='text-xs text-muted-foreground line-clamp-2'>
                            {description}
                        </p>
                    )}
                    <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                        <span className='flex items-center gap-1'>
                            <Clock className='h-3 w-3' />
                            {row.original.duration}
                        </span>
                        {row.original.tourCategory?.tourStyle && (
                            <span className='truncate'>
                                {row.original.tourCategory.tourStyle}
                            </span>
                        )}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'destination',
        header: 'Destination',
        cell: ({ row }) => {
            const dest = row.original.destination;

            return (
                <div className='max-w-[150px] space-y-1'>
                    <div className='font-medium text-sm truncate'>
                        {dest?.name}
                    </div>
                    {dest?.city && dest?.country && (
                        <p className='text-xs text-muted-foreground truncate'>
                            {dest.city}, {dest.country}
                        </p>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'tourCategory',
        header: 'Tour Types',
        cell: ({ row }) => {
            const tourTypes = row.original.tourCategory?.tourTypes || [];

            if (tourTypes.length === 0) {
                return <span className='text-xs text-muted-foreground'>—</span>;
            }

            return (
                <div className='flex flex-wrap gap-1 max-w-[150px]'>
                    {tourTypes.slice(0, 2).map((type, index) => (
                        <Badge
                            key={index}
                            variant='secondary'
                            className='text-xs'>
                            {type}
                        </Badge>
                    ))}
                    {tourTypes.length > 2 && (
                        <Badge variant='outline' className='text-xs'>
                            +{tourTypes.length - 2}
                        </Badge>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'pricingConfig',
        header: 'Pricing',
        cell: ({ row }) => {
            const pricing = row.original.pricingConfig;
            const agePricing = pricing?.ageCategoryPricing;
            const currency = pricing?.currency?.split(' - ')[0] || 'USD';

            if (!agePricing) {
                return <span className='text-xs text-muted-foreground'>—</span>;
            }

            return (
                <div className='space-y-0.5'>
                    <div className='font-medium text-sm'>
                        {currency} {agePricing.adultsPrice}
                    </div>
                    <p className='text-xs text-muted-foreground'>
                        per {agePricing.adults?.toLowerCase() || 'adult'}
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: 'bookings',
        header: 'Bookings',
        cell: ({ row }) => {
            const totalBookings = row.original._count?.bookings || 0;
            const confirmedBookings =
                row.original.bookings?.filter(b => b.status === 'CONFIRMED')
                    .length || 0;

            return (
                <div className='text-center space-y-1'>
                    <div className='flex items-center justify-center gap-1.5 text-sm font-medium'>
                        <Users className='h-3.5 w-3.5 text-muted-foreground' />
                        <span>{totalBookings}</span>
                    </div>
                    {confirmedBookings > 0 && (
                        <p className='text-xs text-success'>
                            {confirmedBookings} confirmed
                        </p>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.status;

            const statusConfig = {
                DRAFT: {
                    label: 'Draft',
                    className: 'bg-warning/10 text-warning border-warning/20',
                },
                ACTIVE: {
                    label: 'Active',
                    className: 'bg-success/10 text-success border-success/20',
                },
                INACTIVE: {
                    label: 'Inactive',
                    className:
                        'bg-muted text-muted-foreground border-muted-foreground/20',
                },
                ARCHIVED: {
                    label: 'Archived',
                    className:
                        'bg-destructive/10 text-destructive border-destructive/20',
                },
            };

            const config = statusConfig[status] || statusConfig.DRAFT;

            return (
                <Badge
                    variant='outline'
                    className={`text-xs font-medium ${config.className}`}>
                    {config.label}
                </Badge>
            );
        },
        filterFn: (row, id, value) => {
            return value === '' || row.getValue(id) === value;
        },
    },
    {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => (
            <div className='text-sm text-muted-foreground'>
                {format(parseISO(row.original.createdAt), 'MMM dd, yyyy')}
            </div>
        ),
    },
    {
        id: 'actions',
        cell: ({ row, table }) => {
            const tripPackages = row.original;
            const meta = table.options.meta;
            const isLoading = meta?.loading === tripPackages.id;

            return (
                <ActionDropdown
                    tripPackages={tripPackages}
                    meta={meta}
                    isLoading={isLoading}
                    defineActionBasedOnStatus={defineActionBasedOnStatus}
                />
            );
        },
    },
];

