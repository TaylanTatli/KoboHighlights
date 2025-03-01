const APP_LOCALES = {
  'en-US': 'English',
  'tr-TR': 'Türkçe',
} as const;

type BaseLang<T extends string> = T extends `${infer U}-${string}` ? U : T; // 'en-US' -> 'en'

const FALLBACK_LOCALES: { from: BaseLang<keyof typeof APP_LOCALES>; to: keyof typeof APP_LOCALES }[] = [
  { from: 'en', to: 'en-US' },
  { from: 'tr', to: 'tr-TR' },
];

export type Locale = keyof typeof APP_LOCALES;

export const Locales = Object.keys(APP_LOCALES);
export const LOCALE_OPTIONS = Object.entries(APP_LOCALES).map(([value, label]) => ({ value, label }));

export const getLocaleFromString = (locale?: string): Locale => {
  if (!locale) {
    return 'en-US';
  }

  if (Locales.includes(locale)) {
    return locale as Locale;
  }

  const fallback = FALLBACK_LOCALES.find(({ from }) => locale.startsWith(from));
  if (fallback) {
    return fallback.to as Locale;
  }

  return 'en-US';
};