// MOBILE-UX: arrow controls for the phone card carousels (CSS hides them on desktop).
export const carouselScroll = (id: string, dir: number) => {
  const el = document.getElementById(id);
  if (el) el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: "smooth" });
};

interface CarouselArrowsProps {
  id: string;
  middleCardBorder: string;
  middleCard: string;
  middleText: string;
}

export default function CarouselArrows({ id, middleCardBorder, middleCard, middleText }: CarouselArrowsProps) {
  return (
    <div className="carouselArrows" style={{ gap: "8px", alignItems: "center" }}>
      <button onClick={() => carouselScroll(id, -1)} aria-label="Previous cards" style={{ width: "30px", height: "30px", borderRadius: "999px", border: `1px solid ${middleCardBorder}`, background: middleCard, color: middleText, cursor: "pointer", fontSize: "14px" }}>←</button>
      <button onClick={() => carouselScroll(id, 1)} aria-label="Next cards" style={{ width: "30px", height: "30px", borderRadius: "999px", border: `1px solid ${middleCardBorder}`, background: middleCard, color: middleText, cursor: "pointer", fontSize: "14px" }}>→</button>
    </div>
  );
}
