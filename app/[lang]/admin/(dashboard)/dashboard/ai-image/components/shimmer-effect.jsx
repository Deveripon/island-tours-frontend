import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const ShimmerEffect = () => (
    <div className='absolute inset-0 flex flex-col items-center justify-center rounded-2xl !overflow-hidden'>
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
        <div className='absolute inset-0 bg-neutral-950/20 backdrop-blur-[2px] rounded-2xl overflow-hidden' />

        <div className='relative flex flex-col items-center space-y-6 z-10'>
            <div className='relative'>
                <motion.div
                    className='absolute -inset-10 bg-blue-500/20 blur-[40px] rounded-full'
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 0.7, 0.4],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                <div className='relative bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-xl'>
                    <Sparkles className='w-10 h-10 text-blue-400 animate-pulse' />
                </div>
            </div>

            <div className='text-center space-y-2'>
                <motion.h3
                    className='text-white/80 font-medium text-xl tracking-tight'
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}>
                    Imagining your request...
                </motion.h3>
                <div className='flex items-center justify-center gap-2'>
                    <div className='h-1 w-1 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]' />
                    <div className='h-1 w-1 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.15s]' />
                    <div className='h-1 w-1 rounded-full bg-blue-500 animate-bounce' />
                </div>
            </div>
        </div>

        {/* Animated line shimmer */}
        <motion.div
            className='absolute inset-0 z-20 pointer-events-none'
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
            style={{
                background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
            }}
        />
    </div>
);

export default ShimmerEffect;

