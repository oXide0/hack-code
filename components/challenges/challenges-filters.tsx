'use client';

import { DIFFICULTY_OPTIONS } from '@/lib/utils';
import {
    Button,
    Card,
    createListCollection,
    Field,
    Heading,
    Input,
    InputGroup,
    Portal,
    Select,
    Stack
} from '@chakra-ui/react';
import { Role } from '@prisma/client';
import { Plus, Search as SearchIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export function ChallengesFilters({ role }: { role: Role }) {
    const searchParams = useSearchParams();
    const { replace, push } = useRouter();
    const pathname = usePathname();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    const handleDifficulty = (difficulty: string) => {
        const params = new URLSearchParams(searchParams);
        if (difficulty) {
            params.set('difficulty', difficulty);
        } else {
            params.delete('difficulty');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const selectedDifficulty = searchParams.get('difficulty') || '';

    const difficulties = createListCollection({
        items: DIFFICULTY_OPTIONS
    });

    return (
        <Card.Root
            p={6}
            borderRadius='xl'
            bg='gray.800'
            maxW='sm'
            mx='auto'
            borderWidth='1px'
            borderColor='gray.700'
            w='full'
            h='calc(100vh - 112px)'
            position='fixed'
            zIndex='1'
            display='flex'
            flexDirection='column'
        >
            <Heading fontSize='2xl' mb={6}>
                Filters
            </Heading>

            <Stack flex='1 1 auto'>
                <Field.Root mb={5}>
                    <Field.Label fontWeight='semibold' color='gray.200' mb={1}>
                        Search
                    </Field.Label>
                    <InputGroup flex='1' startElement={<SearchIcon size={18} />}>
                        <Input
                            placeholder='Search challenges...'
                            defaultValue={searchParams.get('query') || ''}
                            onChange={(e) => handleSearch(e.target.value)}
                            aria-label='Search challenges'
                            borderRadius='lg'
                            bg='gray.900'
                            color='white'
                            _placeholder={{ color: 'gray.500' }}
                            borderWidth='1.5px'
                            borderColor='gray.700'
                            py={2}
                        />
                    </InputGroup>
                </Field.Root>

                <Field.Root mb={5}>
                    <Field.Label fontWeight='semibold' color='gray.200' mb={1}>
                        Difficulty
                    </Field.Label>
                    <Select.Root
                        collection={difficulties}
                        value={selectedDifficulty ? [selectedDifficulty] : []}
                        onValueChange={({ value }) => handleDifficulty(value[0] ?? '')}
                    >
                        <Select.HiddenSelect />
                        <Select.Control>
                            <Select.Trigger
                                borderRadius='lg'
                                borderWidth='1.5px'
                                borderColor='gray.700'
                                bg='gray.900'
                                color='white'
                                py={2}
                            >
                                <Select.ValueText placeholder='Select difficulty' />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                                <Select.ClearTrigger />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content bg='gray.900' borderColor='gray.700'>
                                    {difficulties.items.map((item) => (
                                        <Select.Item item={item} key={item.value}>
                                            {item.label}
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                </Field.Root>
            </Stack>
            {role !== 'STUDENT' && (
                <Button colorPalette='green' onClick={() => push('/challenges/create')}>
                    <Plus />
                    Create new challenge
                </Button>
            )}
        </Card.Root>
    );
}
