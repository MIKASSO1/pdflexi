import type {
  Artifact,
  InputDocument,
  Parameters,
} from "../../core/src/index.ts";
type Module = {
  execute: (
    inputs: InputDocument[],
    parameters: Parameters,
  ) => Promise<Artifact[]>;
};
export const loaders: Record<string, (() => Promise<Module>) | undefined> = {
  "delete-pages": () => import("./modules/delete-pages/logic.ts"),
  "jpg-to-pdf": () => import("./modules/jpg-to-pdf/logic.ts"),
  merge: () => import("./modules/merge/logic.ts"),
  "page-numbers": () => import("./modules/page-numbers/logic.ts"),
  reorder: () => import("./modules/reorder/logic.ts"),
  rotate: () => import("./modules/rotate/logic.ts"),
  split: () => import("./modules/split/logic.ts"),
  watermark: () => import("./modules/watermark/logic.ts"),
};
