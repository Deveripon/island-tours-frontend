import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Globe02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { EditableTextField } from '../../../profile/components/editable-text-field';
import { EditableTextAreaField } from '../../../profile/components/editable-textarea-filed';
const DomainSettings = ({
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
                <HugeiconsIcon icon={Globe02Icon} size={20} />
                Domain & Hosting
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className='space-y-6'>
                <div>
                    <h4 className='text-sm font-medium text-gray-900 mb-4'>
                        Custom Domain
                    </h4>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                        <div className='lg:col-span-2'>
                            <EditableTextField
                                id='customDomain'
                                label='Custom Domain'
                                control={control}
                                editingField={editingField}
                                setEditingField={setEditingField}
                                onSaveField={handleSaveField}
                                isSaving={isSaving}
                                validationRules={
                                    formValidationRules.customDomain
                                }
                                resetField={resetField}
                                placeholder='yourdomain.com'
                            />
                        </div>
                        <div className='lg:col-span-2'>
                            <div className='p-4 bg-blue-50 border border-blue-200 rounded-md'>
                                <p className='text-sm text-blue-800'>
                                    <strong>SSL Certificate:</strong> Active and
                                    valid
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                <div>
                    <h4 className='text-sm font-medium text-gray-900 mb-4'>
                        URL Redirects
                    </h4>
                    <div className='grid grid-cols-1 gap-x-8'>
                        <EditableTextAreaField
                            id='redirectRules'
                            label='301 Redirect Rules'
                            control={control}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            validationRules={formValidationRules.redirectRules}
                            resetField={resetField}
                            placeholder='/old-page -> /new-page&#10;/another-old -> /another-new'
                            rows={6}
                        />
                    </div>
                </div>

                <Separator />

                <div>
                    <h4 className='text-sm font-medium text-gray-900 mb-4'>
                        Subdomains
                    </h4>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                        <EditableTextField
                            id='blogSubdomain'
                            label='Blog Subdomain'
                            control={control}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            validationRules={formValidationRules.subdomain}
                            resetField={resetField}
                            placeholder='blog.yourdomain.com'
                        />
                        <EditableTextField
                            id='apiSubdomain'
                            label='API Subdomain'
                            control={control}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            validationRules={formValidationRules.subdomain}
                            resetField={resetField}
                            placeholder='api.yourdomain.com'
                        />
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

export default DomainSettings;
