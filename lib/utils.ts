export function calculateCourseCompleteness(items: Array<{ isCompleted: boolean }>): {
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
