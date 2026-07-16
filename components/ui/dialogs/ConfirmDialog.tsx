"use client";

import { Dialog, PrimaryBtn } from "@/components/ui";
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  danger?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      title={title}
      description={description}
      onClose={onCancel}
    >
      <div className="mt-6 flex justify-end gap-3">
        <PrimaryBtn
  type="button"
  onClick={onCancel}
  disabled={loading}
  className="bg-slate-700 hover:bg-slate-600"
>
  {cancelLabel}
</PrimaryBtn>

        <PrimaryBtn
          onClick={onConfirm}
          loading={loading}
          className={
            danger
              ? "bg-red-600 hover:bg-red-700"
              : undefined
          }
        >
          {confirmLabel}
        </PrimaryBtn>
      </div>
    </Dialog>
  );
}