import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FaGithub, FaTwitter } from 'react-icons/fa';
import InstagramIcon from '../svg/instagram-icon';
import LinkedinIcon from '../svg/linkedin-icon';

function SocialLinks() {
    return (
        <div className='flex space-x-4'>
            <Button variant='icon' size='icon'>
                <Link href='https://twitter.com/tripwheel' target='_blank'>
                    <FaTwitter />
                </Link>
            </Button>
            <Button variant='icon' size='icon'>
                <Link href='https://github.com/tripwheel' target='_blank'>
                    <FaGithub />
                </Link>
            </Button>
            <Button variant='icon' size='icon'>
                <Link href='https://linkedin.com/tripwheel' target='_blank'>
                    <LinkedinIcon />
                </Link>
            </Button>
            <Button variant='icon' size='icon'>
                <Link href='https://instagram.com/tripwheel' target='_blank'>
                    <InstagramIcon />
                </Link>
            </Button>
        </div>
    );
}

export default SocialLinks;

