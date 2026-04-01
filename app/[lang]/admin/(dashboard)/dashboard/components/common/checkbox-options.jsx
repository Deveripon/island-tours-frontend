import { Checkbox } from '@/components/ui/checkbox';

const CheckboxOptions = ({ field, dataArray, defaultData }) => {
    // Ensure field.value is always an array
    const currentValue = field?.value || [];

    // Combine and deduplicate options to avoid duplicate IDs
    const allOptions = [...(defaultData || []), ...(dataArray || [])];

    // Remove duplicates based on ID
    const uniqueOptions = allOptions.filter(
        (option, index, self) =>
            index === self.findIndex(opt => opt.id === option.id)
    );

    const handleCheckboxChange = (option, checked) => {
        let newValue;

        if (checked) {
            // Add option name if not already present
            newValue = currentValue.includes(option.name)
                ? currentValue
                : [...currentValue, option.name];
        } else {
            // Remove option name
            newValue = currentValue.filter(value => value !== option.name);
        }

        field?.onChange(newValue);
    };

    return (
        <div className='grid grid-cols-2 gap-2'>
            {uniqueOptions.map(option => (
                <div key={option?.id} className='flex items-center space-x-2'>
                    <Checkbox
                        id={`tour-type-${option.id}`} // Use ID instead of name for uniqueness
                        checked={currentValue.includes(option.name)}
                        onCheckedChange={checked =>
                            handleCheckboxChange(option, checked)
                        }
                    />
                    <label
                        htmlFor={`tour-type-${option.id}`} // Match the checkbox ID
                        className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                        {option.name}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default CheckboxOptions;

