"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";

import { useUploadMedia } from "../hooks";
import type { MediaFolder } from "../types";

interface MediaUploaderProps {
  folder: MediaFolder;
  value?: string;
  accept?: string;
  onChange: (url: string) => void;
}

export function MediaUploader({
  folder,
  value,
  accept = "image/*",
  onChange,
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { upload, uploading, progress } =
    useUploadMedia();

  const [preview, setPreview] = useState(value ?? "");

  async function handleFile(file: File) {
    const result = await upload(file, folder);

    setPreview(result.url);

    onChange(result.url);
  }

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="h-56 w-full rounded-lg border object-cover"
          />

          <button
            type="button"
            onClick={() => {
              setPreview("");
              onChange("");
            }}
            className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-56 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed hover:bg-gray-50"
        >
          {uploading ? (
            <>
              <Loader2
                className="mb-3 animate-spin"
                size={32}
              />

              <span>{Math.round(progress)}%</span>
            </>
          ) : (
            <>
              <Upload size={34} />

              <p className="mt-3 font-medium">
                Upload Image
              </p>

              <p className="text-sm text-gray-500">
                Click to choose a file
              </p>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        hidden
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (!file) return;

          handleFile(file);
        }}
      />
    </div>
  );
}