export const MAX_FILES = 10;
export const MAX_FILE_BYTES = 20 * 1024 * 1024;
export const allowedExtensions = new Set([
  "pdf",
  "docx",
  "xlsx",
  "jpg",
  "jpeg",
  "png",
]);
export function extension(name) {
  return name.toLowerCase().split(".").pop() || "";
}
export function validateMetadata(file) {
  if (!allowedExtensions.has(extension(file.name))) return "badFormat";
  if (file.size === 0) return "readError";
  if (file.size > MAX_FILE_BYTES) return "tooLarge";
  return null;
}
export function formatBytes(bytes) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
export function fileKey(file) {
  return `${file.name}\u0000${file.size}\u0000${file.lastModified}`;
}
