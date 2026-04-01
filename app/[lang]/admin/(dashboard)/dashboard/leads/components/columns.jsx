'use client';

import GoogleForms from '@/components/svg/google-forms';
import Mailchimp from '@/components/svg/mailchimp';
import N8nIcon from '@/components/svg/n8n';
import Zapier2Icon from '@/components/svg/zapier-2nd';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Calendar,
    Facebook,
    Globe,
    Linkedin,
    Mail,
    MessageSquare,
    Phone,
    Trash2,
    Twitter,
    Users,
} from 'lucide-react';

const getSourceIcon = source => {
    if (!source) return <Globe className='h-4 w-4 text-muted-foreground' />;

    const sourceLower = source.toLowerCase();

    if (sourceLower.includes('mailchimp') || sourceLower.includes('email')) {
        return <Mailchimp className='h-4 w-4' />;
    }
    if (sourceLower.includes('google') && sourceLower.includes('form')) {
        return <GoogleForms className='h-4 w-4' />;
    }
    if (sourceLower.includes('linkedin')) {
        return <Linkedin className='h-4 w-4 text-blue-600' />;
    }
    if (sourceLower.includes('facebook')) {
        return <Facebook className='h-4 w-4 text-blue-700' />;
    }
    if (sourceLower.includes('twitter') || sourceLower.includes('x.com')) {
        return <Twitter className='h-4 w-4 text-sky-500' />;
    }
    if (
        sourceLower.includes('website') ||
        sourceLower.includes('landing page')
    ) {
        return <Globe className='h-4 w-4 text-green-500' />;
    }
    if (sourceLower.includes('call') || sourceLower.includes('phone')) {
        return <Phone className='h-4 w-4 text-purple-500' />;
    }
    if (sourceLower.includes('chat') || sourceLower.includes('whatsapp')) {
        return <MessageSquare className='h-4 w-4 text-green-600' />;
    }
    if (sourceLower.includes('event') || sourceLower.includes('webinar')) {
        return <Calendar className='h-4 w-4 text-red-500' />;
    }
    if (sourceLower.includes('referral')) {
        return <Users className='h-4 w-4 text-indigo-500' />;
    }

    return <Globe className='h-4 w-4 text-muted-foreground' />;
};

export const leadsColumns = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
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
        header: 'Lead Info',
        cell: ({ row }) => {
            const name = row.getValue('name');
            const email = row.original.email;
            const initials =
                name
                    ?.split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) || 'L';

            return (
                <div className='flex items-center gap-3 max-w-[300px]'>
                    <Avatar className='h-10 w-10'>
                        <AvatarImage
                            src={row.original.image || undefined}
                            alt={name}
                        />
                        <AvatarFallback className='text-sm font-medium bg-primary/10 text-primary'>
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className='space-y-1 min-w-0'>
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
        accessorKey: 'company',
        header: 'Company',
        cell: ({ row }) => {
            const company = row.getValue('company');
            return (
                <div className='text-sm'>
                    {company ? (
                        <span className='font-medium'>{company}</span>
                    ) : (
                        <span className='text-muted-foreground'>—</span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'phone',
        header: 'Contact',
        cell: ({ row }) => {
            const phone = row.getValue('phone');
            const message = row.original.message;

            return (
                <div className='space-y-1.5 max-w-[200px]'>
                    {phone ? (
                        <div className='flex items-center gap-1.5'>
                            <Phone className='h-3 w-3 text-muted-foreground' />
                            <a
                                href={`tel:${phone}`}
                                className='text-sm hover:text-primary transition-colors'>
                                {phone}
                            </a>
                        </div>
                    ) : (
                        <span className='text-xs text-muted-foreground'>
                            No phone
                        </span>
                    )}
                    {message && (
                        <p className='text-xs text-muted-foreground line-clamp-1'>
                            {message}
                        </p>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'source',
        header: 'Source',
        cell: ({ row }) => {
            const source = row.getValue('source');
            const icon = getSourceIcon(source);

            return (
                <div className='flex items-center gap-2'>
                    {icon}
                    <span className='text-sm'>{source || 'Unknown'}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'createdAt',
        header: 'Added',
        cell: ({ row }) => {
            const date = row.original?.createdAt
                ? new Date(row.original.createdAt)
                : new Date();

            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });

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
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const lead = row.original;

            return (
                <div className='flex items-center gap-1'>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => {
                            document.dispatchEvent(
                                new CustomEvent('push-to-zapier', {
                                    detail: { ids: [lead.id] },
                                })
                            );
                        }}
                        className='h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-600'
                        title='Push to Zapier'>
                        <Zapier2Icon className='h-5 w-5' />
                    </Button>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => {
                            document.dispatchEvent(
                                new CustomEvent('push-to-n8n', {
                                    detail: { ids: [lead.id] },
                                })
                            );
                        }}
                        className='h-8 w-8 p-0 hover:bg-pink-50 hover:text-pink-600'
                        title='Push to n8n'>
                        <N8nIcon className='h-5 w-5' />
                    </Button>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => {
                            document.dispatchEvent(
                                new CustomEvent('push-to-mailchimp', {
                                    detail: { id: lead.id },
                                })
                            );
                        }}
                        className='h-8 w-8 p-0 hover:bg-yellow-50 hover:text-yellow-600'
                        title='Push to Mailchimp'>
                        <Mailchimp className='h-5 w-5' />
                    </Button>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => {
                            document.dispatchEvent(
                                new CustomEvent('delete-leads', {
                                    detail: { ids: [lead.id] },
                                })
                            );
                        }}
                        className='h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600'
                        title='Delete'>
                        <Trash2 className='h-4 w-4' />
                    </Button>
                </div>
            );
        },
        enableSorting: false,
    },
];

