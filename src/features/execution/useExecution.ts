import { useEffect, useRef, useState } from "react";
import { executePlan, validatePlan } from "../../../packages/core/src/index.ts";
import type {
  ExecutionPlan,
  InputDocument,
  Progress,
} from "../../../packages/core/src/index.ts";
import { toolDefinitions } from "../../../packages/tools/src/index.ts";
import type { Attachment } from "../../lib/types";
export type DownloadArtifact = {
  id: string;
  name: string;
  url: string;
  blob: Blob;
};
export function toInputs(files: Attachment[]): InputDocument[] {
  return files.map((f) => ({ id: f.id, name: f.file.name, blob: f.file }));
}
export function useExecution() {
  const [plan, setPlan] = useState<ExecutionPlan | null>(null),
    [sources, setSources] = useState<InputDocument[]>([]);
  const [results, setResults] = useState<DownloadArtifact[]>([]),
    [error, setError] = useState("");
  const [progress, setProgress] = useState<Progress | null>(null),
    [running, setRunning] = useState(false);
  const active = useRef<AbortController | null>(null),
    urls = useRef<string[]>([]),
    mounted = useRef(true);
  const planning = useRef(0);
  const release = () => {
    urls.current.forEach(URL.revokeObjectURL);
    urls.current = [];
  };
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      planning.current++;
      active.current?.abort();
      release();
    };
  }, []);
  const preview = (raw: unknown, inputs: InputDocument[]) => {
    if (active.current) return;
    planning.current++;
    release();
    setResults([]);
    setProgress(null);
    setError("");
    setPlan(null);
    try {
      setPlan(validatePlan(raw, toolDefinitions, inputs));
      setSources(inputs);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid plan.");
      return false;
    }
  };
  async function propose(request: string, files: Attachment[]) {
    if (active.current) return;
    const version = ++planning.current;
    release();
    setResults([]);
    setProgress(null);
    setError("");
    setPlan(null);
    try {
      const { createAgentProvider } =
        await import("../../../packages/agents/src/index.ts");
      const inputs = toInputs(files),
        provider = createAgentProvider();
      const raw = await provider.plan(
        { request, inputs },
        new AbortController().signal,
      );
      if (mounted.current && planning.current === version)
        return preview(raw, inputs);
    } catch (e) {
      if (mounted.current && planning.current === version)
        setError(e instanceof Error ? e.message : "Cannot plan this request.");
    }
    return false;
  }
  async function run() {
    if (active.current || !plan) return;
    const controller = new AbortController();
    const revision = planning.current;
    active.current = controller;
    setRunning(true);
    setError("");
    release();
    setResults([]);
    try {
      const { browserExecutor } =
        await import("../../../packages/tools/src/browser.ts");
      const artifacts = await executePlan(
        plan,
        toolDefinitions,
        sources,
        browserExecutor,
        controller.signal,
        (p) => {
          if (mounted.current) setProgress(p);
        },
      );
      if (
        !mounted.current ||
        controller.signal.aborted ||
        planning.current !== revision
      )
        return;
      setResults(
        artifacts.map((a) => {
          const blob = new Blob([new Uint8Array(a.bytes)], { type: a.mime }),
            url = URL.createObjectURL(blob);
          urls.current.push(url);
          return { id: crypto.randomUUID(), name: a.name, url, blob };
        }),
      );
    } catch (e) {
      if (mounted.current && planning.current === revision)
        setError(e instanceof Error ? e.message : "Processing failed.");
    } finally {
      active.current = null;
      if (mounted.current) setRunning(false);
    }
  }
  function reset() {
    planning.current++;
    active.current?.abort();
    release();
    setPlan(null);
    setResults([]);
    setError("");
    setProgress(null);
    setSources([]);
  }
  return {
    plan,
    sources,
    results,
    error,
    progress,
    running,
    preview,
    propose,
    run,
    cancel: () => active.current?.abort(),
    reset,
  };
}
export type ExecutionController = ReturnType<typeof useExecution>;
