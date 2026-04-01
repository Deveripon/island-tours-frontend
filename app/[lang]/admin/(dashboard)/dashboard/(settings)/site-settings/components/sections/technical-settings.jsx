import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Settings01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { EditableSelectField } from '../../../profile/components/editable-select-field';
import { EditableTextField } from '../../../profile/components/editable-text-field';
import { EditableTextAreaField } from '../../../profile/components/editable-textarea-filed';
const TechnicalSettings = ({
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
                <HugeiconsIcon icon={Settings01Icon} size={20} />
                Technical Settings
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className='space-y-6'>
                <div>
                    <h4 className='text-sm font-medium text-gray-900 mb-4'>
                        Performance
                    </h4>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                        <EditableSelectField
                            id='imageOptimization'
                            label='Image Optimization'
                            control={control}
                            options={[
                                { label: 'Enabled', value: 'enabled' },
                                { label: 'Disabled', value: 'disabled' },
                            ]}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            resetField={resetField}
                        />
                        <EditableSelectField
                            id='lazyLoading'
                            label='Lazy Loading'
                            control={control}
                            options={[
                                { label: 'Enabled', value: 'enabled' },
                                { label: 'Disabled', value: 'disabled' },
                            ]}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            resetField={resetField}
                        />
                        <EditableSelectField
                            id='browserCaching'
                            label='Browser Caching'
                            control={control}
                            options={[
                                { label: '1 Day', value: '1d' },
                                { label: '7 Days', value: '7d' },
                                { label: '30 Days', value: '30d' },
                                { label: '1 Year', value: '1y' },
                            ]}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            resetField={resetField}
                        />
                        <EditableSelectField
                            id='cdnEnabled'
                            label='CDN'
                            control={control}
                            options={[
                                { label: 'Enabled', value: 'enabled' },
                                { label: 'Disabled', value: 'disabled' },
                            ]}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            resetField={resetField}
                        />
                    </div>
                </div>

                <Separator />

                <div>
                    <h4 className='text-sm font-medium text-gray-900 mb-4'>
                        Security & Privacy
                    </h4>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                        <EditableSelectField
                            id='cookieConsent'
                            label='Cookie Consent Banner'
                            control={control}
                            options={[
                                { label: 'Enabled', value: 'enabled' },
                                { label: 'Disabled', value: 'disabled' },
                            ]}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            resetField={resetField}
                        />
                        <EditableTextField
                            id='privacyPolicyUrl'
                            label='Privacy Policy URL'
                            control={control}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            validationRules={formValidationRules.urlField}
                            resetField={resetField}
                            placeholder='https://yourdomain.com/privacy'
                        />
                        <EditableTextField
                            id='termsOfServiceUrl'
                            label='Terms of Service URL'
                            control={control}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            validationRules={formValidationRules.urlField}
                            resetField={resetField}
                            placeholder='https://yourdomain.com/terms'
                        />
                    </div>
                </div>

                <Separator />

                <div>
                    <h4 className='text-sm font-medium text-gray-900 mb-4'>
                        Maintenance Mode
                    </h4>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                        <EditableSelectField
                            id='maintenanceMode'
                            label='Maintenance Mode'
                            control={control}
                            options={[
                                { label: 'Disabled', value: 'disabled' },
                                { label: 'Enabled', value: 'enabled' },
                            ]}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            resetField={resetField}
                        />
                        <div className='lg:col-span-2'>
                            <EditableTextAreaField
                                id='maintenanceMessage'
                                label='Maintenance Message'
                                control={control}
                                editingField={editingField}
                                setEditingField={setEditingField}
                                onSaveField={handleSaveField}
                                isSaving={isSaving}
                                validationRules={
                                    formValidationRules.maintenanceMessage
                                }
                                resetField={resetField}
                                placeholder='We are currently performing maintenance. Please check back soon.'
                                rows={3}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

export default TechnicalSettings;

