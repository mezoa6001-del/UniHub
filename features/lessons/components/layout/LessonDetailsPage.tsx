"use client";

import { useState } from "react";

import { PrimaryBtn } from "@/components/ui";

import { LessonList } from "../LessonList";

import { CreateLessonDialog } from "../dialogs/CreateLessonDialog";
import { EditLessonDialog } from "../dialogs/EditLessonDialog";
import { DeleteLessonDialog } from "../dialogs/DeleteLessonDialog";

import { useLessons } from "../../hooks";

import type { Lesson } from "../../types";

interface LessonDetailsPageProps {
  courseId: string;
  chapterId: string;
}

export function LessonDetailsPage({
  courseId,
  chapterId,
}: LessonDetailsPageProps) {
  const {
    lessons,
    loading,
    error,
    reload,
  } = useLessons(chapterId);

  const [createOpen, setCreateOpen] =
    useState(false);

  const [editingLesson, setEditingLesson] =
    useState<Lesson | null>(null);

  const [deletingLesson, setDeletingLesson] =
    useState<Lesson | null>(null);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Lessons
            </h1>

            <p className="text-slate-400">
              Manage chapter lessons.
            </p>
          </div>

          <PrimaryBtn
            onClick={() => setCreateOpen(true)}
          >
            + New Lesson
          </PrimaryBtn>
        </div>

        {loading && (
          <p>Loading lessons...</p>
        )}

        {error && (
          <p className="text-red-500">
            {error}
          </p>
        )}

        {!loading && !error && (
          <LessonList
            lessons={lessons}
            onEdit={setEditingLesson}
            onDelete={setDeletingLesson}
          />
        )}
      </div>

      <CreateLessonDialog
        open={createOpen}
        courseId={courseId}
        chapterId={chapterId}
        onClose={() => setCreateOpen(false)}
        onCreated={async () => {
          await reload();
          setCreateOpen(false);
        }}
      />

      <EditLessonDialog
        open={editingLesson !== null}
        lesson={editingLesson}
        onClose={() => setEditingLesson(null)}
        onUpdated={async () => {
          await reload();
          setEditingLesson(null);
        }}
      />

      <DeleteLessonDialog
        open={deletingLesson !== null}
        lesson={deletingLesson}
        onClose={() => setDeletingLesson(null)}
        onDeleted={async () => {
          await reload();
          setDeletingLesson(null);
        }}
      />
    </>
  );
}