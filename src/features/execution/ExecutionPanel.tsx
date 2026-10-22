import { useEffect, useRef, useState } from "react";
import type { Locale } from "../../data/languages";
import type { Attachment } from "../../lib/types";
import registry from "../../data/capabilities.json";
import { toolDefinitions } from "../../../packages/tools/src/index.ts";
import { createIndexedDbStorage } from "../../../packages/storage/src/index.ts";
import type { DocumentMetadata } from "../../../packages/storage/src/index.ts";
import { executionCopy } from "../../i18n/execution";
import { toInputs } from "./useExecution";
import { loadToolTranslation } from "../../../packages/tools/src/translations.ts";
import type { DownloadArtifact, ExecutionController } from "./useExecution";
const storage = createIndexedDbStorage();
const defaults: Record<string, string> = {
  "delete-pages": '{"pages":[2]}',
  reorder: '{"pages":[2,1]}',
  rotate: '{"degrees":90}',
  watermark: '{"text":"DRAFT"}',
};
export default function ExecutionPanel({
  execution: e,
  files,
  locale,
  initialTool,
  close,
}: {
  execution: ExecutionController;
  files: Attachment[];
  locale: Locale;
  initialTool: string | null;
  close: () => void;
}) {
  const c = executionCopy[locale];
  const [tool, setTool] = useState(initialTool || "merge"),
    [params, setParams] = useState(defaults[initialTool || "merge"] || "{}");
  const [selected, setSelected] = useState<string[]>(files.map((f) => f.id));
  const [formError, setFormError] = useState(""),
    [saved, setSaved] = useState<string[]>([]),
    [stored, setStored] = useState<DocumentMetadata[] | null>(null),
    [storageMessage, setStorageMessage] = useState("");
  const [restored, setRestored] = useState<DownloadArtifact[]>([]);
  const restoredUrls = useRef(new Set<string>()),
    mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      restoredUrls.current.forEach(URL.revokeObjectURL);
      restoredUrls.current.clear();
    };
  }, []);
  useEffect(() => {
    if (initialTool) {
      setTool(initialTool);
      setParams(defaults[initialTool] || "{}");
    }
  }, [initialTool]);
  const [description, setDescription] = useState("");
  useEffect(() => {
    let cancelled = false;
    void loadToolTranslation(tool, locale)
      .then(({ copy }) => {
        if (!cancelled) setDescription(copy.description);
      })
      .catch(() => {
        if (!cancelled) setDescription("");
      });
    return () => {
      cancelled = true;
    };
  }, [tool, locale]);
  const name = (id: string) =>
    registry.find((t) => t.id === id)?.name[locale] || id;
  const definition = toolDefinitions.find((t) => t.id === tool)!;
  async function showSaved() {
    try {
      setStored(await storage.list());
      setStorageMessage("");
    } catch {
      setStorageMessage(c.errorStorage);
    }
  }
  async function save(file: DownloadArtifact) {
    try {
      await storage.put({
        id: file.id,
        name: file.name,
        blob: file.blob,
        createdAt: Date.now(),
      });
      setSaved((s) => [...s, file.id]);
      setStorageMessage(c.saved);
      if (stored) await showSaved();
    } catch {
      setStorageMessage(c.errorStorage);
    }
  }
  return (
    <section
      className="execution-panel"
      aria-label={c.title}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="execution-heading">
        <h2>{c.title}</h2>
        <button onClick={close} disabled={e.running}>
          {c.close}
        </button>
      </div>
      <p>{c.local}</p>
      <p>{description}</p>
      <p>{c.examples}</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setFormError("");
          try {
            if (!selected.some((id) => files.some((f) => f.id === id)))
              throw new Error(c.noInputs);
            e.preview(
              {
                version: 1,
                steps: [
                  {
                    id: "step-1",
                    toolId: tool,
                    inputs: selected.filter((id) =>
                      files.some((f) => f.id === id),
                    ),
                    parameters: JSON.parse(params) as unknown,
                  },
                ],
              },
              toInputs(files.filter((f) => selected.includes(f.id))),
            );
          } catch (error) {
            setFormError(error instanceof Error ? error.message : c.failed);
          }
        }}
      >
        <label>
          {c.tool}
          <select
            value={tool}
            disabled={e.running}
            onChange={(event) => {
              e.reset();
              setFormError("");
              setTool(event.target.value);
              setParams(defaults[event.target.value] || "{}");
            }}
          >
            {toolDefinitions.map((t) => (
              <option key={t.id} value={t.id}>
                {name(t.id)} — {t.status === "ready" ? c.ready : c.planned}
              </option>
            ))}
          </select>
        </label>
        <fieldset disabled={e.running}>
          <legend>{c.sources}</legend>
          {files.map((file) => (
            <label key={file.id}>
              <input
                type="checkbox"
                checked={selected.includes(file.id)}
                onChange={(event) => {
                  e.reset();
                  setFormError("");
                  setSelected((s) =>
                    event.target.checked
                      ? [...s, file.id]
                      : s.filter((id) => id !== file.id),
                  );
                }}
              />
              <bdi>{file.file.name}</bdi>
            </label>
          ))}
        </fieldset>
        <p>{c.input}</p>
        {definition.status === "ready" ? (
          <>
            <label>
              {c.parameters}
              <textarea
                dir="ltr"
                value={params}
                onChange={(event) => {
                  e.reset();
                  setFormError("");
                  setParams(event.target.value);
                }}
                disabled={e.running}
                maxLength={10000}
                rows={2}
              />
            </label>
            <button disabled={e.running} type="submit">
              {c.build}
            </button>
          </>
        ) : (
          <p role="status">{c.unsupported}</p>
        )}
      </form>
      {(formError || e.error) && (
        <p role="alert">
          {c.failed}: {formError || e.error}
        </p>
      )}
      {e.plan && (
        <div>
          <h3>{c.planLabel}</h3>
          <ul>
            {e.sources.map((source) => (
              <li key={source.id}>
                <bdi>{source.name}</bdi>
              </li>
            ))}
          </ul>
          <ol>
            {e.plan.steps.map((step) => (
              <li key={step.id}>
                {name(step.toolId)}{" "}
                <code dir="ltr">{JSON.stringify(step.parameters)}</code>
              </li>
            ))}
          </ol>
          <button onClick={() => void e.run()} disabled={e.running}>
            {c.confirm}
          </button>
        </div>
      )}
      {e.running && (
        <div role="status">
          <p>{c.running}</p>
          <progress
            value={e.progress?.completed || 0}
            max={e.progress?.total || 1}
          />
          <button onClick={e.cancel}>{c.cancel}</button>
        </div>
      )}
      {e.results.length > 0 && (
        <div>
          <h3>{c.done}</h3>
          {e.results.map((file) => (
            <div className="execution-result" key={file.id}>
              <a href={file.url} download={file.name}>
                {c.download}: <bdi>{file.name}</bdi>
              </a>
              <button
                disabled={saved.includes(file.id)}
                onClick={() => void save(file)}
              >
                {saved.includes(file.id) ? c.saved : c.save}
              </button>
            </div>
          ))}
        </div>
      )}
      <hr />
      <p>{c.savedPrivacy}</p>
      <button onClick={() => void showSaved()}>{c.restore}</button>
      {storageMessage && <p role="status">{storageMessage}</p>}
      {stored && (
        <div>
          <p>{stored.length ? c.restore : c.empty}</p>
          {stored.map((doc) => (
            <div className="execution-result" key={doc.id}>
              <span>
                <bdi>{doc.name}</bdi> ({Math.ceil(doc.size / 1024)} KB)
              </span>
              <button
                onClick={() => {
                  void storage
                    .get(doc.id)
                    .then((file) => {
                      if (file && mounted.current) {
                        const url = URL.createObjectURL(file.blob);
                        restoredUrls.current.add(url);
                        setRestored((old) => {
                          old
                            .filter((item) => item.id === doc.id)
                            .forEach((item) => {
                              URL.revokeObjectURL(item.url);
                              restoredUrls.current.delete(item.url);
                            });
                          return [
                            ...old.filter((item) => item.id !== doc.id),
                            { ...file, url },
                          ];
                        });
                      }
                    })
                    .catch(() => setStorageMessage(c.errorStorage));
                }}
              >
                {c.download}
              </button>
              <button
                onClick={() => {
                  void storage
                    .remove(doc.id)
                    .then(() => {
                      setRestored((old) => {
                        old
                          .filter((item) => item.id === doc.id)
                          .forEach((item) => {
                            URL.revokeObjectURL(item.url);
                            restoredUrls.current.delete(item.url);
                          });
                        return old.filter((item) => item.id !== doc.id);
                      });
                      setSaved((old) => old.filter((id) => id !== doc.id));
                      return showSaved();
                    })
                    .catch(() => setStorageMessage(c.errorStorage));
                }}
              >
                {c.remove}
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              if (window.confirm(c.savedConfirm))
                void storage
                  .clear()
                  .then(() => {
                    restoredUrls.current.forEach(URL.revokeObjectURL);
                    restoredUrls.current.clear();
                    setRestored([]);
                    setSaved([]);
                    return showSaved();
                  })
                  .catch(() => setStorageMessage(c.errorStorage));
            }}
          >
            {c.clear}
          </button>
        </div>
      )}
      {restored.map((file) => (
        <a
          className="execution-result"
          key={file.id}
          href={file.url}
          download={file.name}
        >
          {c.download}: <bdi>{file.name}</bdi>
        </a>
      ))}
    </section>
  );
}
