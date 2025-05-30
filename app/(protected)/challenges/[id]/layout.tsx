import { Subheader } from '@/components/layout/subheader/supheader';
import { ReactNode } from 'react';

interface LayoutProps {
    readonly children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
    return (
        <>
            <Subheader path={`/challenges`} backLabel='Back to challenges' />
            {children}
        </>
    );
}
