"use client";

import { useState } from "react";

import { Badge, Card, Spinner } from "@/components/ui";

import { ChapterList } from "@/features/chapters/components";

import { CreateChapterDialog } from "@/features/chapters/components/dialogs";

import { useChapters } from "@/features/chapters/hooks";

import { useCourse } from "../../hooks/use-course";
import { CoursePageHeader } from "./CoursePageHeader";
import { CourseTabs } from "./CourseTabs";

import { EditChapterDialog } from "@/features/chapters/components/dialogs";

import type { Chapter } from "@/features/chapters/types";
interface CourseDetailsPageProps {
  courseId: string;
}

type CourseTab =
  | "overview"
  | "chapters"
  | "videos"
  | "questions"
  | "flashcards"
  | "settings";

export function CourseDetailsPage({
  courseId,
}: CourseDetailsPageProps) {
  const { course, loading, error } = useCourse(courseId);
  const {
  chapters,
  loading: chaptersLoading,
  error: chaptersError,
  reload,
} = useChapters(courseId);

  const [activeTab, setActiveTab] =
    useState<CourseTab>("overview");

  const [createDialogOpen, setCreateDialogOpen] =
    useState(false);
    const [editingChapter, setEditingChapter] =
  useState<Chapter | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={40} />
      </div>
    );
  }

  if (error || !course) {
    return (
      <Card className="p-8">
        <p className="text-red-400">
          {error ?? "Course not found."}
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <CoursePageHeader
          title={course.title}
          description={course.description}
          backHref="/admin/courses"
          backLabel="Back to Courses"
        />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">
              Slug
            </p>

            <p className="mt-1 font-mono text-white">
              /{course.slug}
            </p>
          </div>

          <Badge
            color={
              course.status === "published"
                ? "#22C55E"
                : "#F59E0B"
            }
          >
            {course.status === "published"
              ? "Published"
              : "Draft"}
          </Badge>
        </div>

        <CourseTabs
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="text-center">
                <h3 className="text-3xl font-bold text-white">
                  0
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Chapters
                </p>
              </Card>

              <Card className="text-center">
                <h3 className="text-3xl font-bold text-white">
                  0
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Videos
                </p>
              </Card>

              <Card className="text-center">
                <h3 className="text-3xl font-bold text-white">
                  0
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Questions
                </p>
              </Card>
            </div>

            <Card>
              <h2 className="text-xl font-semibold text-white">
                Description
              </h2>

              <p className="mt-3 text-slate-400">
                {course.description ||
                  "No description provided."}
              </p>
            </Card>
          </div>
        )}

        {activeTab === "chapters" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Chapters
                </h2>

                <p className="text-slate-400">
                  Manage course chapters.
                </p>
              </div>

              <button
                onClick={() =>
                  setCreateDialogOpen(true)
                }
                className="rounded-xl bg-primary-500 px-5 py-2 font-semibold text-white transition hover:opacity-90"
              >
                + New Chapter
              </button>
            </div>

            <ChapterList
  chapters={chapters}
  loading={chaptersLoading}
  error={chaptersError}
  onEdit={setEditingChapter}
/>
          </div>
        )}

        {activeTab === "videos" && (
          <Card>
            <h2 className="text-xl font-semibold text-white">
              Videos
            </h2>
          </Card>
        )}

        {activeTab === "questions" && (
          <Card>
            <h2 className="text-xl font-semibold text-white">
              Questions
            </h2>
          </Card>
        )}

        {activeTab === "flashcards" && (
          <Card>
            <h2 className="text-xl font-semibold text-white">
              Flashcards
            </h2>
          </Card>
        )}

        {activeTab === "settings" && (
          <Card>
            <h2 className="text-xl font-semibold text-white">
              Settings
            </h2>
          </Card>
        )}
      </div>
      <CreateChapterDialog
        open={createDialogOpen}
        courseId={courseId}
        onClose={() => setCreateDialogOpen(false)}
        onCreated={async () => {
  await reload();
  setCreateDialogOpen(false);
}}
      />
      <EditChapterDialog
  open={editingChapter !== null}
  chapter={editingChapter}
  onClose={() => setEditingChapter(null)}
  onUpdated={async () => {
    await reload();
    setEditingChapter(null);
  }}
/>
    </>
  );
}