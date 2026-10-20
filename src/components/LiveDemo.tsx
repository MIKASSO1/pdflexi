import { FileText, ScanLine, ShieldAlert, Sparkles } from "lucide-react";
import type { experience } from "../data/experience";
type Words = (typeof experience)["en"];
export function LiveDemo({
  words: w,
  stage,
  back,
}: {
  words: Words;
  stage: number;
  back: () => void;
}) {
  return (
    <section className="live-demo" aria-label="Live Canvas">
      <header className="demo-header">
        <span className="canvas-symbol">
          <ScanLine size={22} />
        </span>
        <div>
          <h2>Live Canvas</h2>
          <p>{stage < 2 ? w.demoWaiting : w.demoReady}</p>
        </div>
        <span className="example-label">{w.demoTag}</span>
      </header>
      <p className="demo-notice">{w.demoNote}</p>
      <div className="demo-document-stage">
        <article className="demo-document">
          <div className="demo-document-brand">
            <FileText size={20} />
            <span>LEXI / SAMPLE</span>
            <span>02</span>
          </div>
          <h3>{w.sampleTitle}</h3>
          <div className="sample-line" />
          <p className="demo-section-label">{w.focus}</p>
          <p className="demo-clause">
            <mark className={stage >= 1 ? "revealed" : ""}>{w.clause}</mark>
          </p>
          <p className="demo-clause">
            <mark className={stage >= 2 ? "revealed" : ""}>{w.clause2}</mark>
          </p>
          <div className="demo-filler" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          {stage >= 2 && (
            <aside className="sample-summary">
              <Sparkles size={17} />
              <p>{w.summary}</p>
            </aside>
          )}
          <footer>PDFlexi · {w.demoTag}</footer>
        </article>
      </div>
      <div className="demo-insights" aria-live="polite">
        {stage >= 3 && (
          <div className="example-risk">
            <ShieldAlert size={21} />
            <div>
              <h3>{w.risk}</h3>
              <p>{w.riskBody}</p>
            </div>
          </div>
        )}
      </div>
      <button className="secondary-button demo-back" onClick={back}>
        {w.back}
      </button>
    </section>
  );
}
