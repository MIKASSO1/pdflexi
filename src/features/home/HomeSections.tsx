import { useState } from "react";
import { Layers3, Plus, X } from "lucide-react";
import type { Locale } from "../../data/languages";
import { homeCopy, samplePdfs } from "./homeCopy";

export function HomeSections({
  locale,
  onSelectTool,
  onOpenSample,
  onTryMulti,
  onLearnMore,
}: {
  locale: Locale;
  onSelectTool: (id: string) => void;
  onOpenSample: (name: string) => void;
  onTryMulti: () => void;
  onLearnMore: () => void;
}) {
  const h = homeCopy[locale];
  const [sponsorOpen, setSponsorOpen] = useState(true);

  return (
    <div className="home-sections">
      {sponsorOpen && (
        <section className="home-card home-sponsor" aria-label={h.sponsored}>
          <span className="home-sponsor-icon" aria-hidden="true">
            <Layers3 size={20} />
          </span>
          <div className="home-sponsor-body">
            <p className="home-eyebrow">
              {h.sponsored}
              <span>{h.featured}</span>
            </p>
            <h2>{h.sponsoredTitle}</h2>
            <p>{h.sponsoredBody}</p>
          </div>
          <div className="home-sponsor-actions">
            <button
              type="button"
              className="home-cta"
              onClick={() => onSelectTool("invoice-excel")}
            >
              {h.tryNow}
            </button>
            <span>• {h.setup}</span>
          </div>
          <button
            type="button"
            className="home-dismiss"
            aria-label={h.dismiss}
            onClick={() => setSponsorOpen(false)}
          >
            <X size={16} />
          </button>
        </section>
      )}

      <div className="home-columns">
        <section className="home-card" aria-labelledby="home-my-pdfs">
          <p className="home-eyebrow" id="home-my-pdfs">
            {h.myPdfs}
          </p>
          <p className="home-counts">{h.counts}</p>
          <ul className="home-pdf-list">
            {samplePdfs.map((pdf, index) => (
              <li key={pdf.name}>
                <span className="home-pdf-size">{pdf.size}</span>
                <strong dir="ltr">{pdf.name}</strong>
                <small>{h.statuses[index]}</small>
                <button type="button" onClick={() => onOpenSample(pdf.name)}>
                  {h.open}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-card" aria-labelledby="home-wall">
          <p className="home-eyebrow">{h.wallEyebrow}</p>
          <h2 id="home-wall">{h.wallTitle}</h2>
          <ul className="home-reviews">
            {h.reviews.map((review) => (
              <li key={review.name}>
                <blockquote>“{review.quote}”</blockquote>
                <div>
                  <span className="home-review-avatar" aria-hidden="true">
                    {review.name.charAt(0)}
                  </span>
                  <span>
                    <strong>{review.name}</strong>
                    <small>{review.role}</small>
                  </span>
                  <span className="home-stars" role="img" aria-label="5/5">
                    ★★★★★
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="home-card home-multi" aria-labelledby="home-multi">
        <div>
          <p className="home-eyebrow">{h.multiEyebrow}</p>
          <h2 id="home-multi">{h.multiTitle}</h2>
          <p>{h.multiBody}</p>
          <div className="home-multi-actions">
            <button type="button" className="home-cta" onClick={onTryMulti}>
              {h.tryIt}
            </button>
            <button type="button" className="home-link" onClick={onLearnMore}>
              {h.learnMore}
            </button>
          </div>
        </div>
        <p className="home-bubble">{h.lexiFound}</p>
      </section>

      <section className="home-card" aria-labelledby="home-faq">
        <h2 id="home-faq" className="sr-only">
          {h.faqTitle}
        </h2>
        <div className="home-faq">
          {h.faq.map((item) => (
            <details key={item.q}>
              <summary>
                {item.q}
                <Plus size={16} aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="home-footer">{h.footer}</footer>
    </div>
  );
}
