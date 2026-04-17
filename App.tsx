import "./src/global.css";

import React from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView className="flex-1">
      <GluestackUIProvider mode={colorScheme === "dark" ? "dark" : "light"}>
        <View className="flex-1 items-center justify-center bg-background-0">
          <Text className="text-typography-900">
            Gluestack-UI v3 is ready. Open App.tsx to start.
          </Text>
          <StatusBar style="auto" />
        </View>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
