import { Button, Container, Flex, Heading, Text } from '@chakra-ui/react';
import { RefreshCcw, X } from 'lucide-react';

export default function Page() {
    return (
        <Container maxW='md' display='flex' flexDir='column' alignItems='center'>
            <Flex
                w='109px'
                h='109px'
                bg='gray.800'
                border='2px solid'
                borderColor='yellow.600'
                borderRadius='xl'
                justify='center'
                align='center'
            >
                <X size={54} color='#FDE047' />
            </Flex>
            <Heading size='2xl' pt={2}>
                Test failed
            </Heading>
            <Text color='gray.500' fontWeight='medium' textAlign='center'>
                Practice makes perfect. Let's learn from mistakes and try again.
            </Text>

            <Button mt={7}>
                Retry <RefreshCcw />
            </Button>
        </Container>
    );
}
