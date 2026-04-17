import "./src/global.css";
import "./src/i18n";

import React from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Text } from "@/components/ui/text";

export default function App() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <GestureHandlerRootView className="flex-1">
      <GluestackUIProvider mode={colorScheme === "dark" ? "dark" : "light"}>
        <View className="flex-1 items-center justify-center bg-background-0">
          <Text className="text-typography-900">{t("app.ready")}</Text>
          <StatusBar style="auto" />
        </View>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
