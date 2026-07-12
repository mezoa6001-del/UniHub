"use client";

interface FormActionsProps {
  loading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
}

export function FormActions({
  loading = false,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onCancel,
}: FormActionsProps) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl border border-white/10 px-5 py-2 text-slate-300 transition hover:bg-white/5"
      >
        {cancelLabel}
      </button>

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-primary-500 px-5 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Saving..." : submitLabel}
      </button>
    </div>
  );
}