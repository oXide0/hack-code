'use client';

import { Button } from '@chakra-ui/react';

export function TempButton({ callback, label }: { callback: () => Promise<void>; label: string }) {
    return <Button onClick={callback}>{label}</Button>;
}
