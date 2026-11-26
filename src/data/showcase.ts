// Static demo/showcase content rendered on the landing and workspace pages.
// Edit here — no component changes needed.

export const pdfs = [
  { name: "Contract-Tangier-2024.pdf", size: "2.4 MB", pages: "12 pages", type: "PDF", color: "#8B5CF6", edited: "edited 2h ago" },
  { name: "Invoice_Client-A.xlsx", size: "1.1 MB", pages: "3 sheets", type: "XLSX", color: "#16A34A", edited: "edited Yesterday" },
  { name: "CV_Kamal_Design.docx", size: "890 KB", pages: "2 pages", type: "DOCX", color: "#2563EB", edited: "edited 2 days ago" },
  { name: "Portfolio_Final.pdf", size: "8.2 MB", pages: "24 pages", type: "PDF", color: "#EC4899", edited: "edited 3 days ago" },
  { name: "Nda-Agreement.txt", size: "540 KB", pages: "120 lines", type: "TXT", color: "#64748B", edited: "edited 4 days ago" },
  { name: "Presentation_Pitch.pdf", size: "4.7 MB", pages: "18 pages", type: "PDF", color: "#6366F1", edited: "edited 5 days ago" },
];

export const quickPills = ["Merge Q3 invoices into one PDF", "Compress report under 2MB", "Split contract by pages", "Add signature to invoice", "Summarize 120-page spec"];

export const chatPlaceholders = [
  "Ask Lexi to merge, split, compress or edit...",
  "Merge Q3 invoices into one PDF...",
  "Compress this report under 2MB...",
  "Split this contract by pages...",
  "Add my signature to this invoice...",
  "Summarize this 120-page contract in 3 lines...",
  "Translate this PDF to French, keep design...",
];

export const faqs = [
  { q: "What is PDFlexi?", a: "PDFlexi is a PDF platform where you edit your PDFs by chatting with Lexi. Merge, split, compress, sign, summarize and translate - just by typing what you want in plain words." },
  { q: "How does Lexi work?", a: "Drop your PDF, then ask Lexi in English, French, Darija or 40+ languages. Example: 'Merge these invoices' or 'Compress under 2MB'. Lexi does it for you in your browser." },
  { q: "Is PDFlexi free?", a: "Yes. Free gives you 20 free tools without daily limits, plus +3 credits per day for advanced tools. Pro gives you +500 credits per month, 10 advanced AI tools, 100 MB upload and no ads for $12 / month (or $9 / month yearly). Free tools cost 0 credits, advanced tools cost credits." },
  { q: "Is it really 100% private?", a: "Yes. All tools run 100% in your browser (LOCAL). Your files never leave your device, never uploaded to our servers, never stored." },
  { q: "What languages does Lexi speak?", a: "English, French, Darija and 40+ languages. You can talk to Lexi in the language you are most comfortable with." },
  { q: "Do I need to install anything?", a: "No. PDFlexi works directly in your browser on computer and mobile. No install, no Acrobat, no account needed to try." },
];

export const freeTools = [
  { id: 1, en: "Merge PDF", icon: "🔗" }, { id: 2, en: "Split PDF", icon: "✂️" }, { id: 3, en: "Compress PDF", icon: "🗜️" }, { id: 4, en: "PDF to Word", icon: "📄" }, { id: 5, en: "Word to PDF", icon: "📝" },
  { id: 6, en: "PDF to Excel", icon: "📊" }, { id: 7, en: "Excel to PDF", icon: "📈" }, { id: 8, en: "PDF to JPG", icon: "🖼️" }, { id: 9, en: "JPG to PDF", icon: "🖌️" }, { id: 10, en: "Delete Pages", icon: "🗑️" },
  { id: 11, en: "Rotate Pages", icon: "🔄" }, { id: 12, en: "Reorder Pages", icon: "↕️" }, { id: 13, en: "Watermark", icon: "💧" }, { id: 14, en: "Page Numbers", icon: "🔢" }, { id: 15, en: "Protect PDF", icon: "🛡️" },
  { id: 16, en: "Unlock PDF", icon: "🔑" }, { id: 17, en: "Sign PDF", icon: "✍️" }, { id: 18, en: "Edit PDF", icon: "✏️" }, { id: 19, en: "Repair PDF", icon: "🛠️" }, { id: 20, en: "OCR - Extract Text", icon: "👁️" },
];

export const proTools = [
  { id: 21, en: "Chat with PDF", icon: "💬" }, { id: 22, en: "Summarize Contract in 3 Lines", icon: "⚡" }, { id: 23, en: "Detect Risky Clauses", icon: "⚠️" }, { id: 24, en: "Detect Forgery", icon: "🕵️" }, { id: 25, en: "Compare Two Contracts", icon: "⚖️" },
  { id: 26, en: "Extract Invoices to Excel", icon: "🧾" }, { id: 27, en: "Fill Form by Chat", icon: "📋" }, { id: 28, en: "Translate PDF - Keep Design", icon: "🌍" }, { id: 29, en: "Smart CV from Job Offer", icon: "🚀" }, { id: 30, en: "Bulk Stamp 100 Docs", icon: "📦" },
];

export const wsIconColor: Record<number, string> = { 1: "#7C3AED", 2: "#2563EB", 3: "#D97706", 4: "#2563EB", 5: "#059669", 6: "#059669", 7: "#059669", 8: "#DB2777", 9: "#DB2777", 10: "#DC2626", 11: "#4F46E5", 12: "#4F46E5", 13: "#0891B2", 14: "#7C3AED", 15: "#D97706", 16: "#D97706", 17: "#7C3AED", 18: "#2563EB", 19: "#DC2626", 20: "#4F46E5", 21: "#7C3AED", 22: "#D97706", 23: "#DC2626", 24: "#4F46E5", 25: "#2563EB", 26: "#059669", 27: "#0891B2", 28: "#059669", 29: "#DB2777", 30: "#D97706" };

export const recentFiles = [
  { name: "Contract-Tangier-2024.pdf", time: "2h ago", color: "#8B5CF6" },
  { name: "Invoice_Client-A.pdf", time: "Yesterday", color: "#06B6D4" },
  { name: "CV_Kamal_Design.pdf", time: "2 days ago", color: "#F59E0B" },
];

export const getFileInfo = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.endsWith(".rtf")) return { label: "RTF", color: "#0E7490", meta: "Text file • RTF" };
  if (lower.endsWith(".txt")) return { label: "TXT", color: "#0E7490", meta: "Text file • TXT" };
  if (lower.endsWith(".md")) return { label: "MD", color: "#0E7490", meta: "Text file • Markdown" };
  if (lower.endsWith(".doc") || lower.endsWith(".docx")) return { label: "DOC", color: "#2563EB", meta: "Word document" };
  if (lower.endsWith(".xls") || lower.endsWith(".xlsx")) return { label: "XLS", color: "#059669", meta: "Excel sheet" };
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png") || lower.endsWith(".webp")) return { label: "IMG", color: "#7C3AED", meta: "Image file" };
  if (lower.endsWith(".pdf")) return { label: "PDF", color: "#EF4444", meta: "PDF document" };
  return { label: "FILE", color: "#6B7280", meta: "Document" };
};
