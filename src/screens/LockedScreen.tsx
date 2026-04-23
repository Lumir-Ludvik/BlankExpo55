import React from "react";
import { useTranslation } from "react-i18next";

import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuthStore } from "@/stores/authStore";

export function LockedScreen() {
  const { t } = useTranslation();
  const authenticate = useAuthStore(s => s.authenticate);

  return (
    <VStack
      className="flex-1 items-center justify-center bg-background-0"
      accessibilityRole="none">
      <Text className="mb-8 text-xl text-typography-900">
        {t("auth.lockedMessage")}
      </Text>
      <Button
        onPress={authenticate}
        accessibilityLabel={t("auth.tryAgain")}
        accessibilityRole="button"
        accessibilityHint={t("auth.biometricPrompt")}
        className="min-h-[48px] px-8">
        <ButtonText>{t("auth.tryAgain")}</ButtonText>
      </Button>
    </VStack>
  );
}
