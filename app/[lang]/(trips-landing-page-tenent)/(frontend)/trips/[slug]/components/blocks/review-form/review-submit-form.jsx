'use client';
import { useAdmin } from '@/app/[lang]/(trips-landing-page-tenent)/hooks/useAdmin';
import { uploadMultipleImage } from '@/app/_actions/imagesActions/create/create';
import { createReview } from '@/app/_actions/reviewActions/create/create';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, Star, UploadCloud, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import SectionTitle from '../../section-title';
import { BlockEditWrapper } from '../common/block-edit-wrapper';
import { useBlockEditState } from '../context/block-edit-context';
import ReviewSubmitFormEdit from './review-submit-form-edit';

const ReviewSubmitForm = ({
    trip,
    data: blockData,
    id,
    isBlock = false,
}) => {
    const { mode, MODES, isAdmin } = useAdmin();
    const isEditMode = mode === MODES.edit;
    const { isEditing, setIsEditing, onUpdate } = useBlockEditState(id);

    const [formData, setFormData] = useState({
        rating: 5,
        title: '',
        reviewerName: '',
        reviewerEmail: '',
        content: '',
    });

    const [hoverRating, setHoverRating] = useState(0);
    const [files, setFiles] = useState([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        let timer;
        if (submitStatus.message) {
            timer = setTimeout(() => {
                setSubmitStatus({ type: '', message: '' });
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [submitStatus.message]);

    const handleFormChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const defaultData = {
        title: 'Submit a Review',
        submitText: 'Submit Review',
    };

    const initialData = {
        title: blockData?.title || defaultData.title,
        submitText: blockData?.submitText || defaultData.submitText,
    };

    const [editedData, setEditedData] = useState(initialData);

    const handleSave = () => {
        if (isBlock) {
            onUpdate({ ...blockData, ...editedData });
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditedData(initialData);
        setIsEditing(false);
    };

    const handleFileChange = e => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...selectedFiles]);
        }
    };

    const removeFile = index => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setSubmitStatus({ type: '', message: '' });

        const { rating, title, reviewerName, reviewerEmail, content } =
            formData;

        if (!reviewerEmail || !content || !reviewerName || !title || !rating) {
            setSubmitStatus({
                type: 'error',
                message: 'Please fill in all required fields.',
            });
            return;
        }

        if (!trip?.id) {
            setSubmitStatus({
                type: 'error',
                message: 'Trip details missing. Cannot submit review.',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            let uploadedImageUrls = [];

            if (files.length > 0) {
                setIsUploading(true);
                const uploadRes = await uploadMultipleImage(files, {
                    folder: `reviews`,
                    userId: 'anonymous',
                });
                setIsUploading(false);

                if (uploadRes.success) {
                    const getUrls = res => {
                        if (res.urls && Array.isArray(res.urls))
                            return res.urls;
                        if (res.data && Array.isArray(res.data)) {
                            if (typeof res.data[0] === 'string')
                                return res.data;
                            if (res.data[0]?.url)
                                return res.data.map(item => item.url);
                        }
                        if (Array.isArray(res)) {
                            if (typeof res[0] === 'string') return res;
                            if (res[0]?.url) return res.map(item => item.url);
                        }
                        return [];
                    };
                    uploadedImageUrls = getUrls(uploadRes);
                } else {
                    setSubmitStatus({
                        type: 'error',
                        message:
                            uploadRes.error?.message ||
                            'Failed to upload images.',
                    });
                    setIsSubmitting(false);
                    return;
                }
            }

            const reviewData = {
                tripId: trip.id,
                reviewerName,
                reviewerEmail,
                rating,
                title: title || undefined,
                content,
                images:
                    uploadedImageUrls.length > 0
                        ? uploadedImageUrls
                        : undefined,
            };

            const response = await createReview(reviewData);

            if (response.success) {
                setSubmitStatus({
                    type: 'success',
                    message:
                        'Review submitted successfully! It will be visible once approved.',
                });
                setFormData({
                    rating: 5,
                    title: '',
                    reviewerName: '',
                    reviewerEmail: '',
                    content: '',
                });
                setFiles([]);
            } else {
                setSubmitStatus({
                    type: 'error',
                    message:
                        response.error?.message ||
                        response.error ||
                        'Failed to submit review.',
                });
            }
        } catch (error) {
            console.error('Submit review error:', error);
            setSubmitStatus({
                type: 'error',
                message: 'An unexpected error occurred.',
            });
        } finally {
            setIsUploading(false);
            setIsSubmitting(false);
        }
    };

    return (
        <BlockEditWrapper
            isEditMode={isEditMode}
            isAdmin={isAdmin}
            onEdit={() => setIsEditing(true)}>
            <div className='p-8 rounded-xl border border-border shadow-sm w-full mx-auto'>
                <SectionTitle className=''>{editedData.title}</SectionTitle>
                <form
                    className='grid grid-cols-1 md:grid-cols-2 gap-6'
                    onSubmit={handleSubmit}>
                    {/* Row 1: Rating & Title Input */}
                    <div className='flex items-center gap-3 h-12'>
                        <span className='font-medium text-sm text-foreground'>
                            Rating <span className='text-destructive'>*</span>
                        </span>
                        <div className='flex gap-1'>
                            {[1, 2, 3, 4, 5].map(star => {
                                const active =
                                    (hoverRating || formData.rating) >= star;
                                return (
                                    <button
                                        key={star}
                                        type='button'
                                        onClick={() =>
                                            setFormData(prev => ({
                                                ...prev,
                                                rating: star,
                                            }))
                                        }
                                        onMouseEnter={() =>
                                            setHoverRating(star)
                                        }
                                        onMouseLeave={() => setHoverRating(0)}
                                        className='focus:outline-none transition-transform hover:scale-110'>
                                        <Star
                                            className={cn(
                                                'w-5 h-5 transition-colors',
                                                active
                                                    ? 'fill-primary text-primary'
                                                    : 'text-muted-foreground/30 fill-transparent'
                                            )}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                        <span className='text-sm font-medium text-muted-foreground ml-1'>
                            {hoverRating || formData.rating}/5
                        </span>
                    </div>

                    <div>
                        <input
                            type='text'
                            placeholder='Review title (Required)'
                            name='title'
                            required
                            value={formData.title}
                            onChange={handleFormChange}
                            className='w-full h-12 rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
                        />
                    </div>

                    {/* Row 2: Name & Email Inputs */}
                    <div>
                        <input
                            type='text'
                            placeholder='Your name (Required)'
                            required
                            name='reviewerName'
                            value={formData.reviewerName}
                            onChange={handleFormChange}
                            className='w-full h-12 rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
                        />
                    </div>
                    <div>
                        <input
                            type='email'
                            placeholder='Your Mail (Required)'
                            required
                            name='reviewerEmail'
                            value={formData.reviewerEmail}
                            onChange={handleFormChange}
                            className='w-full h-12 rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
                        />
                    </div>

                    {/* Row 3: Textarea & File Upload */}
                    <div className='h-full'>
                        <textarea
                            placeholder='Write your review here... (Required)'
                            rows={5}
                            required
                            name='content'
                            value={formData.content}
                            onChange={handleFormChange}
                            className='w-full h-full min-h-[140px] rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none'
                        />
                    </div>

                    <div className='flex flex-col gap-3 h-full min-h-[140px]'>
                        <label className='flex-1 rounded-lg border-2 border-dashed border-border/60 hover:border-primary/50 bg-accent/5 hover:bg-primary/5 transition-all flex flex-col items-center justify-center cursor-pointer group min-h-[100px]'>
                            <UploadCloud className='w-7 h-7 mb-2 text-primary/50 group-hover:text-primary transition-colors' />
                            <span className='text-sm font-medium text-primary'>
                                Choose File(s)
                            </span>
                            <input
                                type='file'
                                multiple
                                accept='image/*'
                                onChange={handleFileChange}
                                className='hidden'
                            />
                        </label>
                        {files.length > 0 && (
                            <div className='flex flex-wrap gap-2 max-h-[80px] overflow-y-auto p-1'>
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className='relative w-12 h-12 rounded-md overflow-hidden border border-border group shrink-0'>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt='preview'
                                            className='object-cover w-full h-full'
                                        />
                                        <button
                                            type='button'
                                            onClick={() => removeFile(index)}
                                            className='absolute top-0 right-0 bg-red-500 text-white rounded-bl-md p-0.5 opacity-0 group-hover:opacity-100 transition-opacity'>
                                            <X className='w-3 h-3' />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Row 4: Submit Button & Form Status */}
                    <div className='md:col-span-2 pt-2 flex flex-col gap-4 text-left'>
                        {submitStatus.message && (
                            <div
                                className={cn(
                                    'p-3 rounded-lg text-sm flex items-start justify-between gap-3',
                                    submitStatus.type === 'error'
                                        ? 'bg-red-50 text-red-600 border border-red-200'
                                        : 'bg-green-50 text-green-600 border border-green-200'
                                )}>
                                <div className='mt-0.5'>
                                    {submitStatus.message}
                                </div>
                                <button
                                    type='button'
                                    onClick={() =>
                                        setSubmitStatus({
                                            type: '',
                                            message: '',
                                        })
                                    }
                                    className='p-0.5 hover:bg-black/5 rounded-md transition-colors'>
                                    <X className='w-4 h-4' />
                                </button>
                            </div>
                        )}
                        <Button
                            type='submit'
                            disabled={isSubmitting || isUploading}
                            className='h-12 px-8 w-max rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-lg shadow-primary/20 transition-all hover:translate-y-[-2px] disabled:opacity-70 disabled:hover:translate-y-0'>
                            {isUploading ? (
                                <>
                                    <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                                    Uploading Images...
                                </>
                            ) : isSubmitting ? (
                                <>
                                    <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                                    Submitting...
                                </>
                            ) : (
                                editedData.submitText
                            )}
                        </Button>
                    </div>
                </form>
            </div>

            <ReviewSubmitFormEdit
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                editedData={editedData}
                setEditedData={setEditedData}
                handleSave={handleSave}
                handleCancel={handleCancel}
            />
        </BlockEditWrapper>
    );
};

export default ReviewSubmitForm;

