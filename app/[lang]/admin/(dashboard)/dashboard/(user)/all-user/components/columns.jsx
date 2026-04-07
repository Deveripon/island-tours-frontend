'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn, formateToCapitalize } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { Mail, Shield } from 'lucide-react';
import Image from 'next/image';
import { UserActionDropdown } from './users-action-dropdown';

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
        accessorKey: 'image',
        header: 'Avatar',
        cell: ({ row }) => {
            const image = row.original.image;

            return (
                <Avatar className='h-16 w-16 rounded-md'>
                    <AvatarImage
                        src={
                            image?.url ||
                            image ||
                            'https://github.com/shadcn.png'
                        }
                        alt={row.original.name}
                        className='object-cover'
                    />
                    <AvatarFallback>
                        {row.original.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            );
        },
    },
    {
        accessorKey: 'name',
        header: 'User Details',
        cell: ({ row }) => {
            const email = row.original.email;
            const isOwner = !row.original.createdById;

            return (
                <div className='max-w-[250px] space-y-1'>
                    <div className='flex items-center gap-2'>
                        <div className='font-medium text-sm truncate'>
                            {row.original.name}
                        </div>
                        {isOwner && (
                            <Badge
                                variant='secondary'
                                className='text-xs px-2 py-0'>
                                Owner
                            </Badge>
                        )}
                    </div>
                    {email && (
                        <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                            <Mail className='h-3 w-3' />
                            <span className='truncate'>{email}</span>
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => {
            const role = row.original.role;
            const roleDisplay =
                role === 'ADMIN' ? 'Administrator' : formateToCapitalize(role);

            return (
                <div className='flex items-center gap-2'>
                    <Shield
                        className={cn(
                            'h-4 w-4',
                            role === 'ADMIN'
                                ? 'text-green-600'
                                : 'text-orange-600'
                        )}
                    />
                    <Badge
                        variant='outline'
                        className={cn(
                            'text-xs',
                            role === 'ADMIN'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-orange-50 text-orange-700 border-orange-200'
                        )}>
                        {roleDisplay}
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.status;

            return (
                <Badge
                    variant='outline'
                    className={cn(
                        'text-xs',
                        status === 'ACTIVE'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                    )}>
                    {formateToCapitalize(status)}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'createdById',
        header: 'Created By',
        cell: ({ row, table }) => {
            const createdById = row.original.createdById;

            if (!createdById) {
                return (
                    <span className='text-xs text-muted-foreground'>
                        Account Owner
                    </span>
                );
            }

            // Find the creator from the data
            const creator = table.options.data.find(
                user => user.id === createdById
            );

            if (!creator) {
                return <span className='text-xs text-muted-foreground'>—</span>;
            }

            return (
                <div className='flex items-center gap-2'>
                    <Image
                        src={
                            creator.image?.url ||
                            creator.image ||
                            '/placeholder.svg'
                        }
                        alt={creator.name}
                        width={24}
                        height={24}
                        className='rounded-full object-cover'
                    />
                    <div className='text-sm truncate max-w-[120px]'>
                        {creator.name}
                    </div>
                </div>
            );
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
        cell: ({ row }) => {
            const user = row.original;
            return <UserActionDropdown user={user} />;
        },
    },
];

