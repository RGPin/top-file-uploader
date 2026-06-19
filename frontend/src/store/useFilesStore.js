import { create } from "zustand";

export const useFilesStore = create((set) => ({
  userFiles: null,
  isFetchingFiles: true,

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
}));
