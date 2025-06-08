import { hash } from 'bcryptjs';

export function calculateCompleteness(items: Array<{ isCompleted: boolean }>): {
    totalItems: number;
    completedItems: number;
    completenessPercentage: number;
} {
    const totalItems = items.length;
    const completedItems = items.filter((item) => item.isCompleted).length;
    const completenessPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return {
        totalItems,
        completedItems,
        completenessPercentage
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function call(fn: (...args: any[]) => any, ...args: Parameters<typeof fn>): ReturnType<typeof fn> {
    return fn(...args);
}

export const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

export function chunkArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

export const DIFFICULTY_OPTIONS = [
    { label: 'All', value: '' },
    { label: 'Easy (1)', value: '1' },
    { label: 'Medium (2)', value: '2' },
    { label: 'Hard (3)', value: '3' },
    { label: 'Very Hard (4)', value: '4' }
];

export const hashPassword = async (password: string): Promise<string> => {
    return await hash(password, 12);
};

export function getTimeLeft(deadline: Date): string {
    const now = new Date();
    const end = new Date(deadline);
    const diffMs = end.getTime() - now.getTime();

    if (diffMs <= 0) return 'Time is up';

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

    if (days > 0) {
        return `${days}d ${hours}h left`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m left`;
    } else {
        return `${minutes}m left`;
    }
}

export interface OptionType {
    readonly label: string;
    readonly value: string;
}
