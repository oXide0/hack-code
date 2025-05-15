import { Dumbbell, LayoutPanelLeft, MapPin, ShoppingBag, UsersRound, User } from 'lucide-react';
import { ReactNode } from 'react';
import { Header } from '@/components/layout/header/header';
import { Sidebar } from '@/components/layout/sidebar/sidebar';
import { Box, Flex } from '@chakra-ui/react';

export default function Layout({ children }: { readonly children: ReactNode }) {
    return (
        <Box w='full' h='100vh' p={3}>
            <Sidebar
                items={[
                    { value: 'learn', label: 'learn', icon: <LayoutPanelLeft size={20} /> },
                    { value: 'practice', label: 'practice', icon: <Dumbbell size={20} /> },
                    { value: 'leaderboards', label: 'leaderboards', icon: <UsersRound size={20} /> },
                    { value: 'quests', label: 'quests', icon: <MapPin size={20} /> },
                    { value: 'shop', label: 'shop', icon: <ShoppingBag size={20} /> },
                    { value: 'profile', label: 'profile', icon: <User size={20} /> }
                ]}
            />

            <Flex h='full' w='full' direction='column' pl='275px'>
                <Header user={{ fullName: 'Matus Sherbak', level: '1', avatarUrl: '' }} />
                <Box pt='80px'>{children}</Box>
            </Flex>
        </Box>
    );
}
