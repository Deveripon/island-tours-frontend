import { Button } from '@/components/ui/button';

const WeekDaySelector = ({ value = [], onChange, ...props }) => {
    const selectedDays = value || [];

    const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];

    const toggleDay = dayName => {
        const newSelectedDays = selectedDays.includes(dayName)
            ? selectedDays.filter(day => day !== dayName)
            : [...selectedDays, dayName];

        onChange?.(newSelectedDays);
    };

    return (
        <div className=' mx-auto py-3'>
            <div className='space-y-6'>
                <div>
                    <div className='flex flex-wrap gap-2'>
                        {days.map(day => {
                            const isSelected = selectedDays.includes(day);
                            return (
                                <Button
                                    key={day}
                                    onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        toggleDay(day);
                                    }}
                                    className={`
                    px-3 py-2 text-sm font-medium rounded-md border transition-colors
                    ${
                        isSelected
                            ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                            : 'bg-background text-muted-foreground border-border hover:bg-muted'
                    }
                  `}>
                                    {day}
                                </Button>
                            );
                        })}
                    </div>
                </div>

                {selectedDays.length > 0 && (
                    <div className='space-y-3'>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm text-muted-foreground'>
                                {selectedDays.length} day
                                {selectedDays.length !== 1 ? 's' : ''} selected
                            </span>
                            <button
                                type='button'
                                onClick={() => onChange?.([])}
                                className='text-sm text-muted-foreground hover:text-foreground'>
                                Clear all
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeekDaySelector;

