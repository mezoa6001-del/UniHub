"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { PrimaryBtn } from "@/components/ui";

import { useListCourses } from "@/features/courses/hooks/useListCourses";
import { useListChapters } from "@/features/chapters/hooks/useListChapters";
import { VideoFormFields } from "./VideoFormFields";

import {
  CreateVideoData,
  createVideoSchema,
  type CreateVideoInput,
} from "../../schemas/create-video.schema";
type VideoFormProps = {
  initialValues?: Partial<CreateVideoInput>;

  onSubmit: (data: CreateVideoInput) => Promise<void>;

  isLoading?: boolean;

  error?: string | null;

  submitLabel?: string;
};
export function VideoForm({
  initialValues,
  onSubmit,
  isLoading = false,
  error = null,
  submitLabel = "Create Video",
}: VideoFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateVideoInput>({
    resolver: zodResolver(createVideoSchema),
    defaultValues: {
  title: initialValues?.title ?? "",
  description: initialValues?.description ?? "",
  courseId: initialValues?.courseId ?? "",
  chapterId: initialValues?.chapterId ?? "",
  provider: initialValues?.provider ?? "youtube",
  status: initialValues?.status ?? "draft",
  videoUrl: initialValues?.videoUrl ?? "",
  thumbnailUrl: initialValues?.thumbnailUrl ?? "",
  durationSeconds: initialValues?.durationSeconds ?? 0,
  order: initialValues?.order ?? 1,
  isFreePreview: initialValues?.isFreePreview ?? false,
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
        hideCourse={!!initialValues?.courseId}
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
          {submitLabel}
        </PrimaryBtn>
      </div>
    </form>
  );
}