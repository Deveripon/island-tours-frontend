'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRolePermission } from '@/hooks/useRolePermission';
import { cn } from '@/lib/utils';
import { Permission } from '@/RBAC.config';
import { Copy01Icon, Delete02Icon, MoreHorizontalIcon, PencilEdit01Icon, ViewIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { CopyPlus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

export function ActionDropdown({
    tripPackages,
    meta,
    isLoading,
    defineActionBasedOnStatus }) {
    const params = useParams();
    const hasEditPermission = useRolePermission(Permission.EDIT_TRIP);
    const hasViewPermission = useRolePermission(Permission.VIEW_TRIPS);
    const hasDeletePermission = useRolePermission(Permission.DELETE_TRIP);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                    <span className='sr-only'>Open menu</span>
                    <HugeiconsIcon icon={MoreHorizontalIcon} size={16} />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' className='w-[200px]'>
                <DropdownMenuLabel className='text-xs font-medium text-muted-foreground uppercase'>
                    Actions
                </DropdownMenuLabel>

                <DropdownMenuItem
                    onClick={() => {
                        navigator.clipboard.writeText(tripPackages.id);
                        toast.success('Package ID copied to clipboard!');
                    }}
                    className='gap-2 cursor-pointer'>
                    <HugeiconsIcon icon={Copy01Icon} size={16} />
                    <span>Copy Package ID</span>
                </DropdownMenuItem>

                {hasEditPermission && (
                    <DropdownMenuItem
                        onClick={() => {
                            document.dispatchEvent(
                                new CustomEvent('duplicatePackage', {
                                    detail: tripPackages?.id })
                            );
                        }}
                        className='gap-2 cursor-pointer'>
                        <CopyPlus className='h-4 w-4' />
                        <span>Duplicate Package</span>
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                {hasEditPermission && (
                    <DropdownMenuItem
                        onClick={() =>
                            meta.changeStatus(
                                tripPackages.id,
                                defineActionBasedOnStatus(tripPackages.status)
                                    .action
                            )
                        }
                        disabled={isLoading}
                        className={cn(
                            'gap-2 cursor-pointer',
                            defineActionBasedOnStatus(tripPackages.status)
                                .className,
                            isLoading && 'opacity-50 cursor-not-allowed'
                        )}>
                        {isLoading ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                        ) : (
                            defineActionBasedOnStatus(tripPackages.status).icon
                        )}
                        <span>
                            {
                                defineActionBasedOnStatus(tripPackages.status)
                                    .label
                            }
                        </span>
                    </DropdownMenuItem>
                )}

                {hasViewPermission && (
                    <DropdownMenuItem className='gap-2 cursor-pointer p-0'>
                        <Link
                            target='_blank'
                            href={`/trips/${tripPackages.slug}?preview=true`}
                            className='flex items-center gap-2 w-full px-2 py-1.5'>
                            <HugeiconsIcon icon={ViewIcon} size={16} />
                            <span>View Trip</span>
                        </Link>
                    </DropdownMenuItem>
                )}

                {hasEditPermission && (
                    <DropdownMenuItem
                        onClick={() => {
                            meta.editTrip(tripPackages.id);
                        }}
                        className='gap-2 cursor-pointer'>
                        <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
                        <span>Edit Trip</span>
                    </DropdownMenuItem>
                )}

                {hasDeletePermission && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => meta.deleteTrip(tripPackages.id)}
                            className='gap-2 cursor-pointer text-destructive focus:text-destructive'>
                            <HugeiconsIcon icon={Delete02Icon} size={16} />
                            <span>Delete Package</span>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
