'use client';
import {
    createBlog,
    getBlogById,
    updateBlog,
} from '@/app/_actions/blogs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import MainFormSection from './components/main-form-input';
import { BlogSeoForm } from './components/seo-configuration';
import FormSidebar from './components/sidebar';

export default function PostCreationPage() {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dataToEdit, setDataToEdit] = useState(null);
    const router = useRouter();
    const params = useSearchParams();
    const blogId = params.get('id');
    const mode = params.get('mode');

    const form = useForm({
        defaultValues: {
            title: '',
            content: '',
            category: ['uncategorized'],
            mainImage: null,
            tags: [],
            status: 'draft',
            seo: {
                title: '',
                description: '',
                focusKeyword: '',
                canonical: '',
                ogTitle: '',
                ogDescription: '',
                ogImage: null,
                twitterTitle: '',
                twitterDescription: '',
                twitterCard: 'summary_large_image',
                robots: 'index,follow',
                schemaType: 'Article',
            },
        },
    });
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
        setValue,
    } = form;

    useEffect(() => {
        if (mode === 'update' && blogId) {
            async function getBlogData() {
                try {
                    setLoading(true);
                    const data = await getBlogById(blogId);
                    console.log(`blogdata`, data);

                    setLoading(false);
                    if (data?.success) {
                        setDataToEdit(data?.result?.data);
                        form.reset(data?.result?.data);
                        form.setValue('category', data?.result?.data?.category);
                        form.setValue('tags', data?.result?.data?.tags);
                        setTags(data?.result?.data?.tags);
                        setTimeout(() => { }, 0);
                    } else {
                        toast.error('Failed to load blog data for editing');
                    }
                } catch (error) {
                    toast.error(
                        'There was an error while fetching data to edit'
                    );
                }
            }
            getBlogData();
        }
    }, [mode, form, blogId]);

    const onSaveDraft = async () => {
        const formData = {
            title: watch('title'),
            content: watch('content'),
            category: watch('category'),
            mainImage: watch('mainImage'),
            tags,
            status: 'DRAFT',
            seo: watch('seo'),
        };

        try {
            if (mode !== 'update') {
                const res = await createBlog(formData);
                console.log('Blog Created:', res);

                toast.success('Blog Saved successfully');
            } else {
                const res = await updateBlog(blogId, formData);
                console.log('Blog Updated:', res);

                toast.success('Blog Updated successfully');
            }
        } catch (error) {
            throw error;
        }
    };

    const onSubmit = async data => {
        const formData = {
            ...data,
            tags,
            status: 'PUBLISHED',
        };
        try {
            if (mode !== 'update') {
                const res = await createBlog(formData);
                toast.success('Blog created successfully');
            } else {
                const res = await updateBlog(blogId, formData);
                toast.success('Blog Updated successfully');
            }
            router.push(`/admin/dashboard/blogs`);
        } catch (error) {
            throw error;
        }
    };

    return (
        <div className='min-h-screen'>
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className=''>
                        {/* Header */}
                        <div className='flex mb-5 items-center justify-between'>
                            <div className='space-y-1'>
                                <h1 className='text-2xl font-semibold tracking-tight'>
                                    {mode === 'update'
                                        ? 'Update'
                                        : 'Create New'}{' '}
                                    Post
                                </h1>
                                <p className='text-sm text-muted-foreground'>
                                    Share your travel stories and experiences
                                    with the world
                                </p>
                            </div>
                        </div>
                        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
                            {/* Main Content Area */}
                            <div className='lg:col-span-3 flex flex-col space-y-6'>
                                <MainFormSection mode={mode} />
                                <BlogSeoForm />
                            </div>
                            {/* Sidebar */}
                            <FormSidebar
                                onSaveDraft={onSaveDraft}
                                tags={tags}
                                setTags={setTags}
                                mode={mode}
                            />
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}

