export type Locale = "en" | "ar" | "fr";
export const languages: {
  code: string;
  name: string;
  native: string;
  ready: boolean;
}[] = [
  ["en", "English", "English", true],
  ["ar", "Arabic", "العربية", true],
  ["fr", "French", "Français", true],
  ["es", "Spanish", "Español", false],
  ["de", "German", "Deutsch", false],
  ["it", "Italian", "Italiano", false],
  ["pt", "Portuguese", "Português", false],
  ["nl", "Dutch", "Nederlands", false],
  ["pl", "Polish", "Polski", false],
  ["tr", "Turkish", "Türkçe", false],
  ["ru", "Russian", "Русский", false],
  ["uk", "Ukrainian", "Українська", false],
  ["zh", "Chinese", "中文", false],
  ["ja", "Japanese", "日本語", false],
  ["ko", "Korean", "한국어", false],
  ["hi", "Hindi", "हिन्दी", false],
  ["bn", "Bengali", "বাংলা", false],
  ["ur", "Urdu", "اردو", false],
  ["id", "Indonesian", "Bahasa Indonesia", false],
  ["ms", "Malay", "Bahasa Melayu", false],
  ["vi", "Vietnamese", "Tiếng Việt", false],
  ["th", "Thai", "ไทย", false],
  ["sv", "Swedish", "Svenska", false],
  ["da", "Danish", "Dansk", false],
  ["no", "Norwegian", "Norsk", false],
  ["fi", "Finnish", "Suomi", false],
  ["el", "Greek", "Ελληνικά", false],
  ["cs", "Czech", "Čeština", false],
  ["ro", "Romanian", "Română", false],
].map(([code, name, native, ready]) => ({ code, name, native, ready })) as {
  code: string;
  name: string;
  native: string;
  ready: boolean;
}[];
