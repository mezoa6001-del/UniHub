import AdminModal from "./AdminModal";
import AdminButton from "./AdminButton";

type Props = {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function AdminConfirmDialog({
  open,
  title,
  message,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <AdminModal
      open={open}
      title={title}
      onClose={onCancel}
    >
      <p className="text-slate-300 mb-6">
        {message}
      </p>

      <div className="flex justify-end gap-3">
        <AdminButton
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </AdminButton>

        <AdminButton
          variant="danger"
          onClick={onConfirm}
        >
          Delete
        </AdminButton>
      </div>
    </AdminModal>
  );
}