import { ExecutionError, limits } from "../../core/src/index.ts";
import type { Artifact, ExecutionAdapter } from "../../core/src/index.ts";
/** A fresh worker per step: cancellation/timeout terminates CPU-bound library code too. */
export const browserExecutor: ExecutionAdapter = (
  toolId,
  inputs,
  parameters,
  signal,
) =>
  new Promise((resolve, reject) => {
    if (import.meta.env.PDFLEXI_STANDALONE) {
      reject(
        new ExecutionError(
          "unsupported",
          "Tool execution requires the hosted build, not the single-file review artifact.",
        ),
      );
      return;
    }
    if (signal.aborted) {
      reject(new ExecutionError("cancelled", "Execution cancelled."));
      return;
    }
    const worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });
    const finish = (error?: Error, artifacts?: Artifact[]) => {
      clearTimeout(timer);
      signal.removeEventListener("abort", abort);
      worker.terminate();
      if (error) reject(error);
      else resolve(artifacts!);
    };
    const abort = () =>
      finish(new ExecutionError("cancelled", "Execution cancelled."));
    const timer = setTimeout(
      () =>
        finish(
          new ExecutionError(
            "timeout",
            "Local processing exceeded two minutes.",
          ),
        ),
      limits.timeoutMs,
    );
    signal.addEventListener("abort", abort, { once: true });
    worker.onerror = () =>
      finish(
        new ExecutionError(
          "processing",
          "The local worker could not process this document.",
        ),
      );
    worker.onmessageerror = () =>
      finish(new ExecutionError("processing", "Invalid worker message."));
    worker.onmessage = (
      event: MessageEvent<{
        ok: boolean;
        artifacts?: Artifact[];
        code?: ExecutionError["code"];
        message?: string;
      }>,
    ) => {
      if (event.data.ok && Array.isArray(event.data.artifacts))
        finish(undefined, event.data.artifacts);
      else
        finish(
          new ExecutionError(
            event.data.code || "processing",
            event.data.message || "Processing failed.",
          ),
        );
    };
    try {
      worker.postMessage({ toolId, inputs, parameters });
    } catch {
      finish(
        new ExecutionError("processing", "Could not send files to the worker."),
      );
    }
  });
