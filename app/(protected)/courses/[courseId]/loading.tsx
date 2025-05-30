import { Box, Flex, Heading, Progress, Stack, Highlight, Skeleton, SkeletonText } from '@chakra-ui/react';
import Image from 'next/image';

export default function Loading() {
    const rows = Array(3).fill(null);

    return (
        <Box>
            <Flex
                as='header'
                align='center'
                justify='space-between'
                borderBottom='1px solid'
                borderColor='gray.700'
                py={4}
                px={8}
            >
                <Flex gap={3} align='center'>
                    <Skeleton>
                        <Image src='/python-icon.svg' width={24} height={24} alt='python' />
                    </Skeleton>
                    <SkeletonText noOfLines={1} width='120px' />
                </Flex>
                <Box>
                    <Progress.Root size='md' w='279px' colorPalette='green'>
                        <Progress.Track bg='#3A3A3A' borderRadius='full'>
                            <Progress.Range />
                        </Progress.Track>
                    </Progress.Root>
                    <Stack direction='row' justify='space-between' pt={1}>
                        <SkeletonText noOfLines={1} width='60px' />
                        <SkeletonText noOfLines={1} width='40px' />
                    </Stack>
                </Box>
            </Flex>
            <Heading pt={10} fontSize='100px' fontWeight={600} textAlign='center'>
                <Highlight styles={{ px: '0.5', bg: 'green.subtle', color: 'green.300' }} query='Knowledge'>
                    Knowledge map
                </Highlight>
            </Heading>
            <Stack maxW='985px' m='0 auto' pt={24}>
                {rows.map((_, rowIndex) => (
                    <Box key={`row-${rowIndex}`}>
                        <Stack direction='row' justify={rowIndex % 2 === 0 ? 'flex-start' : 'flex-end'} mb={2} gap={8}>
                            {[0, 1, 2].map((sectionIndex) => (
                                <Flex key={`section-${sectionIndex}`} align='center'>
                                    {sectionIndex > 0 && (
                                        <Skeleton>
                                            <Image
                                                src={rowIndex % 2 === 0 ? '/arrow-right.svg' : '/arrow-left.svg'}
                                                alt='arrow'
                                                width={70}
                                                height={12}
                                            />
                                        </Skeleton>
                                    )}
                                    <Skeleton height='140px' width='260px' borderRadius='xl' color='gray.600' />
                                </Flex>
                            ))}
                        </Stack>
                        {rowIndex < rows.length - 1 && (
                            <Flex
                                justifyContent={rowIndex % 2 === 0 ? 'flex-end' : 'flex-start'}
                                pr={rowIndex % 2 === 0 ? '130px' : '0'}
                                pl={rowIndex % 2 === 0 ? '0' : '130px'}
                                pb={2}
                            >
                                <Skeleton>
                                    <Image src='/arrow-down.svg' alt='arrow down' width={12} height={70} />
                                </Skeleton>
                            </Flex>
                        )}
                    </Box>
                ))}
            </Stack>
        </Box>
    );
}
