import { CountryCodeSelector } from '@/app/[lang]/(trips-landing-page)/components/ui/country-code-selector';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';

const TravelarContactInformation = ({ isRequest }) => {
    const { control } = useFormContext();
    return (
        <div className='px-6'>
            <div className='mb-3'>
                <h3 className='font-semibold mb-4 text-gray-900 dark:text-gray-100'>
                    Please enter contact details
                </h3>
                <div className='space-y-3'>
                    <FormField
                        control={control}
                        name={`contactInfo.name`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-gray-700 dark:text-gray-300'>
                                    Name{' '}
                                    <span className='text-red-500 dark:text-red-400'>
                                        *
                                    </span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Full Name'
                                        {...field}
                                        className=' bg-transparent border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500'
                                    />
                                </FormControl>
                                <FormMessage className='text-red-500 dark:text-red-400' />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name={`contactInfo.email`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-gray-700 dark:text-gray-300'>
                                    Email{' '}
                                    <span className='text-red-500 dark:text-red-400'>
                                        *
                                    </span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Email Address'
                                        {...field}
                                        className=' bg-transparent border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500'
                                    />
                                </FormControl>
                                <FormMessage className='text-red-500 dark:text-red-400' />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name={`contactInfo.mobile.countryCode`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-gray-700 dark:text-gray-300'>
                                    Country Code{' '}
                                    <span className='text-red-500 dark:text-red-400'>
                                        *
                                    </span>
                                </FormLabel>
                                <FormControl>
                                    <CountryCodeSelector
                                        value={field?.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage className='text-red-500 dark:text-red-400' />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name={`contactInfo.mobile.number`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-gray-700 dark:text-gray-300'>
                                    Mobile{' '}
                                    <span className='text-red-500 dark:text-red-400'>
                                        *
                                    </span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Eg: 980 123 8910'
                                        {...field}
                                        className=' bg-transparent border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500'
                                    />
                                </FormControl>
                                <FormMessage className='text-red-500 dark:text-red-400' />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            {!isRequest && (
                <div className='mb-3'>
                    <div className='space-y-3'>
                        <FormField
                            control={control}
                            name={`contactInfo.city`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-gray-700 dark:text-gray-300'>
                                        City
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Eg: Dhaka'
                                            {...field}
                                            className=' bg-transparent border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500'
                                        />
                                    </FormControl>
                                    <FormMessage className='text-red-500 dark:text-red-400' />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name={`contactInfo.address`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-gray-700 dark:text-gray-300'>
                                        Address
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Eg: House Number, Street Name, etc.'
                                            {...field}
                                            className=' bg-transparent border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500'
                                        />
                                    </FormControl>
                                    <FormMessage className='text-red-500 dark:text-red-400' />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            )}

            <FormField
                control={control}
                name={`specialRequests`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className='text-gray-700 dark:text-gray-300'>
                            {isRequest
                                ? 'Write your desire for this trip'
                                : 'Special Requests'}
                        </FormLabel>
                        <FormControl>
                            <Textarea
                                {...field}
                                placeholder='Enter Special Requests'
                                className='min-h-[100px]  bg-transparent border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500'
                            />
                        </FormControl>
                        <FormMessage className='text-red-500 dark:text-red-400' />
                    </FormItem>
                )}
            />
        </div>
    );
};

export default TravelarContactInformation;

