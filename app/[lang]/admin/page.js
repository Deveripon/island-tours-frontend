import { auth } from '@/auth';
import Content from './components/content';
import VideoBackground from './components/video-background';

const HomePage = async () => {
    const session = await auth();
    console.log(session);

    return (
        <VideoBackground
            overlay={true}
            overlayStyles='absolute inset-0  z-10 pointer-events-none
            bg-gradient-to-br from-black/0  to-black'
            video='/video.mp4'>
            <Content />
        </VideoBackground>
    );
};

export default HomePage;

