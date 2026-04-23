import * as LocalAuthentication from "expo-local-authentication";
import { create } from "zustand";

import i18n from "@/i18n";

type AuthStore = {
  isAuthenticated: boolean;
  authenticate: () => Promise<void>;
  lock: () => void;
};

let authenticating = false;

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  lock: () => set({ isAuthenticated: false }),
  authenticate: async () => {
    if (get().isAuthenticated || authenticating) {
      return;
    }

    authenticating = true;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: i18n.t("auth.biometricPrompt"),
      disableDeviceFallback: false,
    });

    authenticating = false;

    if (result.success) {
      set({ isAuthenticated: true });
    }
  },
}));
