import { Subheader } from '@/components/layout/subheader/supheader';
import { Button } from '@chakra-ui/react';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface LayoutProps {
    readonly children: ReactNode;
    readonly params: Promise<{ id: string }>;
}

export default async function Layout(props: LayoutProps) {
    const params = await props.params;

    return (
        <>
            <Subheader
                path={`/challenges`}
                backLabel='Back to challenges'
                rightItem={
                    <Link href={`${params.id}/solutions`} passHref>
                        <Button colorPalette='green' size='sm'>
                            <CheckCircle2 /> See my solutions
                        </Button>
                    </Link>
                }
            />
            {props.children}
        </>
    );
}
