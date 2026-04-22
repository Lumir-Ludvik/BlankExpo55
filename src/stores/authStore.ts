import * as LocalAuthentication from "expo-local-authentication";
import { create } from "zustand";

import i18n from "@/i18n";

type AuthStore = {
  isAuthenticated: boolean;
  authenticate: () => Promise<void>;
  lock: () => void;
};

export const useAuthStore = create<AuthStore>(set => ({
  isAuthenticated: false,
  lock: () => set({ isAuthenticated: false }),
  authenticate: async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: i18n.t("auth.biometricPrompt"),
      disableDeviceFallback: false,
    });
    if (result.success) {
      set({ isAuthenticated: true });
    }
  },
}));
