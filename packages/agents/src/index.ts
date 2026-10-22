import type { ExecutionPlan, InputDocument } from "../../core/src/index.ts";
export type PlannerContext = { request: string; inputs: InputDocument[] };
export interface AgentProvider {
  readonly id: string;
  /** Untrusted provider output. Always validate at the engine boundary. No library execution here. */
  plan(context: PlannerContext, signal: AbortSignal): Promise<unknown>;
}
export class ClarificationNeeded extends Error {}
/** Conservative offline fallback, NOT an LLM. It only accepts the documented grammar. */
export function createOfflinePlanner(): AgentProvider {
  return {
    id: "offline-commands-v1",
    async plan({ request, inputs }, signal): Promise<ExecutionPlan> {
      if (signal.aborted) throw new Error("Planning cancelled.");
      if (request.length > 8000)
        throw new ClarificationNeeded("Request is too long.");
      const normalize = (text: string) =>
        text
          .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
          .replace(/[أإآ]/g, "ا")
          .trim();
      const commands = normalize(request).split(/\s+(?:then|ثم|puis)\s+/i);
      if (commands.length > 10)
        throw new ClarificationNeeded("Use at most 10 steps.");
      const steps: ExecutionPlan["steps"] = [];
      let previous: string | undefined;
      for (const command of commands) {
        let toolId: string,
          parameters: Record<string, unknown> = {};
        if (
          /^(?:merge(?:\s+(?:pdfs?|files|documents|all|these|the|two))*|ادمج(?:\s+(?:الملفات|ملفات|هذه|كل|ملفي|الملفين))*|جمع(?:\s+ليا)?(?:\s+الملفات)?|fusionner(?:\s+(?:les|pdf|fichiers))*)[.!؟]?$/i.test(
            command,
          )
        )
          toolId = "merge";
        else if (
          /^(?:split(?:\s+(?:pdf|pages|file))?|قسم(?:\s+(?:الملف|الصفحات))?|separer(?:\s+les\s+pages)?)[.!؟]?$/i.test(
            command,
          )
        )
          toolId = "split";
        else if (
          /^(?:page numbers|number pages|رقم الصفحات|ترقيم الصفحات|numeroter les pages)$/i.test(
            command,
          )
        )
          toolId = "page-numbers";
        else if (
          /^(?:images to pdf|jpg to pdf|حول الصور الى pdf)$/i.test(command)
        )
          toolId = "jpg-to-pdf";
        else {
          const rotation =
            /^(?:rotate|دور|تدوير|tourner)\s+(90|180|270)(?:\s+(?:degrees|درجة|درجه|degres))?$/i.exec(
              command,
            );
          const pages =
            /^(delete(?:\s+pages?)?|احذف(?:\s+(?:الصفحة|الصفحات))?|reorder(?:\s+pages?)?|رتب(?:\s+الصفحات)?|supprimer(?:\s+les\s+pages)?|reordonner)\s+([\d\s,،]+)$/i.exec(
              command,
            );
          const watermark =
            /^(?:watermark|علامة مائية|filigrane)\s*:\s*(.+)$/i.exec(command);
          if (rotation) {
            toolId = "rotate";
            parameters = { degrees: Number(rotation[1]) };
          } else if (pages) {
            toolId = /^(?:reorder|رتب|reordonner)/i.test(pages[1])
              ? "reorder"
              : "delete-pages";
            parameters = {
              pages: pages[2]
                .trim()
                .split(/[\s,،]+/)
                .map(Number),
            };
          } else if (watermark) {
            toolId = "watermark";
            parameters = { text: watermark[1] };
          } else
            throw new ClarificationNeeded(
              "Use a supported command or the structured tool form. Ambiguous requests are not executed.",
            );
        }
        if (
          !previous &&
          inputs.length !== 1 &&
          !["merge", "jpg-to-pdf"].includes(toolId)
        )
          throw new ClarificationNeeded(
            "Select exactly one source file for this tool.",
          );
        const id = `step-${steps.length + 1}`;
        steps.push({
          id,
          toolId,
          inputs: previous ? [previous] : inputs.map((i) => i.id),
          parameters,
        });
        previous = id;
      }
      return { version: 1, steps };
    },
  };
}
/** Register a verified WebLLM/other provider later; nothing silently calls a paid API. */
export function createAgentProvider(
  options: { provider?: AgentProvider } = {},
): AgentProvider {
  return options.provider || createOfflinePlanner();
}
