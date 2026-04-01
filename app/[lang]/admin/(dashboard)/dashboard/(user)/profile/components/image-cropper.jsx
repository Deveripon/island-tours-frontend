'use client';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { getCroppedImg } from '@/utils/crop-utils';
import { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';

const ImageCropper = ({ open, imageSrc, onClose, onCropComplete }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [aspect, setAspect] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const handleClose = () => {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        onClose();
    };

    const onCropCompleteHandler = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleCrop = async () => {
        if (!imageSrc || !croppedAreaPixels) {
            handleClose();
            return;
        }

        try {
            const { file, blobUrl } = await getCroppedImg(
                imageSrc,
                croppedAreaPixels
            );

            if (file && blobUrl) {
                onCropComplete(file, blobUrl);
            }
        } catch (error) {
            handleClose();
        }
    };

    if (!open || !imageSrc) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className='max-w-4xl bg-card border-border'>
                <DialogHeader>
                    <DialogTitle className='text-foreground'>
                        Crop Your Image
                    </DialogTitle>
                </DialogHeader>

                <div className='relative w-full h-[500px] bg-background border border-border rounded-lg overflow-hidden'>
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropCompleteHandler}
                    />
                </div>

                <div className='space-y-4 mt-6'>
                    <label className='text-sm font-semibold text-foreground'>
                        Zoom Level
                    </label>
                    <Slider
                        min={1}
                        max={3}
                        step={0.1}
                        value={[zoom]}
                        onValueChange={([z]) => setZoom(z)}
                        className='w-full'
                    />
                    <p className='text-xs text-muted-foreground'>
                        Current zoom: {zoom.toFixed(1)}x
                    </p>
                </div>

                <DialogFooter className='mt-8 gap-2'>
                    <Button
                        onClick={handleClose}
                        variant='outline'
                        className='border-border hover:bg-muted'>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCrop}
                        className='bg-primary hover:bg-primary/90 text-primary-foreground'>
                        Crop & Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ImageCropper;

