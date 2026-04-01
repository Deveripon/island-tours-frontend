import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { ArrowDown01Icon, ArrowUp01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useState } from 'react';

import AddMoreButton from '@/app/[lang]/admin/(dashboard)/dashboard/components/common/add-more-button';
import CheckboxOptions from '@/app/[lang]/admin/(dashboard)/dashboard/components/common/checkbox-options';
import SelectOptions from '@/app/[lang]/admin/(dashboard)/dashboard/components/common/select-options';
import { getAllCategoriesOfTenant } from '@/app/_actions/trips/category';
import { tripPackageOptions } from '@/data/trip-options';
import { useRolePermission } from '@/hooks/useRolePermission';
import { getGroupedDataOfCategories } from '@/lib/utils';
import { Permission } from '@/RBAC.config';
import { useParams } from 'next/navigation';
import { useFormContext } from 'react-hook-form';

export function TourTypeForm() {
    const [categories, setCategories] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const hasCreatePermission = useRolePermission(Permission.CREATE_CATEGORY);
    const defaultOptions = tripPackageOptions;

    const { control } = useFormContext();
    const { tenant } = useParams();

    useEffect(() => {
        if (tenant) {
            async function fetchCategories() {
                const res = await getAllCategoriesOfTenant(tenant);
                if (res?.success) {
                    const groupedData = getGroupedDataOfCategories(
                        res?.result?.data
                    );
                    setCategories(groupedData);
                }
            }

            fetchCategories();
        }
    }, [tenant]);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <Card className='p-0'>
                <CollapsibleTrigger asChild>
                    <div className='flex items-center justify-between p-5 cursor-pointer hover:bg-muted/50 transition-colors'>
                        <CardTitle>Tour Type & Categories</CardTitle>
                        <div className='flex items-center gap-2'>
                            {hasCreatePermission && (
                                <AddMoreButton
                                    text=''
                                    ButtonText='Add More Types and Categories'
                                    goToUrl={`/${tenant}/dashboard/categories?open=true`}
                                    className='p-0 border-0 place-content-end'
                                />
                            )}

                            {isOpen ? (
                                <HugeiconsIcon
                                    icon={ArrowUp01Icon}
                                    className='h-4 w-4 text-muted-foreground'
                                />
                            ) : (
                                <HugeiconsIcon
                                    icon={ArrowDown01Icon}
                                    className='h-4 w-4 text-muted-foreground'
                                />
                            )}
                        </div>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent className='space-y-6 pb-6'>
                        <FormField
                            control={control}
                            name='tourCategory.tourTypes'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tour Types </FormLabel>
                                    <FormControl>
                                        <CheckboxOptions
                                            defaultData={
                                                defaultOptions.tourTypes || []
                                            }
                                            field={field}
                                            dataArray={categories?.TOUR_TYPE}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name='tourCategory.difficulty'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Difficulty Level</FormLabel>

                                    <SelectOptions
                                        defaultData={
                                            tripPackageOptions.difficultyLevels
                                        }
                                        field={field}
                                        dataArray={categories?.DIFFICULTY_LEVEL}
                                        placeholder='Select Difficulty Level'
                                        goToUrl={`/${tenant}/dashboard/categories?open=true`}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name='tourCategory.suitableFor'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Suitable For</FormLabel>
                                    <FormControl>
                                        <CheckboxOptions
                                            defaultData={
                                                defaultOptions.suitableFor
                                            }
                                            field={field}
                                            dataArray={categories?.SUITABLE_FOR}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name='tourCategory.tourStyle'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tour Style</FormLabel>
                                    <SelectOptions
                                        defaultData={
                                            tripPackageOptions.tourStyles
                                        }
                                        field={field}
                                        showAddMore={false}
                                        dataArray={categories?.TOUR_STYLE}
                                        placeholder='Select tour style'
                                        goToUrl={`/${tenant}/dashboard/categories?open=true`}
                                    />

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}

