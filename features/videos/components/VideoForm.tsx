"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { PrimaryBtn } from "@/components/ui";
import { useAuth } from "@/features/shared/hooks/use-auth";
import type { CurrentUser } from "@/features/shared/types/auth.types";

import { useCreateVideo } from "../hooks/useCreateVideo";
import { useListCourses } from "@/features/courses/hooks/useListCourses";
import { useListChapters } from "@/features/chapters/hooks/useListChapters";
import { VideoFormFields } from "./VideoFormFields";

import {
  createVideoSchema,
  type CreateVideoInput,
} from "../schemas/create-video.schema";
export function VideoForm() {
  const { user } = useAuth();

  const currentUser: CurrentUser = {
    uid: user?.uid ?? "",
    role: "owner",
  };

  const { submit, isLoading, error } =
    useCreateVideo(currentUser);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateVideoInput>({
    resolver: zodResolver(createVideoSchema),
    defaultValues: {
      title: "",
      description: "",
      courseId: "",
      chapterId: "",
      provider: "youtube",
      status: "draft",
      videoUrl: "",
      thumbnailUrl: "",
      durationSeconds: 0,
      order: 1,
      isFreePreview: false,
    },
  });

  const courseId = watch("courseId");

  const {
    courses,
    isLoading: loadingCourses,
  } = useListCourses();

  const {
    chapters,
    isLoading: loadingChapters,
  } = useListChapters(courseId);

  async function onSubmit(data: CreateVideoInput) {
    if (!user) return;

    await submit(data);
  }

  if (loadingCourses || loadingChapters) {
    return (
      <div className="py-8 text-center">
        Loading...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
    >
      <VideoFormFields
        register={register}
        errors={errors}
        courses={courses}
        chapters={chapters}
      />

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <PrimaryBtn
          type="submit"
          loading={isLoading}
        >
          Create Video
        </PrimaryBtn>
      </div>
    </form>
  );
}