import { Subheader } from '@/components/layout/subheader/supheader';
import { Stack } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface LayoutProps {
    readonly params: Promise<{ courseId: string }>;
    readonly children: ReactNode;
}

export default async function Layout({ params, children }: LayoutProps) {
    const { courseId } = await params;

    return (
        <Stack>
            <Subheader path={`/courses/${courseId}`} backLabel='Back' />
            {children}
        </Stack>
    );
}
