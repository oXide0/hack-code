import { Box, Flex, Text } from '@chakra-ui/react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface SubheaderProps {
    readonly linkLabel?: string;
    readonly path: string;
    readonly centerItem?: ReactNode;
    readonly rightItem?: ReactNode;
    readonly isBorder?: boolean;
}

export function Subheader(props: SubheaderProps) {
    return (
        <Flex
            as='header'
            justify='space-between'
            align='center'
            pt={8}
            pb={5}
            borderBottom={props.isBorder ? '1px solid' : undefined}
            borderColor={props.isBorder ? 'gray.700' : undefined}
        >
            <Link href={props.path} passHref>
                <Flex align='center' gap={1} color='gray.400' _hover={{ color: 'white' }} cursor='pointer'>
                    <ChevronLeft size={18} />
                    <Text fontSize='sm'>{props.linkLabel ?? 'Back'}</Text>
                </Flex>
            </Link>

            <Box pl={10}>{props.centerItem}</Box>

            <Box>{props.rightItem}</Box>
        </Flex>
    );
}
