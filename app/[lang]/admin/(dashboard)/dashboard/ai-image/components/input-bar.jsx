import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Loader2, Paperclip, SendHorizonal, X } from 'lucide-react';
import Image from 'next/image';

const InputBar = ({
    prompt,
    setPrompt,
    generateImage,
    status,
    attachments,
    removeAttachment,
    fileInputRef,
    handleFileChange,
    aspectRatio,
    setAspectRatio }) => {
    return (
        <div className='relative z-30 w-full max-w-4xl mx-auto px-4 pb-4 bg-card'>
            <div className='bg-card border border-white/10 rounded-xl p-2 flex flex-col gap-2 transition-colors focus-within:border-white/20 shadow-lg backdrop-blur-md bg-opacity-95'>
                {/* MULTIPLE PREVIEW ATTACHMENTS */}
                {attachments.length > 0 && (
                    <div className='flex flex-wrap gap-2 ml-2 mt-2'>
                        {attachments.map((img, index) => (
                            <div
                                key={index}
                                className='relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 group'>
                                <Image
                                    src={img}
                                    className='w-full h-full object-cover'
                                    alt='ref'
                                    width={100}
                                    height={100}
                                />
                                <button
                                    onClick={() => removeAttachment(index)}
                                    className='absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80'>
                                    <X className='w-3 h-3' />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className='flex flex-col items-center gap-2 px-2'>
                    <Input
                        placeholder='Describe your image'
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && generateImage()}
                        className='h-12 resize-none overflow-hidden outline-0 !bg-transparent border-none text-base text-white placeholder:text-neutral-500 focus-within:outline-0 focus-visible:ring-0 px-2 shadow-none w-full'
                    />

                    <div className='flex items-center justify-between w-full gap-2 pt-2 '>
                        <div className='flex items-center'>
                            <Paperclip
                                className='w-5 h-5 text-neutral-400 hover:text-white cursor-pointer transition-colors shrink-0'
                                onClick={() => fileInputRef.current?.click()}
                            />
                            <input
                                type='file'
                                multiple
                                ref={fileInputRef}
                                className='hidden'
                                onChange={handleFileChange}
                                accept='image/*'
                            />
                        </div>

                        {/* Actions Right */}
                        <div className='flex items-center gap-2'>
                            <Select
                                value={aspectRatio}
                                onValueChange={setAspectRatio}>
                                <SelectTrigger className='w-[100px] sm:w-[120px] h-9 !bg-transparent border-none text-xs text-neutral-400 hover:text-white focus:ring-0'>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className='bg-[#1a1a1a] border-white/10 text-white'>
                                    <SelectItem value='1:1'>
                                        Square (1:1)
                                    </SelectItem>
                                    <SelectItem value='16:9'>
                                        Wide (16:9)
                                    </SelectItem>
                                    <SelectItem value='9:16'>
                                        Tall (9:16)
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                onClick={generateImage}
                                disabled={
                                    status === 'generating' || !prompt.trim()
                                }
                                size='icon'
                                className={cn(
                                    'h-10 w-10 rounded-full cursor-pointer place-content-center transition-all',
                                    prompt.trim()
                                        ? 'bg-primary text-white hover:bg-primary/80'
                                        : 'bg-white/10 text-white/20'
                                )}>
                                {status === 'generating' ? (
                                    <Loader2 className='w-4 h-4 animate-spin' />
                                ) : (
                                    <SendHorizonal className='w-4 h-4' />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <p className='text-[10px] text-center text-white/20 mt-2 font-medium hidden sm:block'>
                AI may display inaccurate info, including about people, so
                double-check its responses.
            </p>
        </div>
    );
};

export default InputBar;

