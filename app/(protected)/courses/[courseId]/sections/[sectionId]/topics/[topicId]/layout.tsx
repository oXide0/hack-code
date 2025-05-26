import { Subheader } from '@/components/layout/subheader/supheader';
import { Stack } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface LayoutProps {
    readonly params: Promise<{ courseId: string; sectionId: string }>;
    readonly children: ReactNode;
}

export default async function Layout({ params, children }: LayoutProps) {
    const { courseId, sectionId } = await params;

    return (
        <Stack>
            <Subheader path={`/courses/${courseId}/sections/${sectionId}`} backLabel='Back' />
            {children}
        </Stack>
    );
}
