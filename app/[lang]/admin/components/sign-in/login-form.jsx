'use client';
import { handleSignInWithCredentials } from '@/app/_actions/authActions';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Mail02Icon, SquareLock01Icon } from '@hugeicons/core-free-icons';
import { gsap } from 'gsap';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormInput from './inputs/form-input';
import SubmitButton from './inputs/submit-button';

const LoginForm = ({ className }) => {
    const [formType, setFormType] = useState('login');
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(false);

    const formElementsRef = useRef(null);
    const passwordFieldRef = useRef(null);
    const formContentRef = useRef(null);
    const headingRef = useRef(null);
    const descriptionRef = useRef(null);

    const router = useRouter();

    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const {
        setError,
        clearErrors,
        formState: { errors },
        watch,
    } = form;

    useEffect(() => {
        const elements = formElementsRef.current?.children;
        if (elements) {
            gsap.fromTo(
                elements,
                {
                    opacity: 0,
                    y: 20,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    stagger: 0.5,
                    delay: 0.2,
                    ease: 'power3.out',
                }
            );
        }
    }, []);

    const handleFormTypeChange = () => {
        const newFormType = formType === 'login' ? 'forgot-password' : 'login';
        clearErrors();
        setAlert(false);

        const tl = gsap.timeline();

        tl.to([headingRef.current, descriptionRef.current], {
            opacity: 0,
            y: -10,
            duration: 0.3,
            ease: 'power2.in',
        });

        if (newFormType === 'login') {
            tl.call(() => setFormType(newFormType))
                .set(passwordFieldRef.current, {
                    height: 0,
                    opacity: 0,
                    marginBottom: '20px',
                    overflow: 'hidden',
                })
                .to(
                    passwordFieldRef.current,
                    {
                        height: 'auto',
                        opacity: 1,
                        marginBottom: '20px',
                        duration: 0.4,
                        ease: 'none',
                    },
                    '<'
                )
                .to(
                    [headingRef.current, descriptionRef.current],
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.3,
                        ease: 'power2.out',
                    },
                    '-=0.3'
                );
        } else {
            tl.to(
                passwordFieldRef.current,
                {
                    height: 0,
                    opacity: 0,
                    marginBottom: 0,
                    duration: 0.3,
                    ease: 'none',
                },
                0
            )
                .call(() => setFormType(newFormType))
                .to([headingRef.current, descriptionRef.current], {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out',
                });
        }
    };

    // Sign in handler
    const login = async ({ email, password }) => {
        try {
            clearErrors('global');
            setIsLoading(true);

            const response = await handleSignInWithCredentials({
                email,
                password,
            });

            if (!response?.success || response?.error) {
                setIsLoading(false);
                const errorMessage =
                    response?.error?.message ||
                    'Login failed. Please try again.';
                setError('global', {
                    type: 'manual',
                    message: errorMessage,
                });
                setAlert(true);
                return;
            }

            router.replace('/admin/dashboard');

            setIsLoading(false);
        } catch (error) {
            console.error('Login error:', error);
            setIsLoading(false);
            setError('global', {
                type: 'manual',
                message:
                    'There was an error while signing in. Please try again.',
            });
            setAlert(true);
        }
    };

    const onSubmit = async data => {
        try {
            clearErrors('global');
            setIsLoading(true);
            setAlert(false);

            const { email, password } = data;

            if (formType === 'forgot-password') {
                try {
                    // Simulate an API call
                    await new Promise(resolve => setTimeout(resolve, 800));
                    setIsLoading(false);
                    setError('global', {
                        type: 'manual',
                        message:
                            'Password reset instructions have been sent to your email.',
                    });
                    setAlert(true);
                    return;
                } catch (error) {
                    setIsLoading(false);
                    setError('global', {
                        type: 'manual',
                        message:
                            'There was an error while sending instructions. Please try again.',
                    });
                    setAlert(true);
                }
            } else {
                await login({ email, password });
            }
        } catch (error) {
            console.error('Submit error:', error);
            setIsLoading(false);
            setError('global', {
                type: 'manual',
                message:
                    formType === 'forgot-password'
                        ? 'There was an error while sending instructions. Please try again.'
                        : 'There was an error while signing in. Please try again.',
            });
            setAlert(true);
        }
    };

    return (
        <div
            className={cn(
                'py-12  px-4 sm:px-6 md:px-10 lg:px-[60px] relative group w-full max-w-full',
                className
            )}>
            <div ref={formElementsRef} className='w-full'>
                <div className='info flex flex-col gap-[1vh] sm:gap-[2vh] mb-[3vh] sm:mb-[5vh]'>
                    <h1
                        ref={headingRef}
                        className='font-nyght-serif text-[clamp(1.5rem,4vh,3rem)] leading-tight sm:leading-[1.2] tracking-[-1.44px] text-white text-center px-4'>
                        {formType === 'login'
                            ? 'Welcome Admin'
                            : 'Forgot Password'}
                    </h1>
                    <p
                        ref={descriptionRef}
                        className='font-dm-sans text-white text-[clamp(0.75rem,2vh,1rem)] w-full max-w-[430px] mx-auto leading-[1.5] text-center tracking-[-0.36px] px-4'>
                        {formType === 'login'
                            ? 'Log in to continue, Enter your details to access your account and dashboard.'
                            : 'Enter your email address and we will send you instructions to reset your password.'}
                    </p>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-5  w-full max-w-[550px] mx-auto'>
                        {alert && errors?.global && (
                            <div className='global-error liquid-glass px-4 py-3 rounded-lg shadow-sm flex justify-between gap-3 text-sm text-red-500 relative'>
                                <div className='flex-1'>
                                    <p>{errors.global.message}</p>
                                </div>
                                <button
                                    type='button'
                                    onClick={() => {
                                        setAlert(false);
                                        clearErrors('global');
                                    }}
                                    className='text-red-400 cursor-pointer hover:text-red-600 transition duration-200'
                                    aria-label='Dismiss error'>
                                    <X className='w-5 h-5' />
                                </button>
                            </div>
                        )}

                        <div className='space-y-5' ref={formContentRef}>
                            <FormField
                                control={form.control}
                                name='email'
                                rules={{
                                    required: 'Please provide an email address',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message:
                                            'Please enter a valid email address',
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FormInput
                                                type='email'
                                                field={{
                                                    ...field,
                                                    onChange: e => {
                                                        field.onChange(e);
                                                        clearErrors('global');
                                                        setAlert(false);
                                                    },
                                                }}
                                                placeholder='hello@email.com'
                                                icon={Mail02Icon}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div
                                className='password '
                                ref={passwordFieldRef}
                                style={{
                                    height:
                                        formType === 'forgot-password'
                                            ? 0
                                            : 'auto',
                                    opacity:
                                        formType === 'forgot-password' ? 0 : 1,
                                    marginBottom:
                                        formType === 'forgot-password'
                                            ? 0
                                            : '20px',
                                    overflow: 'hidden',
                                }}>
                                <FormField
                                    control={form.control}
                                    name='password'
                                    rules={{
                                        required:
                                            formType === 'forgot-password'
                                                ? false
                                                : 'Password is required',
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
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FormInput
                                                    type='password'
                                                    field={{
                                                        ...field,
                                                        onChange: e => {
                                                            field.onChange(e);
                                                            clearErrors(
                                                                'global'
                                                            );
                                                            setAlert(false);
                                                        },
                                                    }}
                                                    placeholder='Enter your password'
                                                    icon={SquareLock01Icon}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <SubmitButton
                            formType={formType}
                            isLoading={isLoading}
                        />

                        <div className='flex flex-wrap items-center justify-center gap-1 text-center'>
                            <span className='font-dm-sans text-white text-[clamp(12px,2vh,16px)] leading-[1.5] tracking-[-0.36px]'>
                                {formType === 'login'
                                    ? 'Forgot your password?'
                                    : 'Remember your password?'}
                            </span>
                            <button
                                type='button'
                                onClick={handleFormTypeChange}
                                disabled={isLoading}
                                className='font-dm-sans cursor-pointer text-emerald-400 hover:text-emerald-500 text-[clamp(12px,2vh,16px)] leading-[1.5] font-semibold tracking-[-0.36px] disabled:opacity-50 disabled:cursor-not-allowed'>
                                Click here
                            </button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default LoginForm;

