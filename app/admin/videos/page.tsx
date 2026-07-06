"use client";

import { useVideos } from "./hooks";

import VideoFilters from "./VideoFilters";
import VideoStats from "./VideoStats";
import VideoTable from "./VideoTable";
import VideoModal from "./VideoModal";

import { PrimaryBtn, Spinner, Toast } from "@/components/ui";

export default function AdminVideosPage() {
  const {
    videos,
    chapters,
    loading,

    search,
    setSearch,

    modal,
    toast,

    setToast,

    openAddModal,
    openEditModal,
    closeModal,

    saveVideo,
    removeVideo,
  } = useVideos();

  return (
    <div className="space-y-6">

      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <VideoStats videos={videos} />

      <div className="flex justify-between items-center">

        <VideoFilters
          search={search}
          onSearchChange={setSearch}
        />

        <PrimaryBtn onClick={openAddModal}>
          + Add Video
        </PrimaryBtn>

      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={40} />
        </div>
      ) : (
        <VideoTable
          videos={videos}
          onEdit={openEditModal}
          onDelete={removeVideo}
        />
      )}

      <VideoModal
        open={!!modal}
        mode={modal?.mode ?? "add"}
        initial={modal?.data ?? {}}
        chapters={chapters}
        onClose={closeModal}
        onSave={saveVideo}
      />

    </div>
  );
}