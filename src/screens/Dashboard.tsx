import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Text } from "@/components/ui/text";

export function Dashboard() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center bg-background-0">
      <Text className="text-typography-900">{t("dashboard.ready")}</Text>
    </View>
  );
}
