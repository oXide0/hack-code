import { Box, Button, Container, Flex, Heading, Text } from '@chakra-ui/react';
import { Check, ArrowUp } from 'lucide-react';

export default function Page() {
    return (
        <Container maxW='2xl' display='flex' flexDir='column' alignItems='center'>
            <Flex
                w='109px'
                h='109px'
                bg='#052E16'
                border='2px solid'
                borderColor='green.300'
                borderRadius='xl'
                justify='center'
                align='center'
            >
                <Check size={54} color='#10B981' />
            </Flex>
            <Heading size='2xl' pt={2}>
                Test passed
            </Heading>
            <Text color='gray.500' fontWeight='medium'>
                Hint used - 0
            </Text>
            <Text color='gray.500' fontWeight='medium'>
                Faults - 0
            </Text>
            <Flex flexDir='column' align='center' pt={7}>
                <Heading size='5xl'>3</Heading>
                <Flex gap={3}>
                    <Text fontWeight='semibold'>LEVEL UP</Text>
                    <ArrowUp />
                </Flex>
            </Flex>
            <Box w='full' pt={9}>
                <Flex justify='space-between' align='flex-end'>
                    <Box>
                        <Text color='gray.400'>Next Section</Text>
                        <Heading>Modules and packages</Heading>
                    </Box>
                    <Button>Continue</Button>
                </Flex>
            </Box>
        </Container>
    );
}
