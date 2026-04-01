import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Delete02Icon,
    DragDropVerticalIcon,
    InformationCircleIcon,
    PencilEdit01Icon,
    PlusSignIcon,
    Tick01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Plus } from 'lucide-react';
import { EditingSheetRight } from '../../editing-forms/editing-sheet-right';
import { IconPicker } from '../common/icon-picker';

const SortableHeader = ({ header, index, updateHeader, deleteHeader }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: header.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'flex-1 flex items-center gap-1.5 p-1.5 rounded-lg border border-border bg-card group transition-all hover:border-primary/50 shadow-sm min-w-[140px]',
                isDragging
                    ? 'opacity-50 ring-2 ring-primary border-primary shadow-xl z-[100]'
                    : ''
            )}>
            <div
                {...attributes}
                {...listeners}
                className='cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-primary p-1 bg-muted/30 rounded-md'>
                <HugeiconsIcon icon={DragDropVerticalIcon} size={12} />
            </div>
            <Input
                value={header.label}
                onChange={e => updateHeader(index, e.target.value)}
                placeholder='Header'
                className='h-8 flex-1 text-[11px] bg-background border-border rounded-md focus:ring-1 focus:ring-primary/20 focus:border-primary shadow-none px-2'
            />
            <button
                onClick={() => deleteHeader(index)}
                className='p-1 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-md transition-all opacity-0 group-hover:opacity-100'>
                <HugeiconsIcon icon={Delete02Icon} size={12} />
            </button>
        </div>
    );
};

const SortableRow = ({ row, index, headers, updateRow, deleteRow }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: row.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'group relative flex items-center gap-3 p-2 rounded-lg border border-border bg-card transition-all hover:border-primary/40 shadow-sm',
                row.type === 'header'
                    ? 'bg-primary/[0.03] border-primary/10'
                    : '',
                isDragging
                    ? 'opacity-50 ring-2 ring-primary border-primary shadow-xl z-50'
                    : ''
            )}>
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className='shrink-0 p-1 cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-primary transition-colors bg-muted/30 rounded-lg'>
                <HugeiconsIcon icon={DragDropVerticalIcon} size={16} />
            </div>

            {/* Content Area */}
            <div className='flex-1 flex items-center gap-3 min-w-0'>
                {row.type === 'header' ? (
                    <div className='flex-1 flex items-center gap-3'>
                        <div className='px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[9px] font-black   tracking-wider shrink-0'>
                            Header
                        </div>
                        <Input
                            value={row.label}
                            onChange={e =>
                                updateRow(index, 'label', e.target.value)
                            }
                            onPointerDown={e => e.stopPropagation()}
                            placeholder='Section Title...'
                            className='h-9 bg-background border-border rounded-lg  text-xs  focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all'
                        />
                    </div>
                ) : (
                    <>
                        {/* Icon Side */}
                        <div className='shrink-0'>
                            <IconPicker
                                value={row.icon}
                                onChange={v => updateRow(index, 'icon', v)}
                                className='w-9 h-9 rounded-lg shadow-none border-dashed'
                            />
                        </div>

                        {/* Fields Side (Horizontal Scrollable) */}
                        <div className='flex-1 flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20'>
                            {headers.map(header => (
                                <div
                                    key={header.id}
                                    className='min-w-[140px] space-y-1 py-0.5'>
                                    <Input
                                        value={row.values?.[header.id] || ''}
                                        onChange={e => {
                                            const newValues = {
                                                ...row.values,
                                                [header.id]: e.target.value,
                                            };
                                            updateRow(
                                                index,
                                                'values',
                                                newValues
                                            );
                                        }}
                                        onPointerDown={e => e.stopPropagation()}
                                        placeholder={`${header.label}...`}
                                        className='h-9 text-[12px] bg-background border-border rounded-lg transition-all shrink-0'
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Action Side */}
            <button
                onClick={() => deleteRow(index)}
                className='shrink-0 p-2 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all opacity-0 group-hover:opacity-100'
                title='Delete Row'>
                <HugeiconsIcon icon={Delete02Icon} size={16} />
            </button>
        </div>
    );
};

export const TableForm = ({
    isEditing,
    setIsEditing,
    data,
    setData,
    onSave,
    onCancel,
}) => {
    const { title, description, headers, rows } = data;

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleSave = () => {
        onSave(data);
    };

    const addColumn = () => {
        const newId = `col_${crypto.randomUUID().slice(0, 8)}`;
        setData({
            ...data,
            headers: [...headers, { id: newId, label: 'New Column' }],
        });
    };

    const updateHeader = (index, label) => {
        const newHeaders = [...headers];
        newHeaders[index] = { ...newHeaders[index], label };
        setData({ ...data, headers: newHeaders });
    };

    const deleteHeader = index => {
        if (headers.length <= 1) return;
        const newHeaders = headers.filter((_, i) => i !== index);
        setData({ ...data, headers: newHeaders });
    };

    const handleHeaderDragEnd = event => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = headers.findIndex(item => item.id === active.id);
            const newIndex = headers.findIndex(item => item.id === over.id);
            setData({
                ...data,
                headers: arrayMove(headers, oldIndex, newIndex),
            });
        }
    };

    const addRow = () => {
        setData({
            ...data,
            rows: [
                ...rows,
                {
                    id: crypto.randomUUID(),
                    type: 'row',
                    icon: 'Info',
                    values: {},
                },
            ],
        });
    };

    const addHeaderRow = () => {
        setData({
            ...data,
            rows: [
                ...rows,
                {
                    id: crypto.randomUUID(),
                    type: 'header',
                    label: 'New Section',
                },
            ],
        });
    };

    const updateRow = (index, field, value) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], [field]: value };
        setData({ ...data, rows: newRows });
    };

    const deleteRow = index => {
        setData({
            ...data,
            rows: rows.filter((_, i) => i !== index),
        });
    };

    const handleRowDragEnd = event => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = rows.findIndex(item => item.id === active.id);
            const newIndex = rows.findIndex(item => item.id === over.id);
            setData({
                ...data,
                rows: arrayMove(rows, oldIndex, newIndex),
            });
        }
    };

    return (
        <EditingSheetRight
            side='right'
            className='lg:min-w-[550px] w-full sm:w-[550px] rounded-l-3xl border-l border-border hide-scrollbar'
            open={isEditing}
            onOpenChange={setIsEditing}>
            <div className='h-full flex flex-col bg-background'>
                <div className='sticky top-0 z-20 px-6 py-5 flex justify-between items-center bg-card border-b border-border shadow-sm'>
                    <div className='flex items-center gap-3'>
                        <div className='p-2 bg-primary/10 text-primary rounded-lg'>
                            <HugeiconsIcon icon={Tick01Icon} size={20} />
                        </div>
                        <h3 className='font-black text-xl tracking-tight'>
                            Edit Table Block
                        </h3>
                    </div>
                    <div className='flex gap-3'>
                        <Button
                            variant='outline'
                            onClick={onCancel}
                            className='h-10 px-5 font-bold rounded-lg'>
                            Cancel
                        </Button>
                        <Button
                            variant='default'
                            onClick={handleSave}
                            className='h-10 px-5 font-bold rounded-lg shadow-lg shadow-primary/20'>
                            Save
                        </Button>
                    </div>
                </div>

                <div
                    className='flex-1 overflow-y-auto px-6 py-6 space-y-6 hide-scrollbar'
                    data-lenis-prevent>
                    {/* General Settings */}
                    <div className='space-y-4'>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-bold text-muted-foreground   tracking-wider flex items-center gap-1.5'>
                                <HugeiconsIcon
                                    icon={PencilEdit01Icon}
                                    className='w-3.5 h-3.5 text-primary/70'
                                />
                                Section Title
                            </label>
                            <Input
                                value={title}
                                onChange={e =>
                                    setData({ ...data, title: e.target.value })
                                }
                                placeholder='e.g. Tour Information'
                                className='w-full h-10 rounded-lg border border-border bg-background px-3 text-xs   focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all'
                            />
                        </div>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-bold text-muted-foreground   tracking-wider flex items-center gap-1.5'>
                                <HugeiconsIcon
                                    icon={InformationCircleIcon}
                                    className='w-3.5 h-3.5 text-primary/70'
                                />
                                Section Description
                            </label>
                            <textarea
                                value={description}
                                onChange={e =>
                                    setData({
                                        ...data,
                                        description: e.target.value,
                                    })
                                }
                                rows={3}
                                className='w-full min-h-[80px] rounded-lg border border-border bg-background px-3 py-2 text-xs   focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/30'
                                placeholder='Add a short description...'
                            />
                        </div>
                    </div>

                    {/* Column Management */}
                    <div className='space-y-4'>
                        <div className='flex items-center justify-between'>
                            <label className='text-xs font-bold text-muted-foreground   tracking-wider flex items-center gap-2'>
                                <HugeiconsIcon
                                    icon={PlusSignIcon}
                                    className='w-4 h-4 text-primary'
                                />
                                Manage Columns
                            </label>
                            <Button
                                size='sm'
                                variant='outline'
                                onClick={addColumn}
                                className='h-8 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 rounded-lg px-3 gap-1.5 font-bold   tracking-wider text-[10px]'>
                                <Plus size={14} /> Add Column
                            </Button>
                        </div>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleHeaderDragEnd}>
                            <div className='flex w-full items-center gap-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20'>
                                <SortableContext
                                    items={headers.map(h => h.id)}
                                    strategy={verticalListSortingStrategy}>
                                    <div className='flex-1 flex items-center gap-2'>
                                        {headers.map((header, index) => (
                                            <SortableHeader
                                                key={header.id}
                                                header={header}
                                                index={index}
                                                updateHeader={updateHeader}
                                                deleteHeader={deleteHeader}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </div>
                        </DndContext>
                    </div>

                    {/* Row Management */}
                    <div className='space-y-4'>
                        <div className='flex items-center justify-between px-1'>
                            <label className='text-[10px] font-bold text-muted-foreground   tracking-wider flex items-center gap-1.5'>
                                <HugeiconsIcon
                                    icon={PlusSignIcon}
                                    className='w-3.5 h-3.5 text-primary/70'
                                />
                                Content Rows
                            </label>
                            <div className='flex gap-2'>
                                <Button
                                    size='sm'
                                    variant='outline'
                                    onClick={addHeaderRow}
                                    className='h-7 bg-primary/5 border-primary/10 text-primary hover:bg-primary/10 rounded-lg px-2.5 gap-1 font-bold   tracking-wider text-[9px]'>
                                    + Header
                                </Button>
                                <Button
                                    size='sm'
                                    onClick={addRow}
                                    className='h-7 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-3 gap-1 font-bold   tracking-wider text-[9px]'>
                                    <HugeiconsIcon
                                        icon={PlusSignIcon}
                                        size={12}
                                    />{' '}
                                    Add Row
                                </Button>
                            </div>
                        </div>

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleRowDragEnd}>
                            <div className='space-y-3'>
                                <SortableContext
                                    items={rows.map(r => r.id)}
                                    strategy={verticalListSortingStrategy}>
                                    {rows.map((row, index) => (
                                        <SortableRow
                                            key={row.id}
                                            row={row}
                                            index={index}
                                            headers={headers}
                                            updateRow={updateRow}
                                            deleteRow={deleteRow}
                                        />
                                    ))}
                                </SortableContext>
                            </div>
                        </DndContext>
                    </div>
                </div>
            </div>
        </EditingSheetRight>
    );
};

