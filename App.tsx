import "./src/global.css";
import "./src/i18n";

import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Dashboard } from "@/screens/Dashboard";
import { useNetworkStore } from "@/stores/networkStore";

export default function App() {
  const colorScheme = useColorScheme();
  const init = useNetworkStore(s => s.init);

  // subscribe to network changes for the app lifetime
  useEffect(() => init(), [init]);

  return (
    <GestureHandlerRootView className="flex-1">
      <GluestackUIProvider mode={colorScheme === "dark" ? "dark" : "light"}>
        <StatusBar style="auto" />
        <Dashboard />
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
