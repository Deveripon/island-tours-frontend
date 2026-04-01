import { getAllCategoriesOfTenant } from '@/app/_actions/trips/category';
import { getGroupedDataOfCategories } from '@/lib/utils';
import PageContent from './components/page-content';

export default async function CategoriesPage({ params }) {
    const { tenant } = await params;
    const categories = await getAllCategoriesOfTenant(tenant);

    // Make sure both categories passed are of the same type
    const categoriesData = categories?.result?.data;

    const groupedData = getGroupedDataOfCategories(categoriesData);

    return (
        <div className='container space-y-6'>
            <PageContent
                groupedCategories={groupedData}
                categories={categoriesData ?? []}
            />
        </div>
    );
}
