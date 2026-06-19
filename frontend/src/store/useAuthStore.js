import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isFetchingUser: true,
  isLoggingIn: false,
  isLoggingOut: false,

  fetchUser: async (signal) => {
    console.log("fetchUser running");
    try {
      set({ isFetchingUser: true });
      const res = await fetch("/api/auth/check", { signal });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      set({ user: data.user });
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("fetchUser failed: ", { error });
        set({ user: null });
      }
    } finally {
      if (!signal?.aborted) {
        set({ isFetchingUser: false });
      }
    }
  },

  handleLogin: async (formData, navigateOnSuccess) => {
    set({ isLoggingIn: true });
    console.log("handleLogin running");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      set({ user: data.user });

      if (navigateOnSuccess) navigateOnSuccess();
    } catch (error) {
      console.error("handleLogin failed: ", { error });
      set({ user: null });
    } finally {
      set({ isLoggingIn: false });
    }
  },

  handleLogOut: async () => {
    set({ isLoggingOut: true });
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Log out failed");
      }
      set({ user: null });
    } catch (error) {
      console.error("handleLogOut failed: ", { error });
    } finally {
      set({ isLoggingOut: false });
    }
  },
}));
