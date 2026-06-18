import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isFetchingUser: true,

  fetchUser: async (signal) => {
    try {
      set({ isFetchingUser: true });
      const res = await fetch("/api/auth/check", { signal });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      set({ user: data });
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("fetchUser failed: ", { error });
        set({ user: null });
      }
    } finally {
      set({ isFetchingUser: false });
    }
  },
}));
