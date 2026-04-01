'use client';
import {
    formatDateWithOffset,
    formateDate,
} from '@/app/[lang]/(trips-landing-page-tenent)/utils';

const TripInformation = ({ data }) => {
    return (
        <div className='bg-background rounded-lg border p-6'>
            <div className='flex items-center justify-between mb-4'>
                <h1 className='text-lg font-bold'>{data?.tripName || ''}</h1>
            </div>

            <div className='flex items-center gap-4 mt-2 text-sm'>
                <span>{formateDate(data?.tripStartDate, 'custom')}</span>
                <span>---{`>`}</span>

                <span>
                    {formatDateWithOffset(
                        data?.tripStartDate,
                        'custom',
                        data?.totalDays
                    )}{' '}
                    / In {data?.destination}
                </span>
            </div>
        </div>
    );
};

export default TripInformation;

