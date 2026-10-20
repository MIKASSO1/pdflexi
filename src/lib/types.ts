import registry from "../data/capabilities.json";
export type Capability = (typeof registry)[number];
export type Attachment = { id: string; file: File; url: string; kind: string };
export type Message = {
  id: string;
  role: "user" | "lexi";
  content: string;
  attachmentNames?: string[];
};
// Integration boundary for phases 2–3. Never execute arbitrary code from a model.
export type ToolCall = {
  capabilityId: Capability["id"];
  inputFileIds: string[];
  parameters: Record<string, unknown>;
};
export type ExecutionResult =
  | { status: "success"; outputFileIds: string[]; warnings: string[] }
  | { status: "unsupported" | "failed"; reason: string };
export interface DocumentEngine {
  execute(
    call: ToolCall,
    files: Attachment[],
    signal: AbortSignal,
  ): Promise<ExecutionResult>;
}
