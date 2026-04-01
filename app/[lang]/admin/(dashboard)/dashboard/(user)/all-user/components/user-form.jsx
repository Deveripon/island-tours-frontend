'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { CreateUser, updateUserById } from '@/app/_actions/membersActions';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { userSchema } from '@/utils/validations/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Key } from 'lucide-react';
import { toast } from 'sonner';

// Default form values
const defaultFormValues = {
    name: '',
    email: '',
    role: 'STAFF',
    password: '',
};

// Password generator function
const generateSecurePassword = (length = 19) => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Ensure we have at least one character from each required category
    let password = '';
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];

    // Fill the rest with random characters from all categories
    const allChars = lowercase + uppercase + numbers + symbols;
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password to randomize the position of required characters
    return password
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');
};

export function UserForm({
    open,
    editUser,
    setEditUser,
    onOpenChange,
    tenantId,
    tenantUser }) {
    const [isPending, setIsPending] = useState(false);
    const [showPassword, setShowPassword] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [showPasswordField, setShowPasswordField] = useState(false);

    const [isShowAdminRoleChangeAlert, setIsShowAdminRoleChangeAlert] =
        useState(false);
    const [pendingFormData, setPendingFormData] = useState(null);

    const form = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: defaultFormValues });

    // Reset form when editUser changes or when modal opens/closes
    useEffect(() => {
        if (open) {
            if (editUser) {
                // Reset with edit data
                form.reset({
                    name: editUser.name || '',
                    email: editUser.email || '',
                    role: editUser.role || 'USER',
                    password: '', // Don't populate password for editing
                    image: editUser.image || '' });
                // Hide password field by default for editing
                setShowPasswordField(false);
            } else {
                // Reset to default values for new user
                form.reset(defaultFormValues);
                // Show password field for new user
                setShowPasswordField(true);
            }
        }
    }, [editUser, form, open]);

    // Handle sheet close - IMPROVED
    const handleSheetClose = useCallback(
        (shouldClose = true) => {
            if (shouldClose) {
                // Clear edit user
                setEditUser?.(null);
                // Reset form
                form.reset(defaultFormValues);
                // Reset password field visibility
                setShowPasswordField(false);
                // Close the sheet
                onOpenChange?.(false);
            }
        },
        [setEditUser, form, onOpenChange]
    );

    // Handle password generation
    const handleGeneratePassword = useCallback(() => {
        setGenerating(true);
        const newPassword = generateSecurePassword(16);
        form.setValue('password', newPassword);
        setGenerating(false);
    }, [form]);

    // Handle showing password field for editing
    const handleSetNewPassword = useCallback(() => {
        setShowPasswordField(true);
        // Clear any existing password value
        form.setValue('password', '');
    }, [form]);

    // Perform the actual update
    const performUpdate = useCallback(
        async values => {
            try {
                setIsPending(true);

                // For editing, only include password if it's provided
                const updateData = { ...values };
                if (!values.password || !showPasswordField) {
                    delete updateData.password;
                }

                let result = await updateUserById(editUser?.id, updateData);

                if (result?.success === true) {
                    toast.success('User Updated Successfully');
                    handleSheetClose();
                } else {
                    toast.error(
                        (result?.error &&
                        typeof result.error === 'object' &&
                        'message' in result.error
                            ? result.error.message
                            : 'An error occurred') || 'An error occurred'
                    );
                }
            } catch (error) {
                console.error('Form submission error:', error);
                toast.error('Oops! There was an error');
            } finally {
                setIsPending(false);
            }
        },
        [editUser, handleSheetClose, showPasswordField]
    );

    // Check if this is a tenant admin trying to change their own role from ADMIN
    const isChangingOwnAdminRole = values => {
        return (
            editUser &&
            tenantUser &&
            tenantUser.id === editUser.id &&
            editUser.role === 'ADMIN' &&
            values.role !== 'ADMIN'
        );
    };

    // Handle admin role change confirmation
    const handleAdminRoleChangeCancel = useCallback(() => {
        setIsShowAdminRoleChangeAlert(false);
        setPendingFormData(null);
    }, []);

    const handleAdminRoleChangeConfirm = useCallback(async () => {
        setIsShowAdminRoleChangeAlert(false);

        if (pendingFormData) {
            await performUpdate(pendingFormData);
        }

        setPendingFormData(null);
    }, [pendingFormData, performUpdate]);

    // Handle form submission
    async function onSubmit(values) {

        try {
            if (editUser) {
                // Check if this is a tenant admin changing their own role
                if (isChangingOwnAdminRole(values)) {
                    // Show confirmation dialog
                    setPendingFormData(values);
                    setIsShowAdminRoleChangeAlert(true);
                    return;
                }

                // Proceed with normal update
                await performUpdate(values);
            } else {
                setIsPending(true);

                // Create new user
                let result = await CreateUser(values);

                if (result?.success === true) {
                    toast.success('User Added Successfully');
                    handleSheetClose();
                } else {
                    toast.error(
                        (result?.error &&
                        typeof result.error === 'object' &&
                        'message' in result.error
                            ? result.error.message
                            : 'An error occurred') || 'An error occurred'
                    );
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error('Oops! There was an error');
        } finally {
            setIsPending(false);
        }
    }

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className='sm:max-w-xl p-2 rounded-lg overflow-scroll'>
                    <SheetHeader>
                        <SheetTitle>
                            {editUser ? 'Edit User' : 'Add New User'}
                        </SheetTitle>
                        <SheetDescription>
                            {editUser
                                ? 'Update user details and permissions.'
                                : 'Add a new user to the system.'}
                        </SheetDescription>
                    </SheetHeader>

                    <div className='py-6 px-2'>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className='space-y-6'>
                                <div className='p-3 space-y-4 bg-background'>
                                    <div className='grid grid-cols-1 gap-6'>
                                        <FormField
                                            control={form.control}
                                            name='name'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder='e.g. John Doe'
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name='email'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Email{' '}
                                                        <span className='text-red-500'>
                                                            *
                                                        </span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='email'
                                                            placeholder='e.g. john@example.com'
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name='role'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Role{' '}
                                                    <span className='text-red-500'>
                                                        *
                                                    </span>{' '}
                                                </FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder='Select role' />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value='ADMIN'>
                                                            Administrator
                                                        </SelectItem>
                                                        <SelectItem value='EDITOR'>
                                                            Editor
                                                        </SelectItem>
                                                        <SelectItem value='STAFF'>
                                                            Staff
                                                        </SelectItem>
                                                        <SelectItem value='GUIDE'>
                                                            Guide
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Show "Set New Password" button for editing when password field is hidden */}
                                    {editUser && !showPasswordField && (
                                        <div className='space-y-2'>
                                            <FormLabel>Password</FormLabel>
                                            <Button
                                                type='button'
                                                variant='outline'
                                                onClick={handleSetNewPassword}
                                                className='w-full flex items-center gap-2'
                                                disabled={isPending}>
                                                <Key className='w-4 h-4' />
                                                Set New Password
                                            </Button>
                                            <FormDescription>
                                                Current password will remain
                                                unchanged
                                            </FormDescription>
                                        </div>
                                    )}

                                    {/* Show password field for new users or when "Set New Password" is clicked */}
                                    {(!editUser || showPasswordField) && (
                                        <>
                                            <FormField
                                                control={form.control}
                                                name='password'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Password{' '}
                                                            {!editUser && (
                                                                <span className='text-red-500'>
                                                                    *
                                                                </span>
                                                            )}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className='relative'>
                                                                <Input
                                                                    type={
                                                                        showPassword
                                                                            ? 'text'
                                                                            : 'password'
                                                                    }
                                                                    placeholder={
                                                                        editUser
                                                                            ? 'Enter new password'
                                                                            : 'Enter password'
                                                                    }
                                                                    {...field}
                                                                    className='pr-24'
                                                                />
                                                                <div className='absolute inset-y-0 right-0 flex items-center space-x-1 pr-2'>
                                                                    <Button
                                                                        type='button'
                                                                        variant='ghost'
                                                                        size='sm'
                                                                        onClick={() =>
                                                                            setShowPassword(
                                                                                !showPassword
                                                                            )
                                                                        }
                                                                        className='h-6 w-6 p-0 hover:bg-gray-100'
                                                                        title={
                                                                            showPassword
                                                                                ? 'Hide password'
                                                                                : 'Show password'
                                                                        }>
                                                                        {showPassword ? (
                                                                            <Eye className='w-5 h-5' />
                                                                        ) : (
                                                                            <EyeOff className='w-5 h-5' />
                                                                        )}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </FormControl>

                                                        <FormDescription>
                                                            {editUser
                                                                ? 'Enter a new password to change it'
                                                                : 'Minimum 8 characters required.'}
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className='flex justify-end'>
                                                <Button
                                                    type='button'
                                                    variant='outline'
                                                    onClick={
                                                        handleGeneratePassword
                                                    }
                                                    className='w-fit hover:bg-gray-100'
                                                    title='Generate secure password'
                                                    disabled={isPending}>
                                                    Generate Password
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <SheetFooter>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        onClick={() => handleSheetClose()}
                                        disabled={isPending}>
                                        Cancel
                                    </Button>
                                    <Button type='submit' disabled={isPending}>
                                        {isPending
                                            ? 'Saving...'
                                            : editUser
                                              ? 'Update User'
                                              : 'Create User'}
                                    </Button>
                                </SheetFooter>
                            </form>
                        </Form>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Admin Role Change Alert Dialog */}
            <AlertDialog
                open={isShowAdminRoleChangeAlert}
                onOpenChange={handleAdminRoleChangeCancel}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Change Your Admin Role?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            You are about to remove your own administrator
                            privileges. This will limit your access to
                            admin-only features and settings. Are you sure you
                            want to continue?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={handleAdminRoleChangeCancel}
                            disabled={isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleAdminRoleChangeConfirm}
                            disabled={isPending}
                            className='bg-orange-600 text-white hover:bg-orange-700'>
                            {isPending ? 'Updating...' : 'Yes, Change Role'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

