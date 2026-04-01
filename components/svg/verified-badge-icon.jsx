const MetaVerifiedBadge = ({ size = 14 }) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'>
        <circle cx='12' cy='12' r='10' fill='#1877F2' />
        <path
            d='M8.5 12.5L11 15L15.5 9.5'
            stroke='white'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
    </svg>
);

export default MetaVerifiedBadge;

