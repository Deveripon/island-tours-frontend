import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const DemoOverlay = ({ onLoadDemo, onSelfEdit, isLoading, progress }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='py-20 md:py-44 px-6  flex border border-dashed border-white/10 rounded-lg flex-col items-center text-center'>
            <div className='space-y-4 mb-12'>
                <h2 className='text-3xl md:text-4xl text-white tracking-tight leading-[1.1]'>
                    {isLoading
                        ? 'Generating your tour...'
                        : 'Ready to build your'}{' '}
                    <br />
                    <span className='text-primary'>
                        {isLoading ? 'Designing Layout' : 'perfect trip page?'}
                    </span>
                </h2>
                <p className='text-gray-400 text-base md:text-lg font-normal max-w-md mx-auto'>
                    {isLoading
                        ? 'Please wait while we prepare the professional demo content for you.'
                        : 'Choose a starting point to begin designing your tour experience.'}
                </p>
            </div>

            <div className='w-full max-w-md'>
                <AnimatePresence mode='wait'>
                    {isLoading ? (
                        <motion.div
                            key='loading'
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className='space-y-4'>
                            <div className='flex justify-between items-end mb-2'>
                                <span className='text-[10px] text-primary'>
                                    Importing Components
                                </span>
                                <span className='text-xs font-bold text-white leading-none'>
                                    {Math.round(progress)}%
                                </span>
                            </div>
                            <Progress
                                value={progress}
                                className='h-2 bg-white/5'
                            />
                            <div className='flex items-center justify-center gap-2 text-white/20 mt-4'>
                                <Loader2 className='w-3 h-3 animate-spin' />
                                <span className='text-[10px] font-bold    '>
                                    Applying Styles...
                                </span>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key='buttons'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className='flex flex-col sm:flex-row gap-4 justify-center'>
                            <Button
                                onClick={onLoadDemo}
                                className='h-12 flex-1 text-white px-4 text-sm font-bold rounded-lg shadow-xl transition-all active:scale-98 group overflow-hidden relative'>
                                <span className='flex items-center gap-2'>
                                    Load Demo Content
                                </span>
                            </Button>

                            <Button
                                onClick={onSelfEdit}
                                variant='outline'
                                className='h-12 flex-1 px-4 text-sm font-bold hover:text-white rounded-2xl shadow-xl transition-all active:scale-98 group overflow-hidden relative'>
                                <span className='flex items-center gap-2'>
                                    Start From Scratch
                                </span>
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {!isLoading && (
                <p className='mt-8 text-[10px] text-white/30 '>
                    No technical skills required
                </p>
            )}
        </motion.div>
    );
};

export default DemoOverlay;

