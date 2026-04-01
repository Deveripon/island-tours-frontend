import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TradeUpIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { EditableSelectField } from '../../../../(user)/profile/components/editable-select-field';
import { EditableTextField } from '../../../../(user)/profile/components/editable-text-field';
import { EditableTextAreaField } from '../../../../(user)/profile/components/editable-textarea-filed';

const AdvancedSeo = ({
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
                <HugeiconsIcon icon={TradeUpIcon} size={20} />
                Advanced SEO
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className='space-y-6'>
                <div>
                    <h4 className='text-sm font-medium text-gray-900 mb-4'>
                        Analytics & Tracking
                    </h4>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                        <EditableTextField
                            id='googleAnalyticsId'
                            label='Google Analytics ID'
                            control={control}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            validationRules={
                                formValidationRules.googleAnalyticsId
                            }
                            resetField={resetField}
                            placeholder='G-XXXXXXXXXX'
                        />
                        <EditableTextField
                            id='googleTagManagerId'
                            label='Google Tag Manager ID'
                            control={control}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            validationRules={
                                formValidationRules.googleTagManagerId
                            }
                            resetField={resetField}
                            placeholder='GTM-XXXXXXX'
                        />
                        <EditableTextField
                            id='googleSearchConsole'
                            label='Search Console Verification'
                            control={control}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            validationRules={
                                formValidationRules.googleSearchConsole
                            }
                            resetField={resetField}
                            placeholder='Verification meta tag content'
                        />
                        <EditableTextField
                            id='facebookPixelId'
                            label='Facebook Pixel ID'
                            control={control}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            validationRules={
                                formValidationRules.facebookPixelId
                            }
                            resetField={resetField}
                            placeholder='Facebook Pixel ID'
                        />
                    </div>
                </div>

                <Separator />

                <div>
                    <h4 className='text-sm font-medium text-gray-900 mb-4'>
                        Structured Data
                    </h4>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                        <EditableSelectField
                            id='schemaType'
                            label='Organization Schema'
                            control={control}
                            options={[
                                { label: 'Disabled', value: 'disabled' },
                                {
                                    label: 'Organization',
                                    value: 'organization',
                                },
                                {
                                    label: 'Local Business',
                                    value: 'local_business',
                                },
                                {
                                    label: 'Travel Agency',
                                    value: 'travel_agency',
                                },
                            ]}
                            editingField={editingField}
                            setEditingField={setEditingField}
                            onSaveField={handleSaveField}
                            isSaving={isSaving}
                            resetField={resetField}
                        />
                        <div className='lg:col-span-2'>
                            <EditableTextAreaField
                                id='customSchema'
                                label='Custom Schema JSON-LD'
                                control={control}
                                editingField={editingField}
                                setEditingField={setEditingField}
                                onSaveField={handleSaveField}
                                isSaving={isSaving}
                                validationRules={
                                    formValidationRules.customSchema
                                }
                                resetField={resetField}
                                placeholder='Add custom JSON-LD structured data'
                                rows={12}
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                <div>
                    <h4 className='text-sm font-medium text-gray-900 mb-4'>
                        Sitemap & Robots
                    </h4>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8'>
                        <EditableSelectField
                            id='autoGenerateSitemap'
                            label='Auto-Generate Sitemap'
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
                        <div className='lg:col-span-2'>
                            <EditableTextAreaField
                                id='robotsTxt'
                                label='Custom Robots.txt Rules'
                                control={control}
                                editingField={editingField}
                                setEditingField={setEditingField}
                                onSaveField={handleSaveField}
                                isSaving={isSaving}
                                validationRules={formValidationRules.robotsTxt}
                                resetField={resetField}
                                placeholder='Add custom robots.txt directives'
                                rows={12}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

export default AdvancedSeo;
