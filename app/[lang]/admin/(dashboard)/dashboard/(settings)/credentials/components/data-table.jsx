'use client';
import { useDebounce } from '@/hooks/use-debounce';

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
    Search01Icon,
    ArrowLeft01Icon,
    ArrowRight01Icon,
    ArrowLeft02Icon,
    ArrowRight02Icon,
    ArrowDown01Icon,
    ArrowUp01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export function DataTable({ columns, data }) {
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setSearchQuery,
        enableGlobalFilter: true,
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
        state: {
            columnVisibility,
            rowSelection,
            globalFilter: debouncedSearchQuery,
        },
        globalFilterFn: (row, columnId, filterValue) => {
            if (!filterValue) return true;

            const searchValue = String(filterValue).toLowerCase().trim();

            // Search in the label field
            const label = String(row.getValue('label') || '').toLowerCase();
            if (label.includes(searchValue)) return true;

            // Search in all visible columns
            return row.getVisibleCells().some(cell => {
                const cellValue = String(cell.getValue() || '').toLowerCase();
                return cellValue.includes(searchValue);
            });
        } });

    useEffect(() => {
        table.setGlobalFilter(debouncedSearchQuery);
    }, [debouncedSearchQuery, table]);

    return (
        <div className='w-full space-y-4'>
            {/* Enhanced Search Bar */}
            <div className='flex items-center gap-3'>
                <div className='flex-1 min-w-[200px]'>
                    <div className='relative'>
                        <HugeiconsIcon icon={Search01Icon} size={16} className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                        <input
                            type='text'
                            placeholder='Search API keys...'
                            value={searchQuery}
                            onChange={event =>
                                setSearchQuery(event.target.value)
                            }
                            className='w-full h-9 rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                        />
                    </div>
                </div>

                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <span className='font-medium'>
                        {table.getFilteredRowModel().rows.length}
                    </span>
                    <span>API keys found</span>
                </div>
            </div>

            {/* Enhanced Table */}
            <div className='rounded-xl border border-border bg-card shadow-sm overflow-hidden'>
                <Table>
                    <TableHeader className='bg-muted/50'>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow
                                key={headerGroup.id}
                                className='border-b border-border'>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={cn(
                                                'font-semibold text-foreground py-4',
                                                header.column.getCanSort()
                                                    ? 'cursor-pointer select-none hover:bg-accent/50 transition-colors'
                                                    : ''
                                            )}
                                            onClick={header.column.getToggleSortingHandler()}>
                                            <div className='flex items-center gap-2'>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext()
                                                      )}
                                                {{
                                                    asc: (
                                                        <HugeiconsIcon icon={ArrowUp01Icon} size={16} className='text-primary' />
                                                    ),
                                                    desc: (
                                                        <HugeiconsIcon icon={ArrowDown01Icon} size={16} className='text-primary' />
                                                    ),
                                                }[
                                                    header.column.getIsSorted()
                                                ] ??
                                                    (header.column.getCanSort() && (
                                                        <HugeiconsIcon icon={ArrowDown01Icon} size={16} className='text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity' />
                                                    ))}
                                            </div>
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                    className={cn(
                                        'border-b border-border hover:bg-accent/50 transition-colors',
                                        row.getIsSelected() && 'bg-primary/10'
                                    )}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell
                                            key={cell.id}
                                            className='py-4'>
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
                                    <div className='flex flex-col items-center justify-center gap-2 text-muted-foreground'>
                                        <HugeiconsIcon icon={Search01Icon} size={32} className='text-muted-foreground/40' />
                                        <div className='text-sm font-medium'>
                                            No API keys found
                                        </div>
                                        <div className='text-xs'>
                                            Try adjusting your search terms
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Enhanced Pagination */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                    <div>
                        <span className='font-medium text-foreground'>
                            {table.getFilteredSelectedRowModel().rows.length}
                        </span>{' '}
                        of{' '}
                        <span className='font-medium text-foreground'>
                            {table.getFilteredRowModel().rows.length}
                        </span>{' '}
                        row(s) selected
                    </div>
                    <div className='text-muted-foreground/50'>•</div>
                    <div>
                        Page{' '}
                        <span className='font-medium text-foreground'>
                            {table.getState().pagination.pageIndex + 1}
                        </span>{' '}
                        of{' '}
                        <span className='font-medium text-foreground'>
                            {table.getPageCount()}
                        </span>
                    </div>
                </div>

                <div className='flex items-center gap-1'>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                        className='h-8 w-8 p-0'>
                        <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className='h-8 w-8 p-0'>
                        <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
                    </Button>

                    <div className='flex items-center gap-1 mx-2'>
                        {(() => {
                            const currentPage =
                                table.getState().pagination.pageIndex + 1;
                            const totalPages = table.getPageCount();
                            const pages = [];

                            // Show first page
                            if (currentPage > 3) {
                                pages.push(1);
                                if (currentPage > 4) pages.push('...');
                            }

                            // Show pages around current page
                            for (
                                let i = Math.max(1, currentPage - 1);
                                i <= Math.min(totalPages, currentPage + 1);
                                i++
                            ) {
                                pages.push(i);
                            }

                            // Show last page
                            if (currentPage < totalPages - 2) {
                                if (currentPage < totalPages - 3)
                                    pages.push('...');
                                pages.push(totalPages);
                            }

                            return pages.map((page, index) =>
                                page === '...' ? (
                                    <span
                                        key={`ellipsis-${index}`}
                                        className='px-2 text-muted-foreground/50'>
                                        ...
                                    </span>
                                ) : (
                                    <Button
                                        key={page}
                                        variant={
                                            currentPage === page
                                                ? 'default'
                                                : 'outline'
                                        }
                                        size='sm'
                                        onClick={() =>
                                            table.setPageIndex(page - 1)
                                        }
                                        className={cn(
                                            'h-8 w-8 p-0',
                                            currentPage === page
                                                ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm'
                                                : 'hover:bg-accent'
                                        )}>
                                        {page}
                                    </Button>
                                )
                            );
                        })()}
                    </div>

                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className='h-8 w-8 p-0'>
                        <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() =>
                            table.setPageIndex(table.getPageCount() - 1)
                        }
                        disabled={!table.getCanNextPage()}
                        className='h-8 w-8 p-0'>
                        <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
}

