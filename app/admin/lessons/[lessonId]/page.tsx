interface LessonPageProps {
  params: Promise<{
    lessonId: string;
  }>;
}

export default async function LessonPage({
  params,
}: LessonPageProps) {
  const { lessonId } = await params;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Lesson Content
        </h1>

        <p className="text-gray-500 mt-2">
          Manage videos, PDFs, questions and flashcards.
        </p>
      </div>

      <div className="rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Videos
          </h2>

          <button className="rounded bg-emerald-600 px-4 py-2 text-white">
            + Add Video
          </button>
        </div>
      </div>

      <div className="rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            PDF Files
          </h2>

          <button className="rounded bg-blue-600 px-4 py-2 text-white">
            + Add PDF
          </button>
        </div>
      </div>

      <div className="rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Questions
          </h2>

          <button className="rounded bg-purple-600 px-4 py-2 text-white">
            + Add Question
          </button>
        </div>
      </div>

      <div className="rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Flashcards
          </h2>

          <button className="rounded bg-orange-600 px-4 py-2 text-white">
            + Add Flashcard
          </button>
        </div>
      </div>

      <div className="hidden">
        {lessonId}
      </div>
    </div>
  );
}