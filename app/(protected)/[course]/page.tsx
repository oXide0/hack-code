export default async function Page({ params }: { params: Promise<{ course: string }> }) {
    const { course } = await params;

    return (
        <div>
            <h1>{course}</h1>
            Page
        </div>
    );
}
