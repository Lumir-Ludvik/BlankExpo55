type DeepString<T> = {
  [K in keyof T]: T[K] extends object ? DeepString<T[K]> : string;
};

import cs from "./locales/cs";
export type Translations = DeepString<typeof cs>;
