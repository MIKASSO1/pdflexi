import registry from "../data/capabilities.json";
export type Capability = (typeof registry)[number];
export type Attachment = { id: string; file: File; url: string; kind: string };
export type Message = {
  id: string;
  role: "user" | "lexi";
  content: string;
  attachmentNames?: string[];
};
// One source of truth for planner/executor contracts across the workspace.
export type {
  ExecutionPlan,
  PlanStep,
  Artifact,
  ExecutionAdapter,
  InputDocument,
} from "../../packages/core/src/index.ts";
