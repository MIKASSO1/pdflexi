import type { Locale } from "../../data/languages";

const en = {
  pill: "Add Lexi AI to your PDFs",
  title: "Your PDFs, edited by Lexi, {name}",
  from: "from {city}",
  lead: "Merge, split, compress, sign & chat with your docs - Darija • English • French",
  mode: "PDF mode",
  addPdf: "+ PDF",
  image: "Image",
  doc: "Doc",
  task: "PDF Task",
  request: "What would you like to do?",
  placeholder: "Ask Lexi to merge, split, compress or edit...",
  limit: "PDFs up to 20 MB • Processed locally",
  send: "Send",
  drop: "Drop a file or",
  choose: "Choose files",
  formats: "PDF, Word, Excel & images • 20 MB per file",
  empty: "No file chosen yet",
  clear: "Clear",
  dragHint: "Drag & drop anywhere • Stays on your device",
  suggestions: "Suggestions",
  chips: [
    "Merge Q3 invoices into one PDF",
    "Compress report under 2MB",
    "Split contract by pages",
    "Add signature to invoice",
  ],
  demo: "Explore the sample workspace",
  hint: "Enter to send · Shift+Enter for a new line. AI replies are not connected yet.",
};

export type HeroCopy = typeof en;

const ar: HeroCopy = {
  pill: "أضف ليكسي AI إلى ملفات PDF",
  title: "ملفات PDF الخاصة بك، يحررها ليكسي، {name}",
  from: "من {city}",
  lead: "ادمج وقسّم واضغط ووقّع وتحدّث مع مستنداتك - الدارجة • الإنجليزية • الفرنسية",
  mode: "وضع PDF",
  addPdf: "+ PDF",
  image: "صورة",
  doc: "مستند",
  task: "مهمة PDF",
  request: "ماذا تريد أن تفعل؟",
  placeholder: "اطلب من ليكسي الدمج أو التقسيم أو الضغط أو التحرير...",
  limit: "ملفات PDF حتى 20 MB • معالجة محلية",
  send: "إرسال",
  drop: "أفلت ملفاً أو",
  choose: "اختيار الملفات",
  formats: "PDF وWord وExcel وصور • 20 MB للملف",
  empty: "لم يُختر أي ملف بعد",
  clear: "مسح",
  dragHint: "اسحب وأفلت في أي مكان • يبقى على جهازك",
  suggestions: "اقتراحات",
  chips: [
    "ادمج فواتير Q3 في ملف PDF واحد",
    "اضغط التقرير إلى أقل من 2MB",
    "قسّم العقد حسب الصفحات",
    "أضف توقيعاً إلى الفاتورة",
  ],
  demo: "استكشف مساحة العمل التجريبية",
  hint: "Enter للإرسال وShift+Enter لسطر جديد. ردود الذكاء الاصطناعي غير متصلة بعد.",
};

const fr: HeroCopy = {
  pill: "Ajoutez Lexi AI à vos PDF",
  title: "Vos PDF, édités par Lexi, {name}",
  from: "depuis {city}",
  lead: "Fusionnez, divisez, compressez, signez et discutez avec vos documents - Darija • Anglais • Français",
  mode: "Mode PDF",
  addPdf: "+ PDF",
  image: "Image",
  doc: "Doc",
  task: "Tâche PDF",
  request: "Que souhaitez-vous faire ?",
  placeholder:
    "Demandez à Lexi de fusionner, diviser, compresser ou modifier...",
  limit: "PDF jusqu’à 20 Mo • Traité localement",
  send: "Envoyer",
  drop: "Déposez un fichier ou",
  choose: "Choisir des fichiers",
  formats: "PDF, Word, Excel et images • 20 Mo par fichier",
  empty: "Aucun fichier choisi",
  clear: "Effacer",
  dragHint: "Glissez-déposez n’importe où • Reste sur votre appareil",
  suggestions: "Suggestions",
  chips: [
    "Fusionner les factures T3 en un PDF",
    "Compresser le rapport sous 2 Mo",
    "Diviser le contrat par pages",
    "Ajouter une signature à la facture",
  ],
  demo: "Explorer l’espace de travail d’exemple",
  hint: "Entrée pour envoyer · Maj+Entrée pour une nouvelle ligne. Réponses IA non connectées.",
};

export const heroCopy: Record<Locale, HeroCopy> = { en, ar, fr };

/** Capability ids behind the suggestion chips, in the same order as `chips`. */
export const heroChipTools = ["merge", "compress", "split", "sign"];
