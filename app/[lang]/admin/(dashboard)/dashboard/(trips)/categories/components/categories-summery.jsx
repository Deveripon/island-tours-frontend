import { categoryTypeColors } from '@/data/type-colors';
import { formatKey } from '@/lib/utils';

const CategoriesSummery = ({
    allCategories,
    categories,
    handleTypeCardClick,
    typeFilter,
    setTypeFilter }) => {
    return (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4'>
            {Object.entries(categories).map(([type, values]) => {
                // Get colors for the type
                const colors = categoryTypeColors[type] || {
                    bg: 'bg-gray-100',
                    text: 'text-gray-700',
                    border: 'border-gray-200',
                };

                // Check if this card is the active filter
                const isActive = typeFilter === type;

                return (
                    <div
                        key={type}
                        className={`rounded-lg p-4 shadow-sm border ${
                            colors.border
                        } ${
                            colors.bg
                        } cursor-pointer transition-transform hover:scale-105 ${
                            isActive ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => handleTypeCardClick(type)}>
                        <div
                            className={`text-sm font-medium mb-1 ${colors.text}`}>
                            {formatKey(type)}
                        </div>
                        <div className={`text-lg font-bold ${colors.text}`}>
                            {values.length}
                        </div>
                    </div>
                );
            })}
            <div
                className={`bg-primary/10 rounded-lg p-4 shadow-sm border border-primary/20 cursor-pointer transition-transform hover:scale-105 ${
                    typeFilter === '' ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setTypeFilter('')}>
                <div className='text-sm text-primary font-medium mb-1'>
                    Total
                </div>
                <div className='text-lg font-bold text-primary'>
                    {allCategories.length}
                </div>
            </div>
        </div>
    );
};

export default CategoriesSummery;

