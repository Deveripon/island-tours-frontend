'use client';

// These columns are primarily used for sorting and filtering
// The actual display is handled in the inbox-style DataTable component
export const columns = [
    {
        accessorKey: 'name',
        header: 'Name',
        enableSorting: true,
    },
    {
        accessorKey: 'email',
        header: 'Email',
        enableSorting: true,
    },
    {
        accessorKey: 'subject',
        header: 'Subject',
        enableSorting: true,
    },
    {
        accessorKey: 'message',
        header: 'Message',
        enableSorting: false,
    },
    {
        accessorKey: 'status',
        header: 'Status',
        enableSorting: true,
        filterFn: (row, id, value) => {
            return value === '' || row.getValue(id) === value;
        },
    },
    {
        accessorKey: 'createdAt',
        header: 'Date',
        enableSorting: true,
        sortingFn: 'datetime',
    },
    {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
    },
];