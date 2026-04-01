import Link from 'next/link';

function FooterNavigation({ navigations }) {
    return (
        <div className='footer-navigation w-full flex gap-4'>
            <div>
                <ul className='space-y-1 flex flex-col gap-2 text-white'>
                    {navigations?.items.map((item, index) => (
                        <li key={index}>
                            <Link
                                href={item.url}
                                className='text-sm text-white hover:text-gray-300'>
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default FooterNavigation;

