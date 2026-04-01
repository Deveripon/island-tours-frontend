'use client';

import { uploadMultipleImage } from '@/app/_actions/imagesActions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, RotateCcw, Sparkles, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

const ShimmerEffect = () => (
    <div className='absolute inset-0 z-30 flex flex-col items-center justify-center overflow-hidden rounded-lg bg-black/50 backdrop-blur-sm'>
        <motion.div
            className='absolute inset-0'
            animate={{
                background: [
                    'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
                    'radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
                    'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
                    'radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
                    'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
                ],
            }}
            transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'linear',
            }}
        />
        <div className='relative flex flex-col items-center space-y-3 z-10'>
            <div className='relative'>
                <motion.div
                    className='absolute -inset-4 bg-blue-500/20 blur-[20px] rounded-full'
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 0.7, 0.4],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                <Sparkles className='w-6 h-6 text-blue-400 animate-pulse' />
            </div>
            <p className='text-xs text-white/80 font-medium animate-pulse'>
                Generating...
            </p>
        </div>
    </div>
);

export default function GenerateImage({
    onImageSelected,
    multiple = false,
    currentImages = [],
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, generating, uploading, completed

    const generateImage = async () => {
        if (!prompt.trim()) return;
        setStatus('generating');
        setImageUrl(null);

        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    aspectRatio: '1:1',
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setImageUrl(data.url);
            setStatus('idle');
        } catch (err) {
            toast.error(err.message || 'Failed to generate image');
            setStatus('idle');
        }
    };

    const handleUseImage = async () => {
        if (!imageUrl) return;
        setStatus('uploading');

        try {
            // Convert URL to File
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File(
                [blob],
                `generated-ai-image-${Date.now()}.png`,
                { type: 'image/png' }
            );

            // Upload via uploadMultipleImage to get the consistent response structure with UUID
            const result = await uploadMultipleImage([file], {
                folder: 'ai-generated',
                tags: ['ai-generated', 'form-asset'],
            });

            // Extract from uploadedMediaData as requested
            let uploadedImage;
            if (
                result.uploadedMediaData &&
                Array.isArray(result.uploadedMediaData) &&
                result.uploadedMediaData.length > 0
            ) {
                uploadedImage = result.uploadedMediaData[0];
            }

            if (!uploadedImage) {
                // Fallback or error
                console.error('Unexpected response format', result);
                throw new Error('Upload failed: No media data received');
            }

            // Construct DTO compatible with ImageUploadWithSelector and backend
            const imageDto = {
                imageId: uploadedImage.id, // UUID from uploadedMediaData
                url: uploadedImage.url || uploadedImage.secure_url,
                thumbnail: uploadedImage.thumbnail || uploadedImage.url,
                fileName:
                    uploadedImage.originalName ||
                    uploadedImage.original_filename ||
                    file.name,
                width: uploadedImage.width,
                height: uploadedImage.height,
                format: uploadedImage.format,
                size: uploadedImage.size || uploadedImage.bytes || file.size,
                isUploaded: true,
            };

            if (multiple) {
                const current = Array.isArray(currentImages)
                    ? currentImages
                    : [];
                onImageSelected([...current, imageDto]);
            } else {
                onImageSelected(imageDto);
            }

            toast.success('Image generated and selected!');
            setIsOpen(false);
        } catch (e) {
            console.error('Image processing error:', e);
            toast.error(e.message || 'Failed to process image');
        } finally {
            setStatus('idle');
        }
    };

    return (
        <div className='relative inline-block'>
            <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(true);
                }}
                className={`gap-2 text-primary hover:text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-300 ${
                    isOpen
                        ? 'opacity-0 scale-95 pointer-events-none'
                        : 'opacity-100 scale-100'
                }`}>
                <Sparkles className='w-4 h-4' />
                Generate with AI
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.8,
                            x: 20,
                            y: -20,
                            filter: 'blur(10px)',
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            x: 0,
                            y: 0,
                            filter: 'blur(0px)',
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.8,
                            x: 20,
                            y: -20,
                            filter: 'blur(10px)',
                        }}
                        transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 300,
                            opacity: { duration: 0.2 },
                        }}
                        className='absolute right-0 top-0 z-[100] origin-top-right'
                        style={{ width: '640px' }}>
                        <div className='bg-popover border border-primary/10 shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-2xl overflow-hidden flex flex-col w-full'>
                            {/* Header */}
                            <div className='px-4 py-3 border-b border-primary/5 flex items-center justify-between bg-primary/5'>
                                <div className='flex items-center gap-2'>
                                    <div className='p-1.5 bg-primary/10 rounded-lg'>
                                        <Sparkles className='w-4 h-4' />
                                    </div>
                                    <div>
                                        <h3 className='text-sm font-semibold text-foreground'>
                                            AI Image Studio
                                        </h3>
                                        <p className='text-[10px] text-muted-foreground'>
                                            Create stunning visuals with AI
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    size='icon'
                                    className='h-8 w-8 hover:bg-primary/10 rounded-full transition-colors'
                                    onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setIsOpen(false);
                                    }}>
                                    <X className='w-4 h-4 text-muted-foreground' />
                                </Button>
                            </div>

                            <div className='p-4'>
                                {!imageUrl ? (
                                    <div className='space-y-4 relative'>
                                        {status === 'generating' && (
                                            <ShimmerEffect />
                                        )}
                                        <div className='relative group'>
                                            <Textarea
                                                placeholder='Describe the image you want in detail... e.g., "A serene tropical beach at sunset with turquoise water and palm trees, cinematic lighting, 4k"'
                                                value={prompt}
                                                onChange={e =>
                                                    setPrompt(e.target.value)
                                                }
                                                className='min-h-[120px] resize-none text-sm bg-muted/30 border-primary/5 
                                                placeholder:text-muted-foreground/50 text-foreground
                                                focus-visible:ring-primary/20 transition-all group-hover:bg-muted/50'
                                                disabled={
                                                    status === 'generating'
                                                }
                                            />
                                            <div className='absolute bottom-2 right-2 text-[10px] text-muted-foreground'>
                                                {prompt.length} characters
                                            </div>
                                        </div>

                                        <Button
                                            type='button'
                                            onClick={e => {
                                                e.preventDefault();
                                                generateImage();
                                            }}
                                            disabled={
                                                !prompt.trim() ||
                                                status === 'generating'
                                            }
                                            className='w-full h-11 text-sm font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]'>
                                            {status === 'generating' ? (
                                                <>
                                                    <Loader2 className='w-4 h-4 animate-spin mr-2' />
                                                    Crafting your masterpiece...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className='w-4 h-4 mr-2' />
                                                    Generate Image
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className='space-y-4'>
                                        <div className='relative aspect-video w-full rounded-xl overflow-hidden border border-primary/10 bg-muted group shadow-inner'>
                                            <Image
                                                src={imageUrl}
                                                alt='Generated'
                                                width={1000}
                                                height={1000}
                                                className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                                            />
                                            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                                        </div>

                                        <div className='flex gap-3'>
                                            <Button
                                                type='button'
                                                variant='outline'
                                                size='lg'
                                                disabled={
                                                    status === 'uploading'
                                                }
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setImageUrl(null);
                                                }}
                                                className='flex-1 h-11 text-sm border-primary/10 hover:bg-primary/5'>
                                                <RotateCcw className='w-4 h-4 mr-2' />
                                                Regenerate
                                            </Button>

                                            {multiple && (
                                                <Button
                                                    type='button'
                                                    variant='outline'
                                                    disabled={
                                                        status === 'uploading'
                                                    }
                                                    size='lg'
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        setImageUrl(null);
                                                        setPrompt('');
                                                    }}
                                                    className='flex-1 h-11 text-sm border-primary/10 hover:bg-primary/5'>
                                                    <Sparkles className='w-4 h-4' />
                                                    Create Another
                                                </Button>
                                            )}

                                            <Button
                                                type='button'
                                                size='lg'
                                                onClick={e => {
                                                    e.preventDefault();
                                                    handleUseImage();
                                                }}
                                                disabled={
                                                    status === 'uploading'
                                                }
                                                className='flex-[1.5] h-11 text-sm bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20'>
                                                {status === 'uploading' ? (
                                                    <>
                                                        <Loader2 className='w-4 h-4 animate-spin mr-2' />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check className='w-4 h-4 mr-2' />
                                                        Use This Image
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

