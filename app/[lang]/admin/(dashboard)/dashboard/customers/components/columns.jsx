'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Mail, MapPin, Phone, User } from 'lucide-react';

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
                #{row.original.id?.split('-')[0] || row.original.id}
            </div>
        ),
    },
    {
        accessorKey: 'name',
        header: 'Customer',
        cell: ({ row }) => {
            const photo = row.original?.image;
            const name = row.original?.name;
            const email = row.original?.email;

            // Get initials for fallback
            const initials = name
                ?.split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2) || 'U';

            return (
                <div className='flex items-center gap-3 max-w-[300px]'>
                    <Avatar className='h-10 w-10'>
                        <AvatarImage
                            src={photo?.image?.url || photo?.url}
                            alt={photo?.image?.altText || name}
                        />
                        <AvatarFallback className='bg-primary/10 text-primary font-medium'>
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className='space-y-1'>
                        <div className='font-medium text-sm truncate'>
                            {name || 'Unknown'}
                        </div>
                        {email && (
                            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                                <Mail className='h-3 w-3' />
                                <span className='truncate'>{email}</span>
                            </div>
                        )}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'phone',
        header: 'Contact',
        cell: ({ row }) => {
            const phone = row.original?.phone;
            const location = row.original?.location;

            return (
                <div className='space-y-1.5'>
                    {phone && (
                        <div className='flex items-center gap-1.5'>
                            <Phone className='h-3 w-3 text-muted-foreground' />
                            <span className='text-sm'>{phone}</span>
                        </div>
                    )}
                    {location && (
                        <div className='flex items-center gap-1.5'>
                            <MapPin className='h-3 w-3 text-muted-foreground' />
                            <span className='text-xs text-muted-foreground truncate max-w-[200px]'>
                                {location}
                            </span>
                        </div>
                    )}
                    {!phone && !location && (
                        <span className='text-xs text-muted-foreground'>
                            No contact info
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            // You can customize this based on your customer status logic
            const status = row.original?.status || 'active';
            
            const statusConfig = {
                active: { label: 'Active', variant: 'default' },
                inactive: { label: 'Inactive', variant: 'secondary' },
                pending: { label: 'Pending', variant: 'outline' },
            };

            const config = statusConfig[status] || statusConfig.active;

            return (
                <Badge variant={config.variant} className='text-xs'>
                    {config.label}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'bookings',
        header: 'Bookings',
        cell: ({ row }) => {
            const bookingCount = row.original?.bookings?.length || 0;

            return (
                <div className='text-center'>
                    <Badge variant='secondary' className='text-xs font-medium'>
                        {bookingCount} {bookingCount === 1 ? 'booking' : 'bookings'}
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: 'createdAt',
        header: 'Joined',
        cell: ({ row }) => {
            const date = row.original?.createdAt 
                ? new Date(row.original.createdAt)
                : new Date();
                
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
];