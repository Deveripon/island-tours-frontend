import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import { Mail02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const FormInput = ({
    field,
    type = 'text',
    icon = Mail02Icon,
    placeholder = '' }) => {
    return (
        <InputGroup className='h-[6vh] min-h-[48px] max-h-[60px] px-2 focus-within:ring-0 focus-within:ring-offset-0  rounded-full border border-[#0D0E13]/16  overflow-hidden bg-white transition-all'>
            <InputGroupInput
                {...field}
                type={type}
                className='text-[clamp(14px,2.5vh,16px)]! flex items-center justify-center font-normal placeholder:text-[#0D0E13]/70 bg-white ml-3 sm:ml-5 leading-[1.6] tracking-[-0.36px] autofill:bg-white autofill:shadow-[inset_0_0_0_1000px_white] autofill:[-webkit-text-fill-color:black]'
                placeholder={placeholder}
            />
            <InputGroupAddon>
                <div className='flex justify-center items-center h-full'>
                    <HugeiconsIcon
                        className='size-[clamp(20px,3vh,24px)] mr-3'
                        icon={icon}
                    />
                    <span className='h-[50%] w-px bg-black/16'></span>
                </div>
            </InputGroupAddon>
        </InputGroup>
    );
};

export default FormInput;

