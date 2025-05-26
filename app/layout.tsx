import { Provider } from '@/components/ui/provider';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { ReactNode } from 'react';

const poppins = Poppins({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    subsets: ['latin'],
    variable: '--font-poppins',
    display: 'swap'
});

export const metadata: Metadata = {
    title: 'HackCode'
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
