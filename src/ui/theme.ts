// One palette for the whole shell. Components read from here instead of
// recreating light/dark colours inline, so a future redesign touches one file.

export type ThemeVariant = "light" | "dark";

export function getPalette(theme: ThemeVariant) {
  const sun = theme === "light";
  const headerBg = sun ? "#FFFFFF" : "#0F0F14";
  return {
    isSun: sun,
    headerBg,
    outerBg: headerBg,
    headerBorder: sun ? "#E5E7EB" : "rgba(255,255,255,0.06)",
    sideBg: sun ? "#FFFFFF" : "#0B0B12",
    sideBorder: sun ? "#E5E7EB" : "rgba(255,255,255,0.06)",
    sideText: sun ? "#111111" : "white",
    sideMuted: sun ? "#374151" : "rgba(255,255,255,0.55)",
    sideFaint: sun ? "#4B5563" : "rgba(255,255,255,0.25)",
    sideCard: sun ? "#F3F4F6" : "#1A1A24",
    sideCardBorder: sun ? "#E5E7EB" : "rgba(255,255,255,0.06)",
    middleBg: sun ? "#FFFFFF" : "#0F0F14",
    middleText: sun ? "#111111" : "white",
    middleMuted: sun ? "#374151" : "rgba(255,255,255,0.6)",
    middleCard: sun ? "#E9EBEE" : "#18181E",
    middleCardBorder: sun ? "#E5E7EB" : "rgba(255,255,255,0.06)",
    middleFaint: sun ? "#4B5563" : "rgba(255,255,255,0.45)",
  };
}
