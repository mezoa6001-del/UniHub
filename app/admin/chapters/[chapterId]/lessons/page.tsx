export default async function LessonsPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        Lessons
      </h1>

      <p>Chapter ID: {chapterId}</p>
    </div>
  );
}