'use client';

import { Permission } from '@/RBAC.config';
import DeleteConfirmationDialog from '@/app/[lang]/admin/(dashboard)/dashboard/components/common/delete-confirmation-dialog';
import {
    createNewBlog,
    deleteBlogById,
    getSingleBlog,
    updateBlogById,
} from '@/app/_actions/blogs';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useDebounce } from '@/hooks/use-debounce';
import { useRolePermission } from '@/hooks/useRolePermission';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function Blogs({ tenantId, columns, data }) {
    const [sorting, setSorting] = useState([]);
    const [loading, setLoading] = useState(null);
    const [columnFilters, setColumnFilters] = useState([]);
    const [tableData, setTableData] = useState(data);
    const [columnVisibility, setColumnVisibility] = useState({});

    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [rowSelection, setRowSelection] = useState({});

    const [searchQuery, setSearchQuery] = useState('');

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const [statusFilter, setStatusFilter] = useState('All');
    const router = useRouter();

    const hasCreatePermission = useRolePermission(Permission.CREATE_BLOG);

    // Update local data when props change
    useEffect(() => {
        setTableData(data);
    }, [data]);

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        if (!blogToDelete) return;

        setIsDeleting(true);

        try {
            const result = await deleteBlogById(blogToDelete);

            if (result?.success === true) {
                toast.success('Blog deleted successfully');
            } else {
                const errorMessage =
                    result?.error &&
                    typeof result.error === 'object' &&
                    'message' in result.error
                        ? result.error.message
                        : result?.error || 'Failed to delete blog';

                toast.error(errorMessage);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsDeleting(false);
            setIsShowConfirm(false);
            setBlogToDelete(null);
        }
    };

    // Listen for duplication events
    useEffect(() => {
        const handleDuplicate = async e => {
            const blogId = e.detail;
            const detailsOfBlog = await getSingleBlog(blogId);

            if (detailsOfBlog?.success) {
                const blogData = {
                    ...detailsOfBlog?.blog?.data,
                    title: `Copy of ${detailsOfBlog?.blog?.data?.title}`,
                    slug: `${
                        detailsOfBlog?.blog?.data?.slug
                    }-copy-${Date.now()}`,
                };

                if (blogData) {
                    const res = await createNewBlog(blogData);
                    if (res?.success) {
                        toast.success('Blog duplicated successfully');
                    }
                }
            }
        };

        document.addEventListener('duplicateBlog', handleDuplicate);

        return () => {
            document.removeEventListener('duplicateBlog', handleDuplicate);
        };
    }, []);

    // Handle delete cancellation
    const handleDeleteCancel = () => {
        setIsShowConfirm(false);
        setBlogToDelete(null);
    };

    const table = useReactTable({
        data: tableData,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter: debouncedSearchQuery,
        },
        meta: {
            changeStatus: async (id, status) => {
                try {
                    setLoading(id);

                    const result = await updateBlogById(id, {
                        status,
                    });

                    if (result.success) {
                        setTableData(prevData =>
                            prevData.map(item =>
                                item.id === id ? { ...item, status } : item
                            )
                        );

                        toast.success('Status Updated');
                    } else {
                        throw new Error(
                            result.error?.message || 'Update failed'
                        );
                    }
                } catch (error) {
                    toast.error('There was an error while updating');
                } finally {
                    setLoading(null);
                }
            },
            deleteBlog: async id => {
                setBlogToDelete(id);
                setIsShowConfirm(true);
            },

            editBlog: id => {
                const params = `edit&mode=update&id=${id}`;
                router.push(`/${tenantId}/dashboard/create-blog?${params}`);
            },
            loading,
        },
    });

    useEffect(() => {
        table.setGlobalFilter(debouncedSearchQuery);
    }, [debouncedSearchQuery, table]);

    return (
        <div className='w-full space-y-4'>
            {/* Filters and Search */}
            <div className='flex items-center gap-3'>
                <DropdownMenu>
                    <DropdownMenuTrigger className='min-w-[150px]' asChild>
                        <Button variant='outline' size='sm'>
                            {statusFilter}{' '}
                            <ChevronDown className='ml-2 h-4 w-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuRadioGroup
                            value={statusFilter}
                            onValueChange={value => {
                                setStatusFilter(value);

                                if (value === 'Draft') {
                                    table
                                        .getColumn('status')
                                        ?.setFilterValue('DRAFT');
                                } else if (value === 'Published') {
                                    table
                                        .getColumn('status')
                                        ?.setFilterValue('PUBLISHED');
                                } else if (value === 'Archived') {
                                    table
                                        .getColumn('status')
                                        ?.setFilterValue('ARCHIVED');
                                } else {
                                    table
                                        .getColumn('status')
                                        ?.setFilterValue(undefined);
                                }
                            }}>
                            {['All', 'Draft', 'Published', 'Archived'].map(
                                item => (
                                    <DropdownMenuRadioItem
                                        key={item}
                                        value={item}>
                                        {item}
                                    </DropdownMenuRadioItem>
                                )
                            )}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className='flex-1 min-w-[200px]'>
                    <div className='relative'>
                        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                        <input
                            type='text'
                            placeholder='Search blogs...'
                            value={searchQuery}
                            onChange={event =>
                                setSearchQuery(event.target.value)
                            }
                            className='w-full h-9 rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                        />
                    </div>
                </div>

                {hasCreatePermission && (
                    <Link href={`/${tenantId}/dashboard/create-blog`}>
                        <Button size='sm'>
                            <Plus className='mr-2 h-4 w-4' />
                            Create Blog
                        </Button>
                    </Link>
                )}
            </div>

            {/* Table */}
            <div className='rounded-lg border bg-card shadow-sm'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead
                                            className='h-12'
                                            key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className='h-32 text-center'>
                                    <div className='flex flex-col items-center justify-center text-muted-foreground'>
                                        <p className='text-sm font-medium'>
                                            No results found
                                        </p>
                                        <p className='text-xs mt-1'>
                                            Try adjusting your search
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className='flex items-center justify-between px-2'>
                <div className='text-sm text-muted-foreground'>
                    {table.getFilteredSelectedRowModel().rows.length} of{' '}
                    {table.getFilteredRowModel().rows.length} row(s) selected
                </div>

                <div className='flex items-center space-x-2'>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    <div className='flex items-center gap-1'>
                        {Array.from(
                            { length: table.getPageCount() },
                            (_, i) => i + 1
                        ).map(page => (
                            <Button
                                key={page}
                                variant={
                                    table.getState().pagination.pageIndex +
                                        1 ===
                                    page
                                        ? 'default'
                                        : 'outline'
                                }
                                size='sm'
                                onClick={() => table.setPageIndex(page - 1)}
                                className='h-9 w-9 p-0'>
                                {page}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                isShowConfirm={isShowConfirm}
                setIsShowConfirm={setIsShowConfirm}
                handleDeleteConfirm={handleDeleteConfirm}
                handleDeleteCancel={handleDeleteCancel}
                isDeleting={isDeleting}
                title='Are you absolutely sure?'
                description='This action cannot be undone. This will permanently delete this blog and all associated data.'
            />
        </div>
    );
}

