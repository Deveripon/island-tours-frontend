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
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
    ArrowDown01Icon,
    PlusSignIcon,
    Tick01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useState } from 'react';

const countryCodes = [
    { code: '+1', flag: '🇺🇸', name: 'United States' },
    { code: '+1', flag: '🇨🇦', name: 'Canada' },
    { code: '+7', flag: '🇷🇺', name: 'Russia' },
    { code: '+7', flag: '🇰🇿', name: 'Kazakhstan' },
    { code: '+20', flag: '🇪🇬', name: 'Egypt' },
    { code: '+27', flag: '🇿🇦', name: 'South Africa' },
    { code: '+30', flag: '🇬🇷', name: 'Greece' },
    { code: '+31', flag: '🇳🇱', name: 'Netherlands' },
    { code: '+32', flag: '🇧🇪', name: 'Belgium' },
    { code: '+33', flag: '🇫🇷', name: 'France' },
    { code: '+34', flag: '🇪🇸', name: 'Spain' },
    { code: '+36', flag: '🇭🇺', name: 'Hungary' },
    { code: '+39', flag: '🇮🇹', name: 'Italy' },
    { code: '+40', flag: '🇷🇴', name: 'Romania' },
    { code: '+41', flag: '🇨🇭', name: 'Switzerland' },
    { code: '+43', flag: '🇦🇹', name: 'Austria' },
    { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
    { code: '+45', flag: '🇩🇰', name: 'Denmark' },
    { code: '+46', flag: '🇸🇪', name: 'Sweden' },
    { code: '+47', flag: '🇳🇴', name: 'Norway' },
    { code: '+48', flag: '🇵🇱', name: 'Poland' },
    { code: '+49', flag: '🇩🇪', name: 'Germany' },
    { code: '+51', flag: '🇵🇪', name: 'Peru' },
    { code: '+52', flag: '🇲🇽', name: 'Mexico' },
    { code: '+53', flag: '🇨🇺', name: 'Cuba' },
    { code: '+54', flag: '🇦🇷', name: 'Argentina' },
    { code: '+55', flag: '🇧🇷', name: 'Brazil' },
    { code: '+56', flag: '🇨🇱', name: 'Chile' },
    { code: '+57', flag: '🇨🇴', name: 'Colombia' },
    { code: '+58', flag: '🇻🇪', name: 'Venezuela' },
    { code: '+60', flag: '🇲🇾', name: 'Malaysia' },
    { code: '+61', flag: '🇦🇺', name: 'Australia' },
    { code: '+62', flag: '🇮🇩', name: 'Indonesia' },
    { code: '+63', flag: '🇵🇭', name: 'Philippines' },
    { code: '+64', flag: '🇳🇿', name: 'New Zealand' },
    { code: '+65', flag: '🇸🇬', name: 'Singapore' },
    { code: '+66', flag: '🇹🇭', name: 'Thailand' },
    { code: '+81', flag: '🇯🇵', name: 'Japan' },
    { code: '+82', flag: '🇰🇷', name: 'South Korea' },
    { code: '+84', flag: '🇻🇳', name: 'Vietnam' },
    { code: '+86', flag: '🇨🇳', name: 'China' },
    { code: '+90', flag: '🇹🇷', name: 'Turkey' },
    { code: '+91', flag: '🇮🇳', name: 'India' },
    { code: '+92', flag: '🇵🇰', name: 'Pakistan' },
    { code: '+93', flag: '🇦🇫', name: 'Afghanistan' },
    { code: '+94', flag: '🇱🇰', name: 'Sri Lanka' },
    { code: '+95', flag: '🇲🇲', name: 'Myanmar' },
    { code: '+98', flag: '🇮🇷', name: 'Iran' },
    { code: '+212', flag: '🇲🇦', name: 'Morocco' },
    { code: '+213', flag: '🇩🇿', name: 'Algeria' },
    { code: '+216', flag: '🇹🇳', name: 'Tunisia' },
    { code: '+218', flag: '🇱🇾', name: 'Libya' },
    { code: '+220', flag: '🇬🇲', name: 'Gambia' },
    { code: '+221', flag: '🇸🇳', name: 'Senegal' },
    { code: '+222', flag: '🇲🇷', name: 'Mauritania' },
    { code: '+223', flag: '🇲🇱', name: 'Mali' },
    { code: '+224', flag: '🇬🇳', name: 'Guinea' },
    { code: '+225', flag: '🇨🇮', name: 'Ivory Coast' },
    { code: '+226', flag: '🇧🇫', name: 'Burkina Faso' },
    { code: '+227', flag: '🇳🇪', name: 'Niger' },
    { code: '+228', flag: '🇹🇬', name: 'Togo' },
    { code: '+229', flag: '🇧🇯', name: 'Benin' },
    { code: '+230', flag: '🇲🇺', name: 'Mauritius' },
    { code: '+231', flag: '🇱🇷', name: 'Liberia' },
    { code: '+232', flag: '🇸🇱', name: 'Sierra Leone' },
    { code: '+233', flag: '🇬🇭', name: 'Ghana' },
    { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
    { code: '+235', flag: '🇹🇩', name: 'Chad' },
    { code: '+236', flag: '🇨🇫', name: 'Central African Republic' },
    { code: '+237', flag: '🇨🇲', name: 'Cameroon' },
    { code: '+238', flag: '🇨🇻', name: 'Cape Verde' },
    { code: '+239', flag: '🇸🇹', name: 'São Tomé and Príncipe' },
    { code: '+240', flag: '🇬🇶', name: 'Equatorial Guinea' },
    { code: '+241', flag: '🇬🇦', name: 'Gabon' },
    { code: '+242', flag: '🇨🇬', name: 'Republic of the Congo' },
    { code: '+243', flag: '🇨🇩', name: 'Democratic Republic of the Congo' },
    { code: '+244', flag: '🇦🇴', name: 'Angola' },
    { code: '+245', flag: '🇬🇼', name: 'Guinea-Bissau' },
    { code: '+248', flag: '🇸🇨', name: 'Seychelles' },
    { code: '+249', flag: '🇸🇩', name: 'Sudan' },
    { code: '+250', flag: '🇷🇼', name: 'Rwanda' },
    { code: '+251', flag: '🇪🇹', name: 'Ethiopia' },
    { code: '+252', flag: '🇸🇴', name: 'Somalia' },
    { code: '+253', flag: '🇩🇯', name: 'Djibouti' },
    { code: '+254', flag: '🇰🇪', name: 'Kenya' },
    { code: '+255', flag: '🇹🇿', name: 'Tanzania' },
    { code: '+256', flag: '🇺🇬', name: 'Uganda' },
    { code: '+257', flag: '🇧🇮', name: 'Burundi' },
    { code: '+258', flag: '🇲🇿', name: 'Mozambique' },
    { code: '+260', flag: '🇿🇲', name: 'Zambia' },
    { code: '+261', flag: '🇲🇬', name: 'Madagascar' },
    { code: '+262', flag: '🇷🇪', name: 'Réunion' },
    { code: '+263', flag: '🇿🇼', name: 'Zimbabwe' },
    { code: '+264', flag: '🇳🇦', name: 'Namibia' },
    { code: '+265', flag: '🇲🇼', name: 'Malawi' },
    { code: '+266', flag: '🇱🇸', name: 'Lesotho' },
    { code: '+267', flag: '🇧🇼', name: 'Botswana' },
    { code: '+268', flag: '🇸🇿', name: 'Eswatini' },
    { code: '+269', flag: '🇰🇲', name: 'Comoros' },
    { code: '+290', flag: '🇸🇭', name: 'Saint Helena' },
    { code: '+291', flag: '🇪🇷', name: 'Eritrea' },
    { code: '+297', flag: '🇦🇼', name: 'Aruba' },
    { code: '+298', flag: '🇫🇴', name: 'Faroe Islands' },
    { code: '+299', flag: '🇬🇱', name: 'Greenland' },
    { code: '+350', flag: '🇬🇮', name: 'Gibraltar' },
    { code: '+351', flag: '🇵🇹', name: 'Portugal' },
    { code: '+352', flag: '🇱🇺', name: 'Luxembourg' },
    { code: '+353', flag: '🇮🇪', name: 'Ireland' },
    { code: '+354', flag: '🇮🇸', name: 'Iceland' },
    { code: '+355', flag: '🇦🇱', name: 'Albania' },
    { code: '+356', flag: '🇲🇹', name: 'Malta' },
    { code: '+357', flag: '🇨🇾', name: 'Cyprus' },
    { code: '+358', flag: '🇫🇮', name: 'Finland' },
    { code: '+359', flag: '🇧🇬', name: 'Bulgaria' },
    { code: '+370', flag: '🇱🇹', name: 'Lithuania' },
    { code: '+371', flag: '🇱🇻', name: 'Latvia' },
    { code: '+372', flag: '🇪🇪', name: 'Estonia' },
    { code: '+373', flag: '🇲🇩', name: 'Moldova' },
    { code: '+374', flag: '🇦🇲', name: 'Armenia' },
    { code: '+375', flag: '🇧🇾', name: 'Belarus' },
    { code: '+376', flag: '🇦🇩', name: 'Andorra' },
    { code: '+377', flag: '🇲🇨', name: 'Monaco' },
    { code: '+378', flag: '🇸🇲', name: 'San Marino' },
    { code: '+380', flag: '🇺🇦', name: 'Ukraine' },
    { code: '+381', flag: '🇷🇸', name: 'Serbia' },
    { code: '+382', flag: '🇲🇪', name: 'Montenegro' },
    { code: '+383', flag: '🇽🇰', name: 'Kosovo' },
    { code: '+385', flag: '🇭🇷', name: 'Croatia' },
    { code: '+386', flag: '🇸🇮', name: 'Slovenia' },
    { code: '+387', flag: '🇧🇦', name: 'Bosnia and Herzegovina' },
    { code: '+389', flag: '🇲🇰', name: 'North Macedonia' },
    { code: '+420', flag: '🇨🇿', name: 'Czech Republic' },
    { code: '+421', flag: '🇸🇰', name: 'Slovakia' },
    { code: '+423', flag: '🇱🇮', name: 'Liechtenstein' },
    { code: '+500', flag: '🇫🇰', name: 'Falkland Islands' },
    { code: '+501', flag: '🇧🇿', name: 'Belize' },
    { code: '+502', flag: '🇬🇹', name: 'Guatemala' },
    { code: '+503', flag: '🇸🇻', name: 'El Salvador' },
    { code: '+504', flag: '🇭🇳', name: 'Honduras' },
    { code: '+505', flag: '🇳🇮', name: 'Nicaragua' },
    { code: '+506', flag: '🇨🇷', name: 'Costa Rica' },
    { code: '+507', flag: '🇵🇦', name: 'Panama' },
    { code: '+508', flag: '🇵🇲', name: 'Saint Pierre and Miquelon' },
    { code: '+509', flag: '🇭🇹', name: 'Haiti' },
    { code: '+590', flag: '🇬🇵', name: 'Guadeloupe' },
    { code: '+591', flag: '🇧🇴', name: 'Bolivia' },
    { code: '+592', flag: '🇬🇾', name: 'Guyana' },
    { code: '+593', flag: '🇪🇨', name: 'Ecuador' },
    { code: '+594', flag: '🇬🇫', name: 'French Guiana' },
    { code: '+595', flag: '🇵🇾', name: 'Paraguay' },
    { code: '+596', flag: '🇲🇶', name: 'Martinique' },
    { code: '+597', flag: '🇸🇷', name: 'Suriname' },
    { code: '+598', flag: '🇺🇾', name: 'Uruguay' },
    { code: '+599', flag: '🇨🇼', name: 'Curaçao' },
    { code: '+670', flag: '🇹🇱', name: 'East Timor' },
    { code: '+672', flag: '🇦🇶', name: 'Antarctica' },
    { code: '+673', flag: '🇧🇳', name: 'Brunei' },
    { code: '+674', flag: '🇳🇷', name: 'Nauru' },
    { code: '+675', flag: '🇵🇬', name: 'Papua New Guinea' },
    { code: '+676', flag: '🇹🇴', name: 'Tonga' },
    { code: '+677', flag: '🇸🇧', name: 'Solomon Islands' },
    { code: '+678', flag: '🇻🇺', name: 'Vanuatu' },
    { code: '+679', flag: '🇫🇯', name: 'Fiji' },
    { code: '+680', flag: '🇵🇼', name: 'Palau' },
    { code: '+681', flag: '🇼🇫', name: 'Wallis and Futuna' },
    { code: '+682', flag: '🇨🇰', name: 'Cook Islands' },
    { code: '+683', flag: '🇳🇺', name: 'Niue' },
    { code: '+684', flag: '🇦🇸', name: 'American Samoa' },
    { code: '+685', flag: '🇼🇸', name: 'Samoa' },
    { code: '+686', flag: '🇰🇮', name: 'Kiribati' },
    { code: '+687', flag: '🇳🇨', name: 'New Caledonia' },
    { code: '+688', flag: '🇹🇻', name: 'Tuvalu' },
    { code: '+689', flag: '🇵🇫', name: 'French Polynesia' },
    { code: '+690', flag: '🇹🇰', name: 'Tokelau' },
    { code: '+691', flag: '🇫🇲', name: 'Federated States of Micronesia' },
    { code: '+692', flag: '🇲🇭', name: 'Marshall Islands' },
    { code: '+850', flag: '🇰🇵', name: 'North Korea' },
    { code: '+852', flag: '🇭🇰', name: 'Hong Kong' },
    { code: '+853', flag: '🇲🇴', name: 'Macau' },
    { code: '+855', flag: '🇰🇭', name: 'Cambodia' },
    { code: '+856', flag: '🇱🇦', name: 'Laos' },
    { code: '+880', flag: '🇧🇩', name: 'Bangladesh' },
    { code: '+886', flag: '🇹🇼', name: 'Taiwan' },
    { code: '+960', flag: '🇲🇻', name: 'Maldives' },
    { code: '+961', flag: '🇱🇧', name: 'Lebanon' },
    { code: '+962', flag: '🇯🇴', name: 'Jordan' },
    { code: '+963', flag: '🇸🇾', name: 'Syria' },
    { code: '+964', flag: '🇮🇶', name: 'Iraq' },
    { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
    { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
    { code: '+967', flag: '🇾🇪', name: 'Yemen' },
    { code: '+968', flag: '🇴🇲', name: 'Oman' },
    { code: '+970', flag: '🇵🇸', name: 'Palestine' },
    { code: '+971', flag: '🇦🇪', name: 'United Arab Emirates' },
    { code: '+972', flag: '🇮🇱', name: 'Israel' },
    { code: '+973', flag: '🇧🇭', name: 'Bahrain' },
    { code: '+974', flag: '🇶🇦', name: 'Qatar' },
    { code: '+975', flag: '🇧🇹', name: 'Bhutan' },
    { code: '+976', flag: '🇲🇳', name: 'Mongolia' },
    { code: '+977', flag: '🇳🇵', name: 'Nepal' },
    { code: '+992', flag: '🇹🇯', name: 'Tajikistan' },
    { code: '+993', flag: '🇹🇲', name: 'Turkmenistan' },
    { code: '+994', flag: '🇦🇿', name: 'Azerbaijan' },
    { code: '+995', flag: '🇬🇪', name: 'Georgia' },
    { code: '+996', flag: '🇰🇬', name: 'Kyrgyzstan' },
    { code: '+998', flag: '🇺🇿', name: 'Uzbekistan' },
];

// Form-compatible CountryCodeSelector component
export const CountryCodeSelector = ({
    value,
    onChange,
    placeholder = 'Select country code',
    ...props
}) => {
    const [open, setOpen] = useState(false);
    const [customCode, setCustomCode] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);

    // Find the selected country based on the value
    const selectedCountry = value
        ? countryCodes.find(country => country.code === value) || {
              code: value,
              flag: '🌍',
              name: 'Custom Code',
          }
        : null;

    const handleSelectCountry = country => {
        onChange(country.code);
        setCustomCode('');
        setShowCustomInput(false);
        setOpen(false);
    };

    const handleCustomCodeSubmit = () => {
        if (customCode.trim()) {
            const formattedCode = customCode.startsWith('+')
                ? customCode
                : `+${customCode}`;
            onChange(formattedCode);
            setShowCustomInput(false);
            setOpen(false);
        }
    };

    const handleCustomCodeChange = e => {
        const value = e.target.value;
        // Only allow numbers and + at the beginning
        const cleaned = value.replace(/[^\d+]/g, '');
        if (cleaned === '' || cleaned.startsWith('+')) {
            setCustomCode(cleaned);
        }
    };

    const getDisplayValue = () => {
        if (selectedCountry) {
            return (
                <div className='flex items-center gap-2'>
                    <span className='text-sm'>{selectedCountry.flag}</span>
                    <span className='font-medium text-gray-900 dark:text-gray-100'>
                        {selectedCountry.code}
                    </span>
                    <span className='text-sm text-gray-600 dark:text-gray-300'>
                        {selectedCountry.name}
                    </span>
                </div>
            );
        }
        return (
            <span
                className={cn(
                    'text-gray-500 dark:text-gray-400',
                    props.className
                )}>
                {placeholder}
            </span>
        );
    };

    return (
        <div className='w-full'>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant='outline'
                        role='combobox'
                        aria-expanded={open}
                        className='w-full justify-between h-auto min-h-[40px] px-3 py-2 bg-white dark:bg-transparent border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'>
                        {getDisplayValue()}
                        <HugeiconsIcon
                            icon={ArrowDown01Icon}
                            className='ml-2 h-4 w-4 shrink-0 opacity-50'
                        />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className='p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    align='start'>
                    <Command className='bg-white dark:bg-gray-800'>
                        <CommandInput
                            placeholder='Search country or code...'
                            className='h-9 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400'
                        />
                        <CommandList>
                            <CommandEmpty>
                                <div className='p-4 text-center space-y-3'>
                                    <div className='text-sm text-gray-600 dark:text-gray-300'>
                                        No country found. Add a custom code?
                                    </div>
                                    <Button
                                        variant='outline'
                                        size='sm'
                                        onClick={() => setShowCustomInput(true)}
                                        className='flex items-center gap-2'>
                                        <HugeiconsIcon
                                            icon={PlusSignIcon}
                                            className='h-4 w-4'
                                        />
                                        Add Custom Code
                                    </Button>
                                </div>
                            </CommandEmpty>

                            {showCustomInput && (
                                <>
                                    <div className='p-3 border-b bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'>
                                        <div className='space-y-2'>
                                            <div className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                                Enter custom country code:
                                            </div>
                                            <div className='flex gap-2'>
                                                <Input
                                                    placeholder='+123'
                                                    value={customCode}
                                                    onChange={
                                                        handleCustomCodeChange
                                                    }
                                                    className='flex-1 h-8 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400'
                                                    maxLength={6}
                                                />
                                                <Button
                                                    size='sm'
                                                    onClick={
                                                        handleCustomCodeSubmit
                                                    }
                                                    disabled={
                                                        !customCode.trim()
                                                    }
                                                    className='h-8'>
                                                    Add
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <CommandSeparator className='bg-gray-200 dark:bg-gray-700' />
                                </>
                            )}

                            <CommandGroup
                                heading='Popular Countries'
                                className='text-gray-700 dark:text-gray-300'>
                                {countryCodes
                                    .slice(0, 10)
                                    .map((country, index) => (
                                        <CommandItem
                                            key={`${country.code}-${country.name}-${index}`}
                                            value={`${country.code} ${country.name}`}
                                            onSelect={() =>
                                                handleSelectCountry(country)
                                            }
                                            className='flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'>
                                            <span className='text-sm'>
                                                {country.flag}
                                            </span>
                                            <div className='flex-1 min-w-0'>
                                                <div className='flex items-center gap-2'>
                                                    <span className='font-medium text-gray-900 dark:text-gray-100'>
                                                        {country.code}
                                                    </span>
                                                    <span className='text-sm text-gray-600 dark:text-gray-300 truncate'>
                                                        {country.name}
                                                    </span>
                                                </div>
                                            </div>
                                            <HugeiconsIcon
                                                icon={Tick01Icon}
                                                className={cn(
                                                    'ml-auto h-4 w-4 text-primary',
                                                    value === country.code
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                            </CommandGroup>

                            <CommandSeparator className='bg-gray-200 dark:bg-gray-700' />

                            <CommandGroup
                                heading='All Countries'
                                className='text-gray-700 dark:text-gray-300'>
                                {countryCodes
                                    .slice(10)
                                    .map((country, index) => (
                                        <CommandItem
                                            key={`${country.code}-${
                                                country.name
                                            }-${index + 10}`}
                                            value={`${country.code} ${country.name}`}
                                            onSelect={() =>
                                                handleSelectCountry(country)
                                            }
                                            className='flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'>
                                            <span className='text-sm'>
                                                {country.flag}
                                            </span>
                                            <div className='flex-1 min-w-0'>
                                                <div className='flex items-center gap-2'>
                                                    <span className='font-medium text-gray-900 dark:text-gray-100'>
                                                        {country.code}
                                                    </span>
                                                    <span className='text-sm text-gray-600 dark:text-gray-300 truncate'>
                                                        {country.name}
                                                    </span>
                                                </div>
                                            </div>
                                            <HugeiconsIcon
                                                icon={Tick01Icon}
                                                className={cn(
                                                    'ml-auto h-4 w-4 text-primary',
                                                    value === country.code
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};

