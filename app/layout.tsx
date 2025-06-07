import { Provider } from '@/components/ui/provider';
import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import { ReactNode } from 'react';

const poppins = Poppins({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    subsets: ['latin'],
    variable: '--font-poppins',
    display: 'swap'
});

export const viewport: Viewport = {
    colorScheme: 'dark',
    themeColor: '#2ECC71'
};

export const metadata: Metadata = {
    title: 'HackCode',
    description:
        'HackCode is a modern coding education platform to learn by building. Explore real-world challenges, interactive lessons, and guided paths.',
    keywords: [
        'HackCode',
        'coding',
        'learn programming',
        'interactive coding',
        'students',
        'school',
        'college',
        'education',
        'programming',
        'software development'
    ],
    authors: [{ name: 'Argon', url: 'https://www.linkedin.com/company/argonteam' }],
    creator: 'HackCode',
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/apple-touch-icon.png'
    },
    openGraph: {
        title: 'HackCode – Learn to Code by Doing',
        description: 'Master coding through hands-on projects and challenges. Built for learners and educators alike.',
        url: 'https://www.hack-code.net',
        siteName: 'HackCode',
        images: [
            {
                url: '/og-image.png',
                width: 1920,
                height: 879,
                alt: 'HackCode – Learn to Code by Doing'
            }
        ],
        type: 'website',
        locale: 'en_US'
    },
    metadataBase: new URL('https://www.hack-code.net')
};

export default function RootLayout({ children }: { readonly children: ReactNode }) {
    return (
        <html lang='en' suppressHydrationWarning style={{ background: '#1C1C1C' }}>
            <body className={`${poppins.variable} font-sans antialiased`}>
                <Provider>{children}</Provider>
            </body>
        </html>
    );
}
