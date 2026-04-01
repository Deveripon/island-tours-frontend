'use client';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import AiObjectDataGenerator from './ai-object-data-generator';

const GenerateWithAiButton = ({ className, onTripGenerated, ...props }) => {
    const [open, setIsOpen] = useState(false);
    return (
        <div className='relative'>
            <Button
                type='button'
                variant='outline'
                {...props}
                onClick={() => setIsOpen(!open)}
                className={`w-fit px-4 py-2  text-primary hover:text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-300 ${className}`}>
                <Sparkles className='w-4 h-4 mr-2' />
                {open ? 'Close' : ' Generate with AI'}
            </Button>

            <AiObjectDataGenerator
                open={open}
                onOpenChange={setIsOpen}
                setTripData={onTripGenerated}
                className={`z-50 absolute top-0  w-full h-fit ${
                    open ? '' : 'hidden'
                }`}
            />  
        </div>
    );
};

export default GenerateWithAiButton;

