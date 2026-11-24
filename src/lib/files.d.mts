export const MAX_FILES: number;
export const MAX_FILE_BYTES: number;
export const allowedExtensions: Set<string>;
export function extension(name: string): string;
export function validateMetadata(
  file: Pick<File, "name" | "size">,
): "badFormat" | "tooLarge" | "readError" | null;
export function formatBytes(bytes: number): string;
export function fileKey(
  file: Pick<File, "name" | "size" | "lastModified">,
): string;
