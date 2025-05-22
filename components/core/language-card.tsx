import Link from 'next/link';
import { ProgrammingLanguage } from '@/app/(protected)/page';
import { Box, Flex, Text, Heading } from '@chakra-ui/react';

interface LangCardProps {
    language: ProgrammingLanguage;
}

export function LanguageCard({ language }: LangCardProps) {
    const enabledBorderColor = 'green.500';

    const disabledOpacity = 0.4;

    const cardContent = (
        <Flex
            direction='column'
            h='full'
            p={6}
            borderWidth='1px'
            borderColor={language.enabled ? enabledBorderColor : 'gray.500'}
            borderRadius='xl'
            bg='gray.700'
            boxShadow={`0 4px 6px ${language.enabled ? 'rgba(46, 204, 113, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`}
            textAlign='center'
            align='center'
            transition='all 0.3s'
            _hover={
                language.enabled
                    ? {
                          transform: 'scale(1.05)',
                          bg: 'green.500',
                          color: 'gray.800',
                          '& p': {
                              color: 'gray.800'
                          }
                      }
                    : {}
            }
        >
            <Text fontSize='4xl' mb={4}>
                {language.icon}
            </Text>
            <Heading as='h3' size='md' mb={1}>
                {language.name}
            </Heading>
            <Text color={language.enabled ? 'gray.300' : 'gray.500'}>{language.description}</Text>
        </Flex>
    );

    if (!language.enabled) {
        return (
            <Box opacity={disabledOpacity} cursor='not-allowed' aria-disabled tabIndex={-1} transition='all 0.3s'>
                {cardContent}
            </Box>
        );
    }

    return <Link href={`${language.slug}`}>{cardContent}</Link>;
}
