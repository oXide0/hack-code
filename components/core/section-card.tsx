import { Badge, Box, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface SectionCardProps {
    readonly isActive: boolean;
    readonly title: string;
    readonly description: string;
    readonly footer: ReactNode;
    readonly linkPath: string;
}

export function SectionCard(props: SectionCardProps) {
    return (
        <Link href={props.linkPath}>
            {/* <Text
                bgGradient='linear(to-t, #2ECC71, #0C710C)'
                bgClip='text'
                fontSize='2xl'
                fontWeight='semibold'
                textTransform='uppercase'
                color='white'
            >
                {props.title}
            </Text> */}

            <Box
                bg='#232323'
                borderRadius='2xl'
                px={3}
                py={4}
                maxW='270px'
                minW='270px'
                h='167px'
                display='flex'
                flexDirection='column'
                position='relative'
                borderWidth='1px'
                borderColor={props.isActive ? 'green.300' : 'gray.700'}
                _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                    transition: 'all 0.2s ease'
                }}
            >
                {props.isActive && (
                    <Badge colorPalette='green' position='absolute' top='-3' right='4' px={2} py={1}>
                        Learn next
                    </Badge>
                )}

                <Text flex='1' my={2}>
                    {props.title}
                </Text>

                <Box mt='auto'>{props.footer}</Box>
            </Box>
        </Link>
    );
}
