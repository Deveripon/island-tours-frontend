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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
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
import { formatKey } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowUpDownIcon, ArrowDown01Icon, ArrowUp01Icon, Search01Icon } from '@hugeicons/core-free-icons';

export function DataTable({
    groupedBookings,
    columns,
    data,
    typeFilter,
    setTypeFilter }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        enableFilters: true,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter: debouncedSearchQuery,
        },
        globalFilterFn: (row, id, filterValue) => {
            const searchValue = String(filterValue).toLowerCase();

            // Search in the name field
            const name = String(row.original['trip'].title || '').toLowerCase();
            if (name.includes(searchValue)) return true;

            // Search in types array
            const types = row.original['status'];
            if (Array.isArray(types)) {
                const typesString = types.join(' ').toLowerCase();
                if (typesString.includes(searchValue)) return true;
            }

            // Search in destination
            const trip = row.original['trip'];
            if (
                trip &&
                trip.destination &&
                trip.destination.name.includes(searchValue)
            )
                return true;

            // Search in Booking Reference ID
            const bookingReference = String(
                row.original['bookingReference'] || ''
            ).toLowerCase();
            if (bookingReference.includes(searchValue)) return true;

            return false;
        },
        filterFns: {
            customTypeFilter: (row, id, filterValue) => {
                const types = row.getValue(id);
                return (
                    filterValue === undefined ||
                    filterValue === '' ||
                    types.includes(filterValue)
                );
            },
        } });

    // Apply global search filter
    useEffect(() => {
        if (debouncedSearchQuery) {
            table.setGlobalFilter(debouncedSearchQuery);
        } else {
            table.setGlobalFilter('');
        }
    }, [debouncedSearchQuery, table]);

    // Apply type filter when changed
    useEffect(() => {
        const typesColumn = table.getColumn('status');
        if (typesColumn) {
            if (typeFilter === '') {
                typesColumn.setFilterValue(undefined);
            } else {
                typesColumn.setFilterValue(typeFilter);
            }
        }
    }, [typeFilter, table]);

    return (
        <div className='w-full'>
            <div className='flex items-center py-4 gap-2'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='outline' className='text-sm'>
                            {typeFilter === ''
                                ? 'All Types'
                                : formatKey(
                                      Object.keys(groupedBookings).find(
                                          t => t === typeFilter
                                      ) || ''
                                  ) || 'Filter by Type'}
                            <HugeiconsIcon icon={ArrowDown01Icon} className='ml-2 h-4 w-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='start'>
                        <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                            value={typeFilter}
                            onValueChange={setTypeFilter}>
                            <DropdownMenuRadioItem value=''>
                                All Types
                            </DropdownMenuRadioItem>
                            {Object.keys(groupedBookings).map(type => (
                                <DropdownMenuRadioItem key={type} value={type}>
                                    {formatKey(type)}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className='flex-1'>
                    <div className='relative max-w-xl w-full'>
                        <input
                            type='text'
                            placeholder='Search Bookings...'
                            value={searchQuery}
                            onChange={event =>
                                setSearchQuery(event.target.value)
                            }
                            className='w-full text-[14px] pl-4 pr-10 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground'
                        />
                        <HugeiconsIcon icon={Search01Icon} className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                    </div>
                </div>
            </div>

            <div className='rounded-md border border-border bg-card'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={`${
                                                header.column.getCanSort()
                                                    ? 'cursor-pointer select-none'
                                                    : ''
                                            } px-1 first:pl-6 `}
                                            onClick={header.column.getToggleSortingHandler()}>
                                            <div className='flex items-center'>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext()
                                                      )}

                                                {{
                                                    asc: (
                                                        <HugeiconsIcon icon={ArrowUp01Icon} className='ml-2 h-4 w-4' />
                                                    ),
                                                    desc: (
                                                        <HugeiconsIcon icon={ArrowDown01Icon} className='ml-2 h-4 w-4' />
                                                    ),
                                                    none: (
                                                        <HugeiconsIcon icon={ArrowUpDownIcon} className='h-3 w-3 text-muted-foreground' />
                                                    ),
                                                }[
                                                    header.column.getIsSorted()
                                                ] ?? null}
                                            </div>
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
                                        <TableCell
                                            className='px-1'
                                            key={cell.id}>
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
                                    className='h-24 text-center'>
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className='flex items-center justify-between space-x-2 py-4'>
                <div className='text-sm text-muted-foreground'>
                    {table.getFilteredSelectedRowModel().rows.length} of{' '}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
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
                                className='w-8 h-8 p-0'>
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
        </div>
    );
}

