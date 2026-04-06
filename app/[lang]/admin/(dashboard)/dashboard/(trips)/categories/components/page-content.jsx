'use client';

import { Permission } from '@/RBAC.config';
import { deleteCategory } from '@/app/_actions/trips/category';
import { Button } from '@/components/ui/button';
import { useRolePermission } from '@/hooks/useRolePermission';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import DeleteConfirmationDialog from '../../../components/common/delete-confirmation-dialog';
import CategoriesSummery from './categories-summery';
import { CategoryForm } from './category-form';
import { columns } from './columns';
import { DataTable } from './data-table';

const PageContent = ({ groupedCategories, categories }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [typeFilter, setTypeFilter] = useState('');
    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [categoryIdToDelete, setcategoryIdToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const params = useSearchParams();
    const hasCreatePermission = useRolePermission(Permission.CREATE_CATEGORY);

    useEffect(() => {
        const handleEdit = e => {
            setEditingCategory(e.detail);
            setIsFormOpen(true);
        };

        const handleDelete = e => {
            const categoryId = e.detail;
            setcategoryIdToDelete(categoryId);
            setIsShowConfirm(true);
        };

        document.addEventListener('edit-category', handleEdit);
        document.addEventListener('delete-category', handleDelete);

        return () => {
            document.removeEventListener('edit-category', handleEdit);
            document.removeEventListener('delete-category', handleDelete);
        };
    }, [categories]);

    useEffect(() => {
        if (params.get('open') === 'true' && hasCreatePermission) {
            setIsFormOpen(true);
        }
    }, [hasCreatePermission, params]);

    const handleTypeCardClick = type => {
        setTypeFilter(type === typeFilter ? '' : type);
    };

    const filteredCategories = useMemo(() => {
        if (!typeFilter) return categories;
        return categories.filter(category => {
            return String(category.types) === typeFilter;
        });
    }, [categories, typeFilter]);

    const handleDeleteConfirm = async () => {
        if (!categoryIdToDelete) return;

        setIsDeleting(true);

        try {
            const result = await deleteCategory(categoryIdToDelete);

            if (result?.success === true) {
                toast.success('Category deleted successfully');
            } else {
                const errorMessage =
                    result?.error &&
                    typeof result.error === 'object' &&
                    'message' in result.error
                        ? result.error.message
                        : result?.error || 'Failed to delete Category';

                toast.error(errorMessage);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsDeleting(false);
            setIsShowConfirm(false);
            setcategoryIdToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setIsShowConfirm(false);
        setcategoryIdToDelete(null);
    };

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                    <h1 className='text-2xl font-semibold tracking-tight'>
                        Categories
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Manage categories for your travel packages, tours, and
                        services
                    </p>
                </div>
                {hasCreatePermission && (
                    <Button size='sm' onClick={() => setIsFormOpen(true)}>
                        <Plus className='mr-2 h-4 w-4' />
                        Add Category
                    </Button>
                )}
            </div>

            <CategoriesSummery
                categories={groupedCategories}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                handleTypeCardClick={handleTypeCardClick}
                allCategories={categories}
            />

            <DataTable
                groupedCategories={groupedCategories}
                columns={columns}
                data={categories}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
            />

            <CategoryForm
                categoryTypes={groupedCategories}
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                editingCategory={editingCategory}
                setEditingCategory={setEditingCategory}
            />

            <DeleteConfirmationDialog
                isShowConfirm={isShowConfirm}
                setIsShowConfirm={setIsShowConfirm}
                handleDeleteConfirm={handleDeleteConfirm}
                handleDeleteCancel={handleDeleteCancel}
                isDeleting={isDeleting}
                title='Are you absolutely sure?'
                description='This action cannot be undone. This will permanently delete this category and all associated data.'
            />
        </div>
    );
};

export default PageContent;

