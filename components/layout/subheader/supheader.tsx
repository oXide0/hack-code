import { Box, Flex, Separator, Text } from '@chakra-ui/react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface SubheaderProps {
    readonly backLabel?: string;
    readonly path: string;
    readonly centerItem?: ReactNode;
    readonly rightItem?: ReactNode;
    readonly isSeparator?: boolean;
}

export function Subheader(props: SubheaderProps) {
    return (
        <Flex gap={4} py={7} w='full' direction='column'>
            <Flex justify='space-between' align='center'>
                <Link href={props.path} passHref>
                    <Flex align='center' gap={1} color='gray.400' _hover={{ color: 'white' }} cursor='pointer'>
                        <ChevronLeft size={18} />
                        <Text fontSize='sm'>{props.backLabel ?? 'Back'}</Text>
                    </Flex>
                </Link>

                <Box pl={10}>{props.centerItem}</Box>

                {props.rightItem}
            </Flex>
            {props.isSeparator && <Separator borderColor='gray.700' size='md' />}
        </Flex>
    );
}
