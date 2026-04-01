import { getAllCategoriesByType } from '@/app/_actions/trips/category';
import { useCallback, useEffect, useState } from 'react';

const useCategoryTypesData = typeData => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await getAllCategoriesByType(typeData);

            if (res.success === true) {
                const _categories = res?.result?.categories;
                setData(_categories);
            } else if (res.success === false && res.message) {
                setError(
                    new Error(
                        res.message || 'There was an error while Fatching'
                    )
                );
            } else if (res.success === false) {
                setError(
                    new Error('An unknown error occurred while fetching data.')
                );
            }
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, [typeData]);

    useEffect(() => {
        getData();
    }, [getData]);

    return {
        isLoading,
        data,
        error,
    };
};

export default useCategoryTypesData;

