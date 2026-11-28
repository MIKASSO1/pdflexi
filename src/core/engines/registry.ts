import type { Capability, Engine } from "../capabilities/contract.mjs";

const engines = new Map<string, Engine>();

export function registerEngine(engine: Engine): void {
  if (engines.has(engine.id)) throw new Error(`engine ${engine.id} is already registered`);
  engines.set(engine.id, engine);
}

export function unregisterEngine(id: string): void {
  engines.delete(id);
}

export function resolveEngine(capability: Capability): Engine | undefined {
  const engine = capability.engine ? engines.get(capability.engine) : undefined;
  return engine && engine.supports(capability) ? engine : undefined;
}

export function listEngines(): string[] {
  return [...engines.keys()];
}
