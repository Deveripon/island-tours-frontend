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
    blog,
    meta,
    isLoading,
    defineActionBasedOnStatus }) {
    const params = useParams();
    const hasEditPermission = useRolePermission(Permission.EDIT_BLOG);
    const hasViewPermission = useRolePermission(Permission.VIEW_BLOGS);
    const hasDeletePermission = useRolePermission(Permission.DELETE_BLOG);

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
                        navigator.clipboard.writeText(blog.id);
                        toast.success('Blog ID copied to clipboard!');
                    }}
                    className='gap-2 cursor-pointer'>
                    <HugeiconsIcon icon={Copy01Icon} size={16} />
                    <span>Copy ID</span>
                </DropdownMenuItem>

                {hasEditPermission && (
                    <>
                        <DropdownMenuItem
                            onClick={() => {
                                document.dispatchEvent(
                                    new CustomEvent('duplicateBlog', {
                                        detail: blog?.id })
                                );
                            }}
                            className='gap-2 cursor-pointer'>
                            <CopyPlus className='h-4 w-4' />
                            <span>Duplicate</span>
                        </DropdownMenuItem>
                    </>
                )}

                <DropdownMenuSeparator />

                {hasEditPermission && (
                    <>
                        <DropdownMenuItem
                            onClick={() =>
                                meta.changeStatus(
                                    blog.id,
                                    defineActionBasedOnStatus(blog.status)
                                        .action
                                )
                            }
                            disabled={isLoading}
                            className={cn(
                                'gap-2 cursor-pointer',
                                isLoading && 'opacity-50 cursor-not-allowed'
                            )}>
                            {isLoading ? (
                                <Loader2 className='h-4 w-4 animate-spin' />
                            ) : (
                                defineActionBasedOnStatus(blog.status).icon
                            )}
                            <span>
                                {defineActionBasedOnStatus(blog.status).label}
                            </span>
                        </DropdownMenuItem>
                    </>
                )}

                {hasViewPermission && (
                    <>
                        <DropdownMenuItem className='gap-2 cursor-pointer p-0'>
                            <Link
                                target='_blank'
                                href={`/site/${params.tenant}/blogs/${blog.slug}?preview=true`}
                                className='flex items-center gap-2 w-full px-2 py-1.5'>
                                <HugeiconsIcon icon={ViewIcon} size={16} />
                                <span>View Blog</span>
                            </Link>
                        </DropdownMenuItem>
                    </>
                )}

                {hasEditPermission && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                meta.editBlog(blog.id);
                            }}
                            className='gap-2 cursor-pointer'>
                            <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
                            <span>Edit Blog</span>
                        </DropdownMenuItem>
                    </>
                )}

                {hasDeletePermission && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => meta.deleteBlog(blog.id)}
                            className='gap-2 cursor-pointer text-destructive focus:text-destructive'>
                            <HugeiconsIcon icon={Delete02Icon} size={16} />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}