import registryJson from "../../data/capabilities.json";
import { CONTRACT_VERSION, buildMenu, runTicket } from "../capabilities/contract.mjs";
import type { RunStatus } from "../capabilities/contract.mjs";
import { listEngines, registerEngine, resolveEngine } from "./registry";
import { pdfEngine } from "./pdfEngine";

export const capabilityMenu = buildMenu(registryJson).menu;

if (!listEngines().includes(pdfEngine.id)) registerEngine(pdfEngine);

export type CapabilityOutcome = {
  status: RunStatus;
  ok: boolean;
  outputs: Uint8Array[];
  message?: string;
};

export async function runCapability(
  capabilityId: string,
  params: Record<string, unknown>,
  provenance: string,
): Promise<CapabilityOutcome> {
  const ticket = {
    schemaVersion: CONTRACT_VERSION,
    goal: provenance,
    steps: [{ id: "s1", capabilityId, params, provenance }],
  };
  const run = await runTicket(ticket, { menu: capabilityMenu, resolveEngine });
  const first = run.results[0]?.result;
  const outputs = (first?.outputs ?? []).filter((item: unknown): item is Uint8Array => item instanceof Uint8Array);
  const message =
    run.issues.length > 0
      ? run.issues.map((item: { message: string }) => item.message).join("; ")
      : first?.error?.message;
  return { status: run.status, ok: run.ok, outputs, message };
}
