import { FormControl } from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import AddMoreButton from './add-more-button';

function SelectOptions({
    field,
    placeholder,
    dataArray,
    defaultValue,
    emptyStateText,
    goToUrl,
    defaultData,
    showAddMore,
    buttonClass }) {
    // Combine and deduplicate options to avoid duplicate values
    const allOptions = [...(defaultData || []), ...(dataArray || [])];

    // Remove duplicates based on ID
    const uniqueOptions = allOptions.filter(
        (option, index, self) =>
            index === self.findIndex(opt => opt.id === option.id)
    );

    return (
        <Select
            onValueChange={field.onChange}
            defaultValue={defaultValue}
            value={field.value}>
            <FormControl>
                <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
            </FormControl>
            <SelectContent>
                {uniqueOptions.map(option => (
                    <SelectItem key={option?.id} value={option?.name}>
                        {option?.name}
                    </SelectItem>
                ))}
                {showAddMore && (
                    <AddMoreButton
                        text={emptyStateText}
                        ButtonText='Add More'
                        className={cn(`p-1`, buttonClass)}
                        goToUrl={goToUrl}
                    />
                )}
            </SelectContent>
        </Select>
    );
}

export default SelectOptions;

