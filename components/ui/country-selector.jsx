import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

const countries = [
    { flag: '🇺🇸', name: 'United States' },
    { flag: '🇨🇦', name: 'Canada' },
    { flag: '🇷🇺', name: 'Russia' },
    { flag: '🇰🇿', name: 'Kazakhstan' },
    { flag: '🇪🇬', name: 'Egypt' },
    { flag: '🇿🇦', name: 'South Africa' },
    { flag: '🇬🇷', name: 'Greece' },
    { flag: '🇳🇱', name: 'Netherlands' },
    { flag: '🇧🇪', name: 'Belgium' },
    { flag: '🇫🇷', name: 'France' },
    { flag: '🇪🇸', name: 'Spain' },
    { flag: '🇭🇺', name: 'Hungary' },
    { flag: '🇮🇹', name: 'Italy' },
    { flag: '🇷🇴', name: 'Romania' },
    { flag: '🇨🇭', name: 'Switzerland' },
    { flag: '🇦🇹', name: 'Austria' },
    { flag: '🇬🇧', name: 'United Kingdom' },
    { flag: '🇩🇰', name: 'Denmark' },
    { flag: '🇸🇪', name: 'Sweden' },
    { flag: '🇳🇴', name: 'Norway' },
    { flag: '🇵🇱', name: 'Poland' },
    { flag: '🇩🇪', name: 'Germany' },
    { flag: '🇵🇪', name: 'Peru' },
    { flag: '🇲🇽', name: 'Mexico' },
    { flag: '🇨🇺', name: 'Cuba' },
    { flag: '🇦🇷', name: 'Argentina' },
    { flag: '🇧🇷', name: 'Brazil' },
    { flag: '🇨🇱', name: 'Chile' },
    { flag: '🇨🇴', name: 'Colombia' },
    { flag: '🇻🇪', name: 'Venezuela' },
    { flag: '🇲🇾', name: 'Malaysia' },
    { flag: '🇦🇺', name: 'Australia' },
    { flag: '🇮🇩', name: 'Indonesia' },
    { flag: '🇵🇭', name: 'Philippines' },
    { flag: '🇳🇿', name: 'New Zealand' },
    { flag: '🇸🇬', name: 'Singapore' },
    { flag: '🇹🇭', name: 'Thailand' },
    { flag: '🇯🇵', name: 'Japan' },
    { flag: '🇰🇷', name: 'South Korea' },
    { flag: '🇻🇳', name: 'Vietnam' },
    { flag: '🇨🇳', name: 'China' },
    { flag: '🇹🇷', name: 'Turkey' },
    { flag: '🇮🇳', name: 'India' },
    { flag: '🇵🇰', name: 'Pakistan' },
    { flag: '🇦🇫', name: 'Afghanistan' },
    { flag: '🇱🇰', name: 'Sri Lanka' },
    { flag: '🇲🇲', name: 'Myanmar' },
    { flag: '🇮🇷', name: 'Iran' },
    { flag: '🇲🇦', name: 'Morocco' },
    { flag: '🇩🇿', name: 'Algeria' },
    { flag: '🇹🇳', name: 'Tunisia' },
    { flag: '🇱🇾', name: 'Libya' },
    { flag: '🇬🇲', name: 'Gambia' },
    { flag: '🇸🇳', name: 'Senegal' },
    { flag: '🇲🇷', name: 'Mauritania' },
    { flag: '🇲🇱', name: 'Mali' },
    { flag: '🇬🇳', name: 'Guinea' },
    { flag: '🇨🇮', name: 'Ivory Coast' },
    { flag: '🇧🇫', name: 'Burkina Faso' },
    { flag: '🇳🇪', name: 'Niger' },
    { flag: '🇹🇬', name: 'Togo' },
    { flag: '🇧🇯', name: 'Benin' },
    { flag: '🇲🇺', name: 'Mauritius' },
    { flag: '🇱🇷', name: 'Liberia' },
    { flag: '🇸🇱', name: 'Sierra Leone' },
    { flag: '🇬🇭', name: 'Ghana' },
    { flag: '🇳🇬', name: 'Nigeria' },
    { flag: '🇹🇩', name: 'Chad' },
    { flag: '🇨🇫', name: 'Central African Republic' },
    { flag: '🇨🇲', name: 'Cameroon' },
    { flag: '🇨🇻', name: 'Cape Verde' },
    { flag: '🇸🇹', name: 'São Tomé and Príncipe' },
    { flag: '🇬🇶', name: 'Equatorial Guinea' },
    { flag: '🇬🇦', name: 'Gabon' },
    { flag: '🇨🇬', name: 'Republic of the Congo' },
    { flag: '🇨🇩', name: 'Democratic Republic of the Congo' },
    { flag: '🇦🇴', name: 'Angola' },
    { flag: '🇬🇼', name: 'Guinea-Bissau' },
    { flag: '🇸🇨', name: 'Seychelles' },
    { flag: '🇸🇩', name: 'Sudan' },
    { flag: '🇷🇼', name: 'Rwanda' },
    { flag: '🇪🇹', name: 'Ethiopia' },
    { flag: '🇸🇴', name: 'Somalia' },
    { flag: '🇩🇯', name: 'Djibouti' },
    { flag: '🇰🇪', name: 'Kenya' },
    { flag: '🇹🇿', name: 'Tanzania' },
    { flag: '🇺🇬', name: 'Uganda' },
    { flag: '🇧🇮', name: 'Burundi' },
    { flag: '🇲🇿', name: 'Mozambique' },
    { flag: '🇿🇲', name: 'Zambia' },
    { flag: '🇲🇬', name: 'Madagascar' },
    { flag: '🇷🇪', name: 'Réunion' },
    { flag: '🇿🇼', name: 'Zimbabwe' },
    { flag: '🇳🇦', name: 'Namibia' },
    { flag: '🇲🇼', name: 'Malawi' },
    { flag: '🇱🇸', name: 'Lesotho' },
    { flag: '🇧🇼', name: 'Botswana' },
    { flag: '🇸🇿', name: 'Eswatini' },
    { flag: '🇰🇲', name: 'Comoros' },
    { flag: '🇸🇭', name: 'Saint Helena' },
    { flag: '🇪🇷', name: 'Eritrea' },
    { flag: '🇦🇼', name: 'Aruba' },
    { flag: '🇫🇴', name: 'Faroe Islands' },
    { flag: '🇬🇱', name: 'Greenland' },
    { flag: '🇬🇮', name: 'Gibraltar' },
    { flag: '🇵🇹', name: 'Portugal' },
    { flag: '🇱🇺', name: 'Luxembourg' },
    { flag: '🇮🇪', name: 'Ireland' },
    { flag: '🇮🇸', name: 'Iceland' },
    { flag: '🇦🇱', name: 'Albania' },
    { flag: '🇲🇹', name: 'Malta' },
    { flag: '🇨🇾', name: 'Cyprus' },
    { flag: '🇫🇮', name: 'Finland' },
    { flag: '🇧🇬', name: 'Bulgaria' },
    { flag: '🇱🇹', name: 'Lithuania' },
    { flag: '🇱🇻', name: 'Latvia' },
    { flag: '🇪🇪', name: 'Estonia' },
    { flag: '🇲🇩', name: 'Moldova' },
    { flag: '🇦🇲', name: 'Armenia' },
    { flag: '🇧🇾', name: 'Belarus' },
    { flag: '🇦🇩', name: 'Andorra' },
    { flag: '🇲🇨', name: 'Monaco' },
    { flag: '🇸🇲', name: 'San Marino' },
    { flag: '🇺🇦', name: 'Ukraine' },
    { flag: '🇷🇸', name: 'Serbia' },
    { flag: '🇲🇪', name: 'Montenegro' },
    { flag: '🇽🇰', name: 'Kosovo' },
    { flag: '🇭🇷', name: 'Croatia' },
    { flag: '🇸🇮', name: 'Slovenia' },
    { flag: '🇧🇦', name: 'Bosnia and Herzegovina' },
    { flag: '🇲🇰', name: 'North Macedonia' },
    { flag: '🇨🇿', name: 'Czech Republic' },
    { flag: '🇸🇰', name: 'Slovakia' },
    { flag: '🇱🇮', name: 'Liechtenstein' },
    { flag: '🇫🇰', name: 'Falkland Islands' },
    { flag: '🇧🇿', name: 'Belize' },
    { flag: '🇬🇹', name: 'Guatemala' },
    { flag: '🇸🇻', name: 'El Salvador' },
    { flag: '🇭🇳', name: 'Honduras' },
    { flag: '🇳🇮', name: 'Nicaragua' },
    { flag: '🇨🇷', name: 'Costa Rica' },
    { flag: '🇵🇦', name: 'Panama' },
    { flag: '🇵🇲', name: 'Saint Pierre and Miquelon' },
    { flag: '🇭🇹', name: 'Haiti' },
    { flag: '🇬🇵', name: 'Guadeloupe' },
    { flag: '🇧🇴', name: 'Bolivia' },
    { flag: '🇬🇾', name: 'Guyana' },
    { flag: '🇪🇨', name: 'Ecuador' },
    { flag: '🇬🇫', name: 'French Guiana' },
    { flag: '🇵🇾', name: 'Paraguay' },
    { flag: '🇲🇶', name: 'Martinique' },
    { flag: '🇸🇷', name: 'Suriname' },
    { flag: '🇺🇾', name: 'Uruguay' },
    { flag: '🇨🇼', name: 'Curaçao' },
    { flag: '🇹🇱', name: 'East Timor' },
    { flag: '🇦🇶', name: 'Antarctica' },
    { flag: '🇧🇳', name: 'Brunei' },
    { flag: '🇳🇷', name: 'Nauru' },
    { flag: '🇵🇬', name: 'Papua New Guinea' },
    { flag: '🇹🇴', name: 'Tonga' },
    { flag: '🇸🇧', name: 'Solomon Islands' },
    { flag: '🇻🇺', name: 'Vanuatu' },
    { flag: '🇫🇯', name: 'Fiji' },
    { flag: '🇵🇼', name: 'Palau' },
    { flag: '🇼🇫', name: 'Wallis and Futuna' },
    { flag: '🇨🇰', name: 'Cook Islands' },
    { flag: '🇳🇺', name: 'Niue' },
    { flag: '🇦🇸', name: 'American Samoa' },
    { flag: '🇼🇸', name: 'Samoa' },
    { flag: '🇰🇮', name: 'Kiribati' },
    { flag: '🇳🇨', name: 'New Caledonia' },
    { flag: '🇹🇻', name: 'Tuvalu' },
    { flag: '🇵🇫', name: 'French Polynesia' },
    { flag: '🇹🇰', name: 'Tokelau' },
    { flag: '🇫🇲', name: 'Federated States of Micronesia' },
    { flag: '🇲🇭', name: 'Marshall Islands' },
    { flag: '🇰🇵', name: 'North Korea' },
    { flag: '🇭🇰', name: 'Hong Kong' },
    { flag: '🇲🇴', name: 'Macau' },
    { flag: '🇰🇭', name: 'Cambodia' },
    { flag: '🇱🇦', name: 'Laos' },
    { flag: '🇧🇩', name: 'Bangladesh' },
    { flag: '🇹🇼', name: 'Taiwan' },
    { flag: '🇲🇻', name: 'Maldives' },
    { flag: '🇱🇧', name: 'Lebanon' },
    { flag: '🇯🇴', name: 'Jordan' },
    { flag: '🇸🇾', name: 'Syria' },
    { flag: '🇮🇶', name: 'Iraq' },
    { flag: '🇰🇼', name: 'Kuwait' },
    { flag: '🇸🇦', name: 'Saudi Arabia' },
    { flag: '🇾🇪', name: 'Yemen' },
    { flag: '🇴🇲', name: 'Oman' },
    { flag: '🇵🇸', name: 'Palestine' },
    { flag: '🇦🇪', name: 'United Arab Emirates' },
    { flag: '🇮🇱', name: 'Israel' },
    { flag: '🇧🇭', name: 'Bahrain' },
    { flag: '🇶🇦', name: 'Qatar' },
    { flag: '🇧🇹', name: 'Bhutan' },
    { flag: '🇲🇳', name: 'Mongolia' },
    { flag: '🇳🇵', name: 'Nepal' },
    { flag: '🇹🇯', name: 'Tajikistan' },
    { flag: '🇹🇲', name: 'Turkmenistan' },
    { flag: '🇦🇿', name: 'Azerbaijan' },
    { flag: '🇬🇪', name: 'Georgia' },
    { flag: '🇰🇬', name: 'Kyrgyzstan' },
    { flag: '🇺🇿', name: 'Uzbekistan' },
];

// Form-compatible CountryCodeSelector component
export const CountrySelector = ({
    value,
    onChange,
    placeholder = 'Select country' }) => {
    const [open, setOpen] = useState(false);

    // Find the selected country based on the value
    const selectedCountry = value
        ? countries.find(country => country.name === value) || {
              flag: '🌍',
              name: 'Worldwide',
          }
        : null;

    const handleSelectCountry = country => {
        onChange(country.name);
        setOpen(false);
    };

    const getDisplayValue = () => {
        if (selectedCountry) {
            return (
                <div className='flex items-center gap-2'>
                    <span className='text-sm'>{selectedCountry.flag}</span>
                    <span className='text-xs text-gray-500 truncate'>
                        {selectedCountry.name}
                    </span>
                </div>
            );
        }
        return <span className='text-gray-500'>{placeholder}</span>;
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between h-auto min-h-[40px] px-3 py-2'>
                    {getDisplayValue()}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0' align='start'>
                <Command>
                    <CommandInput
                        placeholder='Search country ...'
                        className='h-9'
                    />
                    <CommandList>
                        <CommandEmpty>
                            <div className='p-4 text-center space-y-3'>
                                <div className='text-xs text-gray-500'>
                                    No country found. try another search.
                                </div>
                            </div>
                        </CommandEmpty>

                        <CommandSeparator />

                        <CommandGroup heading='All Countries'>
                            {countries.slice(10).map((country, index) => (
                                <CommandItem
                                    key={`${country.name}-${index + 10}`}
                                    value={`${country.name}`}
                                    onSelect={() =>
                                        handleSelectCountry(country)
                                    }
                                    className='flex items-center gap-3 px-3 py-2'>
                                    <span className='text-sm'>
                                        {country.flag}
                                    </span>
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-xs text-gray-600 truncate'>
                                                {country.name}
                                            </span>
                                        </div>
                                    </div>
                                    <Check
                                        className={`ml-auto h-4 w-4 ${
                                            value === country.name
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        }`}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

