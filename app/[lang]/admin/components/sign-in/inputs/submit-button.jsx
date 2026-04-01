import { Button } from '@/components/ui/button';

const SubmitButton = ({ formType, isLoading }) => {
    return (
        <Button
            disabled={isLoading}
            className='w-full cursor-pointer px-5 py-[1.5vh] h-[6vh] min-h-[48px] max-h-[60px] rounded-full bg-emerald-400 font-semibold text-[0D0E13] border border-emerald-400 text-[clamp(16px,2.2vh,18px)] leading-[1.5] tracking-[-0.36px] hover:bg-emerald-500 transition-all'
            type='submit'>
            {isLoading && (
                <svg
                    className='animate-spin mr-3 h-5 w-5 text-white inline-block'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'>
                    <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'></circle>
                    <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                </svg>
            )}
            {formType === 'login' ? 'Log in' : 'Send Instructions'}
        </Button>
    );
};

export default SubmitButton;

