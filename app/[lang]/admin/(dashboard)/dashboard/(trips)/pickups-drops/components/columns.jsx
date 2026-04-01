    'use client';
    import { Badge } from '@/components/ui/badge';
    import { Checkbox } from '@/components/ui/checkbox';
    import { generateSlug } from '@/lib/utils';
    import { Calendar, DollarSign, Info, MapPin } from 'lucide-react';
    import { PickupActionDropdown } from './pickups-action-dropdown';

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
            accessorKey: 'locationName',
            header: 'Location & Address',
            cell: ({ row }) => {
                const locationName = row.original.locationName;
                const fullAddress = row.original.fullAddress;
                const meetingInstruction = row.original.meetingInstruction;

                return (
                    <div className='max-w-[300px] space-y-1'>
                        <div className='font-medium text-sm truncate'>
                            {locationName}
                        </div>
                        {fullAddress && (
                            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                                <MapPin className='h-3 w-3' />
                                <span className='truncate'>{fullAddress}</span>
                            </div>
                        )}
                        {meetingInstruction && (
                            <div className='flex items-start gap-1 text-xs text-muted-foreground'>
                                <Info className='h-3 w-3 mt-0.5 flex-shrink-0' />
                                <p className='line-clamp-2'>{meetingInstruction}</p>
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'price',
            header: 'Price',
            cell: ({ row }) => {
                const price = row.original.price;

                return (
                    <div className='flex items-center gap-1.5'>
                        <DollarSign className='h-3 w-3 text-muted-foreground' />
                        <span className='text-sm font-medium'>${price}</span>
                        <Badge variant='secondary' className='text-xs'>
                            per person
                        </Badge>
                    </div>
                );
            },
        },
        {
            accessorKey: 'affiliateTrips',
            header: 'Trip',
            cell: ({ row }) => {
                const trip = row.original.affiliateTrips;

                if (!trip) {
                    return <span className='text-xs text-muted-foreground'>—</span>;
                }

                return (
                    <div className='text-center'>
                        <Badge variant='outline' className='text-xs'>
                            Assigned
                        </Badge>
                    </div>
                );
            },
        },
        {
            accessorKey: 'createdBy',
            header: 'Created By',
            cell: ({ row }) => {
                const creator = row.original.createdBy;

                if (!creator) {
                    return <span className='text-xs text-muted-foreground'>—</span>;
                }

                return (
                    <div className='space-y-0.5'>
                        <div className='text-sm font-medium'>{creator.name}</div>
                        <div className='text-xs text-muted-foreground'>
                            {creator.email}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'createdAt',
            header: 'Created',
            cell: ({ row }) => {
                const date = new Date(row.original.createdAt);
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric' });

                return (
                    <div className='flex items-center gap-1.5'>
                        <Calendar className='h-3 w-3 text-muted-foreground' />
                        <span className='text-xs text-muted-foreground'>
                            {formattedDate}
                        </span>
                    </div>
                );
            },
        },
        {
            id: 'slug',
            accessorFn: row => generateSlug(row.locationName),
            header: 'Slug',
            cell: ({ row }) => (
                <div className='font-mono text-xs text-muted-foreground max-w-[200px] truncate'>
                    {row.getValue('slug')}
                </div>
            ),
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const pickup = row.original;
                return <PickupActionDropdown pickup={pickup} />;
            },
        },
    ];

