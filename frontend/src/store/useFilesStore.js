import { create } from "zustand";

export const useFilesStore = create((set, get) => ({
  userFiles: null,
  isFetchingFiles: true,
  isUploadingFiles: false,
  isDeletingFile: false,

  fetchUserFiles: async (signal) => {
    try {
      const res = await fetch("/api/user/userfiles", { signal });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      console.log(data.userFiles);
      set({ userFiles: data.userFiles });
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("fetchUserFiles failed: ", { error });
        set({ userFiles: null });
      }
    } finally {
      if (!signal?.aborted) {
        set({ isFetchingFiles: false });
      }
    }
  },

  uploadFile: async (file) => {
    set({ isUploadingFiles: true });
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/user/upload", {
        // no header, let browser and multer handle what Content-Type is
        method: "POST",
        body: formData,
        // fetch automatically switches to "streaming mode. no JSON.stringify"
      });

      if (!res.ok) throw new Error(res.statusText);

      const data = await res.json();
      set((state) => ({
        userFiles: state.userFiles
          ? [...state.userFiles, data.uploaded]
          : [data.uploaded],
      }));
    } catch (error) {
      console.error("uploadFile failed: ", { error });
    } finally {
      set({ isUploadingFiles: false });
    }
  },

  deleteFile: async (fileId, filePath) => {
    set({ isDeletingFile: true });
    try {
      const res = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileId, filePath }),
      });

      if (!res.ok) throw new Error(res.statusText);

      const data = await res.json();

      if (!data?.deleted) throw new Error("Failed to delete");

      set((state) => ({
        userFiles: state.userFiles.filter((file) => file.id !== fileId),
      }));
    } catch (error) {
      console.error("deleteFile failed: ", { error });
    } finally {
      set({ isDeletingFile: false });
    }
  },
}));
