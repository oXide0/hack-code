import { Header } from '@/components/layout/header/header';
import { Sidebar } from '@/components/layout/sidebar/sidebar';
import { getIdentity } from '@/hooks/useIdentity';
import { Box, Flex } from '@chakra-ui/react';
import { LayoutPanelLeft, Network, Trophy } from 'lucide-react';
import { ReactNode } from 'react';

export default async function Layout({ children }: { readonly children: ReactNode }) {
    const identity = await getIdentity();

    const navigation = [
        { value: '/courses', label: 'learn', icon: <LayoutPanelLeft size={20} /> },
        { value: '/challenges', label: 'challenges', icon: <Trophy size={20} /> }
        // { value: '/leaderboards', label: 'leaderboards', icon: <UsersRound size={20} /> },
        // { value: '/quests', label: 'quests', icon: <MapPin size={20} /> },
        // { value: '/shop', label: 'shop', icon: <ShoppingBag size={20} /> }
    ];

    if (identity.role === 'SCHOOL_ADMIN' || identity.role === 'TEACHER') {
        navigation.push({ value: '/network', label: 'network', icon: <Network size={20} /> });
    }

    return (
        <Box w='full' h='100vh' p={3}>
            <Sidebar items={navigation} />

            <Flex h='full' w='full' direction='column' pl='275px' position='relative'>
                <Header
                    userId={identity.id}
                    level={identity.studentProfile?.level}
                    username={`${identity.firstName} ${identity.lastName}`}
                />

                <Box pt='80px' h='full' overflowY='auto'>
                    {children}
                </Box>
            </Flex>
        </Box>
    );
}
