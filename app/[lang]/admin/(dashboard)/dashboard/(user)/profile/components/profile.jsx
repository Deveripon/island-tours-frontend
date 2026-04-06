'use client';
import { updateUserById } from '@/app/_actions/userActions';
import DashboardUserProfileSkeliton from '@/components/skelitons/dashboard-user-profile-skeliton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useVerification } from '@/hooks/use-verification';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ChangePassword from './change-password';
import { EditableSelectField } from './editable-select-field';
import { EditableTextField } from './editable-text-field';
import ProfilePhotoSection from './profile-photo-section';

const Profile = ({ user }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [emailConfirmOpen, setEmailConfirmOpen] = useState(false);
    const [originalEmail, setOriginalEmail] = useState('');
    const { setIsVerified } = useVerification();
    // React Hook Form setup
    const {
        control,
        setValue,
        getValues,
        trigger,
        resetField,
        reset,
        formState: { errors },
        watch,
    } = useForm({
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            dob: '',
            nationality: '',
            gender: 'male',
            location: '',
            website: '',
            company: '',
        },
    });

    // Form Validation rules
    const formValidationRules = {
        name: {
            required: 'Name is required',
            minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
            },
        },
        phone: {
            pattern: {
                value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
                message: 'Invalid phone number',
            },
        },
        email: {
            required: 'Email is required',
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
            },
        },
        dob: {
            validate: value => {
                if (!value) return true;
                const date = new Date(value);
                return !isNaN(date.getTime()) || 'Invalid date format';
            },
        },
        website: {
            pattern: {
                value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                message: 'Invalid website URL',
            },
        },
        location: {},
        company: {},
        nationality: {},
    };

    // Watch email field for changes
    const currentEmail = watch('email');

    // Gender options
    const genderOptions = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Non-binary', value: 'non-binary' },
        { label: 'Prefer not to say', value: 'prefer-not-to-say' },
    ];

    // Function to handle field save
    const handleSaveField = async fieldId => {
        // Type assertion to ensure fieldId is a valid form field
        const formField = fieldId;

        const isValid = await trigger(formField);

        if (!isValid) {
            return; // Stop here if validation failed
        }

        // Special handling for email field
        if (fieldId === 'email') {
            const newEmail = getValues('email');
            if (newEmail !== originalEmail && newEmail.trim() !== '') {
                setEmailConfirmOpen(true);
                setEditingField(null);
                return;
            }
        }

        setEditingField(null);
        await updateChangesToDb(fieldId);
    };

    // Function to confirm email change
    const confirmEmailChange = async email => {
        await updateChangesToDb('email', email);
        setEmailConfirmOpen(false);
    };

    // Function to handle API save
    const updateChangesToDb = async (fieldId, explicitValue) => {
        try {
            setIsSaving(true);
            const formField = fieldId;
            const value = explicitValue || getValues(formField);

            // Map field IDs to API field names
            const apiFieldMap = {
                name: 'name',
                phone: 'phone',
                email: 'email',
                dob: 'dob',
                nationality: 'nationality',
                gender: 'gender',
                location: 'location',
                website: 'website',
                company: 'company',
            };

            const apiFieldName = apiFieldMap[fieldId];

            // Make API request to update the user data
            setEditingField(null);
            if (user?.id) {
                if (fieldId === 'email' && explicitValue) {
                    const response = await updateUserById(user.id, {
                        email: explicitValue,
                        isVerified: false,
                    });

                    if (response?.success === true) {
                        setIsVerified(false);
                    }
                } else {
                    const response = await updateUserById(user.id, {
                        [apiFieldName]: value,
                    });

                    if (response?.success === true) {
                    }
                }
            }
        } catch (err) {
        } finally {
            setIsSaving(false);
        }
    };

    // Sync User data from response with formdata
    const syncResponseWithFormData = useCallback(
        user => {
            reset({
                name: user.name || '',
                phone: user.phone || '',
                email: user.email || '',
                dob: user.dob || '',
                nationality: user.nationality || '',
                gender: user.gender || 'male',
                location: user.location || '',
                website: user.website || '',
                company: user.company || '',
            });

            setOriginalEmail(user.email || '');
        },
        [reset]
    );

    useEffect(() => {
        if (user) {
            syncResponseWithFormData(user);
        }
    }, [user, reset, syncResponseWithFormData]);

    return (
        <div className='grid grid-cols-12'>
            <div className='col-span-12 lg:col-span-11 xl:col-span-9 rounded-lg'>
                {/* Profile Photo */}
                <Card className='mb-6'>
                    <CardHeader>
                        <CardTitle>Profile Photo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProfilePhotoSection user={user} />
                    </CardContent>
                </Card>

                {/* User Details */}
                <Card className='mb-6'>
                    <CardHeader>
                        <CardTitle>User Details</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {isLoading ? (
                            <div className='text-center py-4'>
                                <DashboardUserProfileSkeliton />
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-8'>
                                <EditableTextField
                                    id='name'
                                    label='Full Name'
                                    control={control}
                                    editingField={editingField}
                                    setEditingField={setEditingField}
                                    onSaveField={handleSaveField}
                                    isSaving={isSaving}
                                    validationRules={formValidationRules.name}
                                    resetField={resetField}
                                    placeholder={'Your Full Name'}
                                />

                                <EditableTextField
                                    id='phone'
                                    label='Phone'
                                    control={control}
                                    editingField={editingField}
                                    setEditingField={setEditingField}
                                    onSaveField={handleSaveField}
                                    isSaving={isSaving}
                                    validationRules={formValidationRules.phone}
                                    resetField={resetField}
                                    placeholder={'Your Phone Number'}
                                />

                                <EditableTextField
                                    id='email'
                                    label='Email'
                                    control={control}
                                    editingField={editingField}
                                    setEditingField={setEditingField}
                                    onSaveField={handleSaveField}
                                    isSaving={isSaving}
                                    validationRules={formValidationRules.email}
                                    resetField={resetField}
                                    placeholder={'Your Email Address'}
                                />

                                <EditableTextField
                                    id='dob'
                                    label='Date of Birth'
                                    control={control}
                                    editingField={editingField}
                                    setEditingField={setEditingField}
                                    onSaveField={handleSaveField}
                                    isSaving={isSaving}
                                    validationRules={formValidationRules.dob}
                                    resetField={resetField}
                                    placeholder='dd-mm-yyyy'
                                />

                                <EditableTextField
                                    id='nationality'
                                    label='Nationality'
                                    control={control}
                                    editingField={editingField}
                                    setEditingField={setEditingField}
                                    onSaveField={handleSaveField}
                                    isSaving={isSaving}
                                    validationRules={
                                        formValidationRules.nationality
                                    }
                                    resetField={resetField}
                                    placeholder={'Nationality'}
                                />

                                <EditableSelectField
                                    id='gender'
                                    label='Gender'
                                    control={control}
                                    options={genderOptions}
                                    editingField={editingField}
                                    setEditingField={setEditingField}
                                    onSaveField={handleSaveField}
                                    isSaving={isSaving}
                                    resetField={resetField}
                                />

                                <EditableTextField
                                    id='location'
                                    label='Location'
                                    control={control}
                                    editingField={editingField}
                                    setEditingField={setEditingField}
                                    onSaveField={handleSaveField}
                                    isSaving={isSaving}
                                    validationRules={
                                        formValidationRules.location
                                    }
                                    resetField={resetField}
                                    placeholder={'Your Address'}
                                />

                                <EditableTextField
                                    id='website'
                                    label='Website'
                                    control={control}
                                    editingField={editingField}
                                    setEditingField={setEditingField}
                                    onSaveField={handleSaveField}
                                    isSaving={isSaving}
                                    validationRules={
                                        formValidationRules.website
                                    }
                                    resetField={resetField}
                                    placeholder={'Website'}
                                />

                                <EditableTextField
                                    id='company'
                                    label='Company'
                                    control={control}
                                    editingField={editingField}
                                    setEditingField={setEditingField}
                                    onSaveField={handleSaveField}
                                    isSaving={isSaving}
                                    validationRules={
                                        formValidationRules.company
                                    }
                                    resetField={resetField}
                                    placeholder={'Company'}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
                <ChangePassword />
                {/* Email Change Confirmation Dialog */}
                <Dialog
                    open={emailConfirmOpen}
                    onOpenChange={setEmailConfirmOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Email Change</DialogTitle>
                            <DialogDescription>
                                You{"'"} re about to change your email from{' '}
                                {originalEmail} to {currentEmail}. You will need
                                to verify your new email address after this
                                change.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant='outline'
                                onClick={() => setEmailConfirmOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={() =>
                                    confirmEmailChange(currentEmail)
                                }>
                                Change Email
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default Profile;

