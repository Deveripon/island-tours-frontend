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
import { Permission } from '@/RBAC.config';
import { Copy01Icon, Delete02Icon, MoreHorizontalIcon, PencilEdit01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { toast } from 'sonner';

export function PickupActionDropdown({ pickup }) {
    const hasEditPermission = useRolePermission(Permission.EDIT_PICKUP_DROP);
    const hasDeletePermission = useRolePermission(
        Permission.DELETE_PICKUP_DROP
    );

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
                        navigator.clipboard.writeText(pickup.id);
                        toast.success('Pickup ID copied to clipboard!');
                    }}
                    className='gap-2 cursor-pointer'>
                    <HugeiconsIcon icon={Copy01Icon} size={16} />
                    <span>Copy ID</span>
                </DropdownMenuItem>

                {hasEditPermission && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                document.dispatchEvent(
                                    new CustomEvent('edit-pickup', {
                                        detail: pickup })
                                );
                            }}
                            className='gap-2 cursor-pointer'>
                            <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
                            <span>Edit Pickup</span>
                        </DropdownMenuItem>
                    </>
                )}

                {hasDeletePermission && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                document.dispatchEvent(
                                    new CustomEvent('delete-pickup', {
                                        detail: pickup.id })
                                );
                            }}
                            className='gap-2 cursor-pointer text-destructive focus:text-destructive'>
                            <HugeiconsIcon icon={Delete02Icon} size={16} />
                            <span>Delete Pickup</span>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
