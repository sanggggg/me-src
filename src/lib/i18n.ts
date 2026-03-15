import en from "../i18n/locales/en.json";
import ko from "../i18n/locales/ko.json";
import type { Locale } from "./content-meta";

const dictionaries = { en, ko } as const;

function getValue(input: unknown, segments: string[]): unknown {
  return segments.reduce<unknown>((value, segment) => {
    if (value && typeof value === "object" && segment in value) {
      return (value as Record<string, unknown>)[segment];
    }

    return undefined;
  }, input);
}

export function t(
  lang: Locale,
  key: string,
  params: Record<string, string | number> = {},
): string {
  const raw = getValue(dictionaries[lang], key.split("."));

  if (typeof raw !== "string") {
    return key;
  }

  const nestedResolved = raw.replace(
    /\$t\(([^)]+)\)/g,
    (_match: string, nestedKey: string) => t(lang, nestedKey.trim()),
  );

  return nestedResolved.replace(
    /\{\{(\w+)\}\}/g,
    (_match: string, paramKey: string) => {
      const value = params[paramKey];
      return value === undefined ? "" : String(value);
    },
  );
}
