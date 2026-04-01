'use client';
import PasswordFiled from '@/app/[lang]/(frontend)/(auth)/components/FormInputFields/password-field';
import { updateForgottenPasswordOfCustomer } from '@/app/_actions/customerActions';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const ResetPassword = ({ email }) => {
    //react hook form code
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const router = useRouter();
    const pathname = usePathname();

    const onSubmit = async data => {
        try {
            const result = await updateForgottenPasswordOfCustomer(
                email,
                data.password
            );
            if (result?.success === true) {
                toast.success('Password Updated Success', {
                    style: {
                        backgroundColor: 'rgba(16, 185, 129, 0.7)',
                        color: '#fff',
                    } });
                const newPath = pathname.replace('forgot-password', 'sign-in');
                router.push(newPath);
            }
        } catch (error) {
            throw new Error('Their was an error while updating user password');
        }
    };

    return (
        <>
            <div className='w-[390px] bg-background mx-auto p-8 rounded-lg justify-center flex flex-col'>
                <h2 className='text-[22px] font-bold mb-2'>
                    Reset your password
                </h2>
                <form action='' onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className='text-sm font-medium'>
                            {' '}
                            New password
                        </label>

                        <PasswordFiled
                            placeholder='New password'
                            register={register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 8,
                                    message:
                                        'Password should be at least 8 characters',
                                },
                                maxLength: {
                                    value: 100,
                                    message:
                                        'Password should not exceed 100 characters',
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,100}$/,
                                    message:
                                        'Password must contain at least 1 uppercase, 1 lowercase, and 1 number',
                                } })}
                            error={errors?.password}
                        />

                        {errors?.password && (
                            <p className='text-sm text-destructive mt-1'>
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* confirm password */}
                    <div className='my-3'>
                        <label className='text-sm font-medium'>
                            Confirm Password
                        </label>

                        <PasswordFiled
                            placeholder='Confirm Password'
                            register={register('confirm_password', {
                                required: 'Please confirm your password',
                                minLength: {
                                    value: 8,
                                    message:
                                        'Password should be at least 8 characters',
                                },
                                maxLength: {
                                    value: 100,
                                    message:
                                        'Password should not exceed 100 characters',
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,100}$/,
                                    message:
                                        'Password must contain at least 1 uppercase, 1 lowercase, and 1 number',
                                },
                                validate: value =>
                                    watch('password') === value ||
                                    'Password not matched' })}
                            error={errors?.confirm_password}
                        />

                        {errors?.confirm_password && (
                            <p className='text-sm text-destructive mt-1'>
                                {errors.confirm_password.message}
                            </p>
                        )}
                    </div>

                    {/* submit button */}
                    <div className='mt-3'>
                        <button
                            type='submit'
                            className='mt-1 flex justify-center items-center p-3 mx-auto text-center bg-primary hover:bg-primary/90 transition-all duration-150 text-primary-foreground w-full rounded cursor-pointer'>
                            Reset password
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ResetPassword;

