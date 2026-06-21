import { create } from "zustand";

export const useFilesStore = create((set, get) => ({
  userFiles: null,
  isFetchingFiles: true,
  isUploadingFiles: false,

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
}));
