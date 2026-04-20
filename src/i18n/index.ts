/// <reference path="./types.d.ts" />
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import cs from "./locales/cs";
import en from "./locales/en";

function getDeviceLanguage(): string {
  return Localization.getLocales()[0]?.languageCode ?? "cs";
}

i18n.use(initReactI18next).init({
  lng: getDeviceLanguage(),
  fallbackLng: "cs",
  resources: {
    en: { translation: en },
    cs: { translation: cs },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
