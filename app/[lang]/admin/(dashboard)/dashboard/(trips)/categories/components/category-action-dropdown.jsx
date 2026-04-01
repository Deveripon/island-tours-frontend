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

export function CategoryActionDropdown({ category }) {
    const hasEditPermission = useRolePermission(Permission.EDIT_CATEGORY);
    const hasDeletePermission = useRolePermission(Permission.DELETE_CATEGORY);

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
                        navigator.clipboard.writeText(category.id);
                        toast.success('Category ID copied to clipboard!');
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
                                    new CustomEvent('edit-category', {
                                        detail: category })
                                );
                            }}
                            className='gap-2 cursor-pointer'>
                            <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
                            <span>Edit Category</span>
                        </DropdownMenuItem>
                    </>
                )}

                {hasDeletePermission && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                document.dispatchEvent(
                                    new CustomEvent('delete-category', {
                                        detail: category.id })
                                );
                            }}
                            className='gap-2 cursor-pointer text-destructive focus:text-destructive'>
                            <HugeiconsIcon icon={Delete02Icon} size={16} />
                            <span>Delete Category</span>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}