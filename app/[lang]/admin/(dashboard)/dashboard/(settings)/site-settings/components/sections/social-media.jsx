import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { EditableTextField } from '../../../../(user)/profile/components/editable-text-field';

const SocialMedia = ({
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
                <HugeiconsIcon icon={Link01Icon} size={20} />
                Social Media Settings
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className='space-y-6'>
                <div>
                    <h4 className='text-sm font-medium text-gray-900 mb-4'>
                        Social Media
                    </h4>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                        <EditableTextField
                            id='facebookUrl'
                            label='Facebook URL'
                            control={control}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            validationRules={formValidationRules.socialUrl}
                            resetField={resetField}
                            placeholder='https://facebook.com/yourpage'
                        />
                        <EditableTextField
                            id='twitterUrl'
                            label='Twitter/X URL'
                            control={control}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            validationRules={formValidationRules.socialUrl}
                            resetField={resetField}
                            placeholder='https://twitter.com/yourhandle'
                        />
                        <EditableTextField
                            id='linkedinUrl'
                            label='LinkedIn URL'
                            control={control}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            validationRules={formValidationRules.socialUrl}
                            resetField={resetField}
                            placeholder='https://linkedin.com/company/yourcompany'
                        />
                        <EditableTextField
                            id='instagramUrl'
                            label='Instagram URL'
                            control={control}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            validationRules={formValidationRules.socialUrl}
                            resetField={resetField}
                            placeholder='https://instagram.com/yourhandle'
                        />
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

export default SocialMedia;
