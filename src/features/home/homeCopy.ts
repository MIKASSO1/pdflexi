import type { Locale } from "../../data/languages";

/*
 * Showcase content for the home page. Everything here is sample data until the
 * matching features (documents, reviews, plans) are backed by real sources.
 */

const en = {
  sponsored: "SPONSORED",
  featured: "Featured",
  sponsoredTitle: "Convert Invoice PDF to Excel",
  sponsoredBody:
    "Extract tables, keep formatting, export in one click with Lexi.",
  tryNow: "Try now",
  setup: "2 min setup",
  dismiss: "Dismiss",
  myPdfs: "MY PDFS",
  counts: "3 ACTIVE • 12 TOTAL",
  open: "Open",
  wallEyebrow: "WHAT PEOPLE SAY",
  wallTitle: "Wall of Love",
  multiEyebrow: "MULTI-FILE MODE",
  multiTitle: "Merge, compare, chat across 10 PDFs at once.",
  multiBody:
    'Lexi keeps context across files. Ask "what\'s different in v2?" and get an answer.',
  tryIt: "Try it",
  learnMore: "Learn more",
  lexiFound: "Lexi: Found 3 differences...",
  faqTitle: "FAQ",
  footer: "PDFlexi © 2026 • Made with glow in Tangier",
  statuses: [
    "Edited 2m ago",
    "Lexi summarized",
    "Ready to sign",
    "Chat active",
    "Exported",
    "Shared",
  ],
  reviews: [
    {
      quote:
        "Lexi saved me 6 hours on a 120-page spec. It just understands context.",
      name: "Amine R.",
      role: "Architect, Casablanca",
    },
    {
      quote:
        "Finally a PDF editor that doesn't feel like 2005. The glow, the speed.",
      name: "Sarah L.",
      role: "Lawyer, Paris",
    },
    {
      quote: "I upload my courses and Lexi explains them in Darija. Insane.",
      name: "Youssef K.",
      role: "Student, Tangier",
    },
  ],
  faq: [
    {
      q: "Does Lexi store my PDFs?",
      a: "No. Files are processed locally in your browser and are never uploaded. Nothing is used to train AI models.",
    },
    {
      q: "What makes Lexi different from ChatGPT?",
      a: "Lexi works directly on your documents: it edits, merges, splits and exports real PDFs instead of only answering in text.",
    },
    {
      q: "Can I edit and export back to PDF?",
      a: "Yes. Edit text, annotate and sign in the editor, then export the result as a PDF.",
    },
    {
      q: "Is there a limit?",
      a: "Files can be up to 20 MB each. The free plan includes the essential tools; smart tools are coming soon.",
    },
  ],
};

export type HomeCopy = typeof en;

const ar: HomeCopy = {
  sponsored: "إعلان",
  featured: "مميّز",
  sponsoredTitle: "حوّل فاتورة PDF إلى Excel",
  sponsoredBody:
    "استخرج الجداول مع الحفاظ على التنسيق وصدّرها بنقرة واحدة مع ليكسي.",
  tryNow: "جرّب الآن",
  setup: "إعداد في دقيقتين",
  dismiss: "إخفاء",
  myPdfs: "ملفاتي",
  counts: "3 نشطة • 12 في المجموع",
  open: "فتح",
  wallEyebrow: "آراء المستخدمين",
  wallTitle: "جدار المحبة",
  multiEyebrow: "وضع الملفات المتعددة",
  multiTitle: "ادمج وقارن وتحدّث عبر 10 ملفات PDF دفعة واحدة.",
  multiBody:
    "يحتفظ ليكسي بالسياق عبر الملفات. اسأل «ما الفرق في v2؟» واحصل على إجابة.",
  tryIt: "جرّبه",
  learnMore: "اعرف المزيد",
  lexiFound: "ليكسي: وجدتُ 3 اختلافات...",
  faqTitle: "الأسئلة الشائعة",
  footer: "PDFlexi © 2026 • صُنع بشغف في طنجة",
  statuses: [
    "عُدّل منذ دقيقتين",
    "لخّصه ليكسي",
    "جاهز للتوقيع",
    "المحادثة نشطة",
    "تم التصدير",
    "تمت المشاركة",
  ],
  reviews: [
    {
      quote:
        "وفّر عليّ ليكسي 6 ساعات في مواصفات من 120 صفحة. يفهم السياق فعلاً.",
      name: "أمين ر.",
      role: "مهندس معماري، الدار البيضاء",
    },
    {
      quote: "أخيراً محرر PDF لا يبدو من عام 2005. التوهج والسرعة.",
      name: "سارة ل.",
      role: "محامية، باريس",
    },
    {
      quote: "أرفع دروسي ويشرحها لي ليكسي بالدارجة. مذهل.",
      name: "يوسف ك.",
      role: "طالب، طنجة",
    },
  ],
  faq: [
    {
      q: "هل يخزّن ليكسي ملفاتي؟",
      a: "لا. تُعالج الملفات محلياً في متصفحك ولا تُرفع أبداً، ولا يُستخدم شيء منها لتدريب نماذج الذكاء الاصطناعي.",
    },
    {
      q: "ما الذي يميّز ليكسي عن ChatGPT؟",
      a: "يعمل ليكسي مباشرة على مستنداتك: يحرّر ويدمج ويقسّم ويصدّر ملفات PDF حقيقية بدل الاكتفاء بالرد نصياً.",
    },
    {
      q: "هل يمكنني التحرير ثم التصدير إلى PDF؟",
      a: "نعم. حرّر النص وعلّق ووقّع في المحرر ثم صدّر النتيجة بصيغة PDF.",
    },
    {
      q: "هل هناك حد؟",
      a: "حتى 20 MB لكل ملف. تتضمن الباقة المجانية الأدوات الأساسية، والأدوات الذكية قادمة قريباً.",
    },
  ],
};

const fr: HomeCopy = {
  sponsored: "SPONSORISÉ",
  featured: "À la une",
  sponsoredTitle: "Convertir une facture PDF en Excel",
  sponsoredBody:
    "Extrayez les tableaux, gardez la mise en forme, exportez en un clic avec Lexi.",
  tryNow: "Essayer",
  setup: "2 min de mise en place",
  dismiss: "Masquer",
  myPdfs: "MES PDF",
  counts: "3 ACTIFS • 12 AU TOTAL",
  open: "Ouvrir",
  wallEyebrow: "CE QU’EN DISENT LES GENS",
  wallTitle: "Mur d’amour",
  multiEyebrow: "MODE MULTI-FICHIERS",
  multiTitle: "Fusionnez, comparez et discutez sur 10 PDF à la fois.",
  multiBody:
    "Lexi garde le contexte entre les fichiers. Demandez « qu’est-ce qui change en v2 ? » et obtenez une réponse.",
  tryIt: "Essayer",
  learnMore: "En savoir plus",
  lexiFound: "Lexi : 3 différences trouvées...",
  faqTitle: "FAQ",
  footer: "PDFlexi © 2026 • Fait avec passion à Tanger",
  statuses: [
    "Modifié il y a 2 min",
    "Résumé par Lexi",
    "Prêt à signer",
    "Discussion active",
    "Exporté",
    "Partagé",
  ],
  reviews: [
    {
      quote:
        "Lexi m’a fait gagner 6 heures sur un cahier des charges de 120 pages. Il comprend le contexte.",
      name: "Amine R.",
      role: "Architecte, Casablanca",
    },
    {
      quote:
        "Enfin un éditeur PDF qui ne date pas de 2005. L’éclat, la vitesse.",
      name: "Sarah L.",
      role: "Avocate, Paris",
    },
    {
      quote:
        "Je charge mes cours et Lexi me les explique en darija. Incroyable.",
      name: "Youssef K.",
      role: "Étudiant, Tanger",
    },
  ],
  faq: [
    {
      q: "Lexi stocke-t-il mes PDF ?",
      a: "Non. Les fichiers sont traités localement dans votre navigateur et ne sont jamais envoyés. Rien ne sert à entraîner des modèles d’IA.",
    },
    {
      q: "Qu’est-ce qui différencie Lexi de ChatGPT ?",
      a: "Lexi travaille directement sur vos documents : il modifie, fusionne, divise et exporte de vrais PDF au lieu de répondre seulement par du texte.",
    },
    {
      q: "Puis-je modifier puis réexporter en PDF ?",
      a: "Oui. Modifiez le texte, annotez et signez dans l’éditeur, puis exportez le résultat en PDF.",
    },
    {
      q: "Y a-t-il une limite ?",
      a: "Jusqu’à 20 Mo par fichier. L’offre gratuite inclut les outils essentiels ; les outils intelligents arrivent bientôt.",
    },
  ],
};

export const homeCopy: Record<Locale, HomeCopy> = { en, ar, fr };

export const samplePdfs = [
  { name: "Q3_Financial_Report.pdf", size: "2.4 MB" },
  { name: "Tangier_Architecture.pdf", size: "8.1 MB" },
  { name: "Contract_Legal_V2.pdf", size: "1.2 MB" },
  { name: "Research_Paper_AI.pdf", size: "4.7 MB" },
  { name: "Invoice_Client_092.pdf", size: "0.3 MB" },
  { name: "Pitch_Deck_PDFlexi.pdf", size: "5.5 MB" },
];
