import {
  exactKeys,
  record,
  pageList,
  ExecutionError,
} from "../../core/src/index.ts";
export function noParameters(value: unknown) {
  const p = record(value);
  exactKeys(p, []);
  return {};
}
export function pagesParameters(value: unknown) {
  const p = record(value);
  exactKeys(p, ["pages"]);
  return { pages: pageList(p.pages) };
}
export function rotateParameters(value: unknown) {
  const p = record(value);
  exactKeys(p, ["degrees", "pages"]);
  if (![90, 180, 270].includes(p.degrees as number))
    throw new ExecutionError(
      "invalid-parameters",
      "Rotation must be 90, 180 or 270 degrees.",
    );
  return {
    degrees: p.degrees,
    ...(p.pages === undefined ? {} : { pages: pageList(p.pages) }),
  };
}
export function watermarkParameters(value: unknown) {
  const p = record(value);
  exactKeys(p, ["text"]);
  if (
    typeof p.text !== "string" ||
    !p.text.trim() ||
    p.text.length > 120 ||
    !/^[\x20-\x7e]+$/.test(p.text)
  )
    throw new ExecutionError(
      "invalid-parameters",
      "This watermark executor currently supports 1–120 printable ASCII characters. Other scripts need an embedded font.",
    );
  return { text: p.text };
}
