import type { Locale } from "../../data/languages";

const en = {
  navLabel: "Main navigation",
  backToTop: "Back to top",
  myPdfs: "My PDFlexi",
  newTask: "New PDF Task",
  search: "Search",
  searchTools: "Search tools",
  tools: "TOOLS",
  aiTools: "AI Tools",
  projects: "PROJECTS",
  noResults: "No tool found",
  upgradeTitle: "Upgrade to Pro",
  upgradeBody: "Unlimited tasks, 2GB files & priority AI.",
  upgradeCta: "Upgrade — $12/mo",
  freePlan: "Free plan",
  account: "Account",
  more: "More options",
  railLabel: "Quick actions",
  railPrivacy: "Privacy",
  railSmart: "Smart tools",
  railChat: "Ask Lexi",
  railWatermark: "Watermark",
  railTools: "Quick tools",
  railFiles: "My PDFs",
};

export type ShellCopy = typeof en;

const ar: ShellCopy = {
  navLabel: "التنقل الرئيسي",
  backToTop: "العودة للأعلى",
  myPdfs: "ملفاتي",
  newTask: "مهمة PDF جديدة",
  search: "بحث",
  searchTools: "ابحث عن أداة",
  tools: "الأدوات",
  aiTools: "أدوات الذكاء الاصطناعي",
  projects: "المشاريع",
  noResults: "لا توجد أداة مطابقة",
  upgradeTitle: "الترقية إلى Pro",
  upgradeBody: "مهام غير محدودة وملفات حتى 2GB وذكاء اصطناعي بأولوية.",
  upgradeCta: "ترقية — $12/شهر",
  freePlan: "الباقة المجانية",
  account: "الحساب",
  more: "خيارات إضافية",
  railLabel: "إجراءات سريعة",
  railPrivacy: "الخصوصية",
  railSmart: "الأدوات الذكية",
  railChat: "اسأل ليكسي",
  railWatermark: "علامة مائية",
  railTools: "أدوات سريعة",
  railFiles: "ملفاتي",
};

const fr: ShellCopy = {
  navLabel: "Navigation principale",
  backToTop: "Haut de page",
  myPdfs: "Mon PDFlexi",
  newTask: "Nouvelle tâche PDF",
  search: "Rechercher",
  searchTools: "Rechercher un outil",
  tools: "OUTILS",
  aiTools: "Outils IA",
  projects: "PROJETS",
  noResults: "Aucun outil trouvé",
  upgradeTitle: "Passer à Pro",
  upgradeBody: "Tâches illimitées, fichiers de 2 Go et IA prioritaire.",
  upgradeCta: "Passer à Pro — 12 $/mois",
  freePlan: "Offre gratuite",
  account: "Compte",
  more: "Plus d’options",
  railLabel: "Actions rapides",
  railPrivacy: "Confidentialité",
  railSmart: "Outils intelligents",
  railChat: "Demander à Lexi",
  railWatermark: "Filigrane",
  railTools: "Outils rapides",
  railFiles: "Mes PDF",
};

export const shellCopy: Record<Locale, ShellCopy> = { en, ar, fr };

/** Tool ids pinned under "TOOLS" in the sidebar. */
export const pinnedToolIds = ["merge", "split", "compress"];

/** Sample project names shown in the sidebar until projects are implemented. */
export const sampleProjects = ["Q3 Reports", "Invoices 2024"];
