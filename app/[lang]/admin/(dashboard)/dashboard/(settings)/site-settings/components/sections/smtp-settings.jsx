import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail01Icon, ServerStack03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { EditableSelectField } from '../../../../(user)/profile/components/editable-select-field';
import { EditableTextField } from '../../../../(user)/profile/components/editable-text-field';

const EmailBranding = ({
    control,
    editingField,
    setEditingField,
    handleSaveField,
    isSaving,
    resetField,
    formValidationRules }) => (
    <Card>
        <CardHeader>
            <CardTitle className='flex items-center gap-2'>
                <HugeiconsIcon icon={Mail01Icon} size={20} />
                SMPT Settings
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className='space-y-6'>
                {/*                 <div>
                    <h4 className='text-sm font-medium text-gray-900 mb-4'>
                        Email Settings
                    </h4>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                        <EditableTextField
                            id='emailFromName'
                            label='From Name'
                            control={control}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            validationRules={formValidationRules.emailFromName}
                            resetField={resetField}
                            placeholder='Your Travel Agency'
                        />
                        <EditableTextField
                            id='emailFromAddress'
                            label='From Email Address'
                            control={control}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            validationRules={formValidationRules.emailAddress}
                            resetField={resetField}
                            placeholder='noreply@yourdomain.com'
                        />
                        <EditableTextField
                            id='emailReplyTo'
                            label='Reply-To Address'
                            control={control}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            validationRules={formValidationRules.emailAddress}
                            resetField={resetField}
                            placeholder='support@yourdomain.com'
                        />
                        <EditableTextField
                            id='emailHeaderColor'
                            label='Email Header Color'
                            control={control}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            validationRules={formValidationRules.hexColor}
                            resetField={resetField}
                            placeholder='#3b82f6'
                            type='color'
                        />
                    </div>
                </div>

                <Separator /> */}

                <div>
                    <h4 className='text-sm font-medium text-gray-900 mb-4 flex items-center gap-2'>
                        <HugeiconsIcon icon={ServerStack03Icon} size={16} />
                        SMTP Configuration
                    </h4>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                        <EditableTextField
                            id='smtpHost'
                            label='SMTP Host'
                            control={control}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            validationRules={formValidationRules.smtpHost}
                            resetField={resetField}
                            placeholder='smtp.gmail.com'
                        />
                        <EditableTextField
                            id='smtpPort'
                            label='SMTP Port'
                            control={control}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            validationRules={formValidationRules.smtpPort}
                            resetField={resetField}
                            placeholder='587'
                            type='number'
                        />
                        <EditableTextField
                            id='smtpUsername'
                            label='SMTP Username'
                            control={control}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            validationRules={formValidationRules.smtpUsername}
                            resetField={resetField}
                            placeholder='your-email@domain.com'
                        />
                        <EditableTextField
                            id='smtpPassword'
                            label='SMTP Password'
                            control={control}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            validationRules={formValidationRules.smtpPassword}
                            resetField={resetField}
                            placeholder='••••••••'
                            type='password'
                        />

                        <EditableSelectField
                            id='smtpSecure'
                            label='Use TLS/SSL'
                            control={control}
                            options={[
                                { value: true, label: 'Yes (TLS/SSL)' },
                                { value: false, label: 'No' },
                            ]}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            resetField={resetField}
                        />
                    </div>
                </div>

                {/*            <Separator />

                <div>
                    <h4 className='text-sm font-medium text-gray-900 mb-4'>
                        Email Templates
                    </h4>
                    <div className='grid grid-cols-1 gap-x-8'>
                        <EditableTextAreaField
                            id='emailFooterText'
                            label='Email Footer Text'
                            control={control}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            validationRules={formValidationRules.emailFooter}
                            resetField={resetField}
                            placeholder='© 2025 Your Travel Agency. All rights reserved.'
                            rows={3}
                        />
                        <EditableImageUploader
                            id='emailLogo'
                            label='Email Logo'
                            control={control}
                            editingField={editingField}
                            defaultValue={'/placeholder.png'}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            resetField={resetField}
                            folder='profiles'
                            tags={['email', 'logo']}
                            placeholder='Logo for email headers (600x200 px recommended)'
                            accept='image/*'
                        />
                    </div>
                </div> */}
            </div>
        </CardContent>
    </Card>
);

export default EmailBranding;
