import "./src/global.css";
import "./src/i18n";

import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { AppState, AppStateStatus, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Dashboard } from "@/screens/Dashboard";
import { LockedScreen } from "@/screens/LockedScreen";
import { useAuthStore } from "@/stores/authStore";
import { useNetworkStore } from "@/stores/networkStore";

export default function App() {
  const colorScheme = useColorScheme();
  const initNetwork = useNetworkStore(s => s.init);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const authenticate = useAuthStore(s => s.authenticate);
  const lock = useAuthStore(s => s.lock);

  // subscribe to network changes for the app lifetime
  useEffect(() => initNetwork(), [initNetwork]);

  useEffect(() => {
    authenticate();

    const subscription = AppState.addEventListener(
      "change",
      async (state: AppStateStatus) => {
        if (state === "background") {
          lock();
        } else if (state === "active") {
          await authenticate();
        }
      },
    );

    return () => subscription.remove();
  }, [authenticate, lock]);

  return (
    <GestureHandlerRootView className="flex-1">
      <GluestackUIProvider mode={colorScheme === "dark" ? "dark" : "light"}>
        <StatusBar style="auto" />
        {isAuthenticated ? <Dashboard /> : <LockedScreen />}
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
