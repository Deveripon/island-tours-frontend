function Spinner() {
    return (
        <svg
            width={32}
            height={32}
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'>
            <style>
                {`@keyframes spinner_8HQG { 
            0%, 57.14% {
              animation-timing-function: cubic-bezier(.33,.66,.66,1);
              transform: translate(0);
            }
            28.57% {
              animation-timing-function: cubic-bezier(.33,0,.66,.33);
              transform: translateY(-6px);
            }
            to {
              transform: translate(0);
            }
          }
          .spinner_qM83 {
            animation: spinner_8HQG 1.05s infinite;
            fill: white;
          }`}
            </style>
            <circle className='spinner_qM83' cx={4} cy={12} r={3} />
            <circle
                className='spinner_qM83'
                cx={12}
                cy={12}
                r={3}
                style={{
                    animationDelay: ".1s",
                }}
            />
            <circle
                className='spinner_qM83'
                cx={20}
                cy={12}
                r={3}
                style={{
                    animationDelay: ".2s",
                }}
            />
        </svg>
    );
}

export default Spinner;

