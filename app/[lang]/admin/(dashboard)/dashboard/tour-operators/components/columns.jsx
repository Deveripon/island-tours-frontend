'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { generateSlug } from '@/lib/utils';
import { Mail, Phone, User } from 'lucide-react';
import { TourOperatorActionDropdown } from './tour-operator-action-dropdown';

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
        accessorKey: 'photo',
        header: 'Image',
        cell: ({ row }) => {
            const image = row.original.photo?.image?.url;

            return (
                <Avatar className='h-16 w-16 rounded-md'>
                    <AvatarImage
                        src={image || '/placeholder.svg'}
                        alt={row.original.name}
                        className='object-cover'
                    />
                </Avatar>
            );
        },
    },
    {
        accessorKey: 'name',
        header: 'Partner Name',
        cell: ({ row }) => {
            return (
                <div className='max-w-[250px]'>
                    <div className='font-medium text-sm truncate'>
                        {row.original.name}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => {
            const email = row.original.email;

            return (
                <div className='max-w-[200px]'>
                    {email ? (
                        <div className='flex items-center gap-2'>
                            <Mail className='h-3.5 w-3.5 text-muted-foreground' />
                            <span className='text-sm truncate'>{email}</span>
                        </div>
                    ) : (
                        <span className='text-xs text-muted-foreground'>—</span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) => {
            const phone = row.original.phone;

            return (
                <div>
                    {phone ? (
                        <div className='flex items-center gap-2'>
                            <Phone className='h-3.5 w-3.5 text-muted-foreground' />
                            <span className='text-sm'>{phone}</span>
                        </div>
                    ) : (
                        <span className='text-xs text-muted-foreground'>—</span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'createdBy',
        header: 'Created By',
        cell: ({ row }) => {
            const createdBy = row.original.createdBy?.name;
            const createdByEmail = row.original.createdBy?.email;

            return (
                <div className='max-w-[200px]'>
                    {createdBy ? (
                        <div className='space-y-0.5'>
                            <div className='flex items-center gap-2'>
                                <User className='h-3.5 w-3.5 text-muted-foreground' />
                                <span className='text-sm font-medium truncate'>
                                    {createdBy}
                                </span>
                            </div>
                            {createdByEmail && (
                                <div className='text-xs text-muted-foreground truncate pl-5'>
                                    {createdByEmail}
                                </div>
                            )}
                        </div>
                    ) : (
                        <span className='text-xs text-muted-foreground'>—</span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'links',
        header: 'Links',
        cell: ({ row }) => {
            const links = row.original.links;

            if (!links) {
                return <span className='text-xs text-muted-foreground'>—</span>;
            }

            return (
                <Badge variant='secondary' className='text-xs'>
                    Has Links
                </Badge>
            );
        },
    },
    {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt);
            const formatted = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric' });

            return (
                <div className='text-sm text-muted-foreground'>
                    {formatted}
                </div>
            );
        },
    },
    {
        id: 'slug',
        accessorFn: row => generateSlug(row.name),
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
            const tourOperator = row.original;
            return <TourOperatorActionDropdown tourOperator={tourOperator} />;
        },
    },
];