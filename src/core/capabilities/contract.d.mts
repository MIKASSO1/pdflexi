export const CONTRACT_VERSION: 1;

export type Tier = "free" | "pro";
export type OutputKind = "pdf" | "files" | "text" | "json";

export type ParamRule =
  | { type: "files"; min: number; max?: number; required?: boolean }
  | { type: "pages"; required?: boolean }
  | { type: "order"; required?: boolean }
  | { type: "integer"; min?: number; max?: number; required?: boolean }
  | { type: "number"; min?: number; max?: number; required?: boolean }
  | { type: "text"; min?: number; max?: number; required?: boolean }
  | { type: "enum"; values: (string | number)[]; required?: boolean }
  | { type: "record"; required?: boolean }
  | { type: "language"; required?: boolean }
  | { type: "secret"; required?: boolean };

export type LocalizedText = Record<string, string>;

export type Capability = {
  id: string;
  tier: Tier;
  names: LocalizedText;
  descriptions: LocalizedText;
  prompts: LocalizedText;
  engine: string | null;
  op: string | null;
  output: OutputKind | null;
  requiresAi: boolean;
  params: Record<string, ParamRule> | null;
};

export type Menu = Map<string, Capability>;

export type Order = {
  capabilityId: string;
  params?: Record<string, unknown>;
  provenance: string;
  dependsOn?: string[];
};

export type TicketStep = Order & { id: string };

export type Ticket = {
  schemaVersion: number;
  goal: string;
  steps: TicketStep[];
};

export type Issue = {
  code: string;
  message: string;
  param?: string;
  capabilityId?: string;
  stepId?: string;
};

export type EngineResult = {
  ok: boolean;
  verified: boolean;
  outputs: unknown[];
  warnings?: string[];
  error?: { code: string; message: string };
};

export type Engine = {
  id: string;
  supports(capability: Capability): boolean;
  execute(input: { capability: Capability; order: Order; signal?: AbortSignal }): Promise<EngineResult>;
};

export type RunStatus = "ok" | "invalid" | "failed" | "unverified" | "unavailable" | "aborted";

export type RunOutcome = {
  status: RunStatus;
  ok: boolean;
  results: { stepId: string; result: EngineResult }[];
  issues: Issue[];
  failedStep?: string;
};

export type StepEvent = {
  step: TicketStep;
  index: number;
  state: "running" | "done" | "failed" | "unverified" | "unavailable";
};

export function buildMenu(registry: readonly unknown[]): { menu: Menu; issues: Issue[] };
export function validateOrder(order: Order, menu: Menu): Issue[];
export function validateTicket(ticket: Ticket, menu: Menu): Issue[];
export function redactOrder<T extends Order>(order: T): T;
export function runTicket(
  ticket: Ticket,
  options: {
    menu: Menu;
    resolveEngine?: (capability: Capability) => Engine | undefined;
    signal?: AbortSignal;
    onStep?: (event: StepEvent) => void;
  },
): Promise<RunOutcome>;
