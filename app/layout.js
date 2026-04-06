import { auth } from '@/auth';
import { Providers } from '@/provider/Providers';
import { DM_Sans, Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { Toaster } from 'sonner';
import './globals.css';
const inter = Inter({ subsets: ['latin'] });

const dmSans = DM_Sans({
    variable: '--font-dm-sans',
    subsets: ['latin'],
    weight: ['400', '500', '600', '700']
});

const nyghtSerif = localFont({
    variable: '--font-nyght-serif',
    src: [
        {
            path: './fonts/NyghtSerif-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: './fonts/NyghtSerif-RegularItalic.woff2',
            weight: '400',
            style: 'italic',
        },
    ]
});

const generalSans = localFont({
    variable: '--font-general-sans',
    src: [
        {
            path: './fonts/GeneralSans-Variable.woff2',
            style: 'normal',
        },
        {
            path: './fonts/GeneralSans-VariableItalic.woff2',
            style: 'italic',
        },
    ]
});

export default async function RootLayout({ children }) {
    const session = await auth();

    return (
        <html lang='en' suppressHydrationWarning={true}>
            <link rel='icon' href='/favicon.png' />

            <body
                className={`${inter.className} ${dmSans.variable} ${nyghtSerif.variable} ${generalSans.variable} antialiased`}
                suppressHydrationWarning={true}>
                <Providers session={session}>
                    {children}
                </Providers>
                <Toaster position="bottom-right" richColors />
                <script src="https://elfsightcdn.com/platform.js" async></script>
            </body>
        </html>
    );
}
